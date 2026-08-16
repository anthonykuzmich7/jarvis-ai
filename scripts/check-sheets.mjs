#!/usr/bin/env node
/*
  Smoke-tests the Google Sheets connection before trusting the live form.

    node --env-file=.env.local scripts/check-sheets.mjs

  Writes the header row if the tab is empty, then appends one test row.
  Delete that row afterwards — it is a real row in your sheet.
*/

import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const tabName = process.env.GOOGLE_SHEETS_TAB_NAME || "Waitlist";

const COLUMNS = [
  "Timestamp",
  "Email",
  "Who they are",
  "Source",
  "Page",
  "Referrer",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "Country",
];

function fail(message) {
  console.error(`\n  FAILED: ${message}\n`);
  process.exit(1);
}

const missing = [
  ["GOOGLE_SHEETS_SPREADSHEET_ID", spreadsheetId],
  ["GOOGLE_SERVICE_ACCOUNT_EMAIL", clientEmail],
  ["GOOGLE_PRIVATE_KEY", privateKey],
]
  .filter(([, value]) => !value)
  .map(([name]) => name);

if (missing.length) {
  fail(
    `missing env var(s): ${missing.join(", ")}\n` +
      `  Run with: node --env-file=.env.local scripts/check-sheets.mjs`,
  );
}

const base64url = (input) => Buffer.from(input).toString("base64url");

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const unsigned =
    `${base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.` +
    `${base64url(
      JSON.stringify({
        iss: clientEmail,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud: TOKEN_URL,
        iat: now,
        exp: now + 3600,
      }),
    )}`;

  let signature;
  try {
    signature = createSign("RSA-SHA256").update(unsigned).sign(privateKey);
  } catch {
    fail(
      "could not sign with GOOGLE_PRIVATE_KEY.\n" +
        "  Check it is wrapped in double quotes and still contains its \\n sequences.",
    );
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${base64url(signature)}`,
    }),
  });

  if (!res.ok) {
    fail(
      `Google rejected the credentials (${res.status}): ${await res.text()}\n` +
        "  Usually a wrong service-account email, or the Sheets API not enabled.",
    );
  }
  return (await res.json()).access_token;
}

async function sheets(token, path, init = {}) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    },
  );

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 403) {
      fail(
        `access denied (403).\n  Share the sheet with ${clientEmail} as an Editor.\n  ${body}`,
      );
    }
    if (res.status === 404) {
      fail(`spreadsheet not found (404). Check GOOGLE_SHEETS_SPREADSHEET_ID.\n  ${body}`);
    }
    if (res.status === 400 && body.includes("Unable to parse range")) {
      fail(`no tab named "${tabName}". Rename the tab or set GOOGLE_SHEETS_TAB_NAME.`);
    }
    fail(`Sheets API error (${res.status}): ${body}`);
  }
  return res.json();
}

const token = await getAccessToken();
console.log("  ✓ authenticated as", clientEmail);

const range = encodeURIComponent(`${tabName}!A1:J1`);
const existing = await sheets(token, `/values/${range}`);

if (!existing.values?.length) {
  await sheets(token, `/values/${range}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [COLUMNS] }),
  });
  console.log(`  ✓ wrote header row to "${tabName}"`);
} else {
  console.log(`  ✓ tab "${tabName}" already has a header row`);
}

const appendRange = encodeURIComponent(`${tabName}!A:A`);
await sheets(
  token,
  `/values/${appendRange}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
  {
    method: "POST",
    body: JSON.stringify({
      values: [
        [
          new Date().toISOString(),
          "test@example.com",
          "IT / DevOps",
          "check-sheets-script",
          "/",
          "",
          "",
          "",
          "",
          "",
        ],
      ],
    }),
  },
);

console.log("  ✓ appended a test row — open the sheet, confirm it, then delete it\n");
