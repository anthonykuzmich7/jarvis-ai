/*
  Google Sheets lead sink.

  Auth is a service-account JWT signed with Node's built-in crypto, so there
  is no googleapis dependency and no public endpoint to guard. See
  docs/google-sheets-setup.md for the four values this needs.
*/

import { createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

// Google mints 1-hour tokens. Retire ours a minute early so a request that
// starts just before expiry can't finish just after it.
const TOKEN_SKEW_MS = 60_000;

/** Header row, in column order. Also the order `appendLeadRow` writes. */
export const SHEET_COLUMNS = [
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
] as const;

export type SheetsConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
  tabName: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

/**
 * Reads Sheets credentials from the environment.
 * Returns null when they aren't configured, which is the normal state for
 * local dev and preview deploys — callers treat that as "no sink wired up"
 * rather than as an error.
 */
export function readSheetsConfig(): SheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!spreadsheetId || !clientEmail || !privateKey) return null;

  return {
    spreadsheetId,
    clientEmail,
    // Env vars can't hold real newlines, so the key arrives with literal
    // backslash-n sequences that OpenSSL won't parse.
    privateKey: privateKey.replace(/\\n/g, "\n"),
    tabName: process.env.GOOGLE_SHEETS_TAB_NAME || "Waitlist",
  };
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

async function getAccessToken(config: SheetsConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claims = {
    iss: config.clientEmail,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  };

  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claims))}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(config.privateKey);
  const assertion = `${unsigned}.${base64url(signature)}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Google token request failed (${res.status}): ${await res.text()}`,
    );
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - TOKEN_SKEW_MS,
  };
  return cachedToken.value;
}

/** Appends one row to the configured tab. Throws if Google rejects the write. */
export async function appendRow(
  config: SheetsConfig,
  values: readonly (string | number)[],
): Promise<void> {
  const token = await getAccessToken(config);

  // A bare tab name as the range lets Sheets find the existing table itself.
  const range = encodeURIComponent(`${config.tabName}!A:A`);
  // RAW, not USER_ENTERED: every value here originates from a public form, and
  // USER_ENTERED would turn a submitted string starting with `=` into a live
  // formula in the sheet.
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.spreadsheetId)}` +
    `/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(
      `Google Sheets append failed (${res.status}): ${await res.text()}`,
    );
  }
}
