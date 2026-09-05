# Google Sheets waitlist setup

Waitlist signups append a row to a Google Sheet. This is the one-time setup.

**What you need to end up with — four values:**

| Env var | Where it comes from |
| --- | --- |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | the sheet's URL |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | the downloaded JSON key |
| `GOOGLE_PRIVATE_KEY` | the downloaded JSON key |
| `GOOGLE_SHEETS_TAB_NAME` | the tab name, defaults to `Waitlist` |

Until these are set, the form still works — signups log to the server console
instead of the sheet. Nothing breaks in local dev or preview deploys.

---

## 1. Create the sheet

1. Go to [sheets.new](https://sheets.new) and name it something like `Jarvis — Waitlist`.
2. Rename the bottom tab from `Sheet1` to **`Waitlist`**.
3. Copy the ID out of the URL — the part between `/d/` and `/edit`:

   ```
   https://docs.google.com/spreadsheets/d/1AbC...XyZ/edit
                                          └──── this ────┘
   ```

   → that's `GOOGLE_SHEETS_SPREADSHEET_ID`.

Leave the sheet empty. The check script in step 5 writes the header row.

## 2. Create a Google Cloud project and enable the Sheets API

1. Open [console.cloud.google.com](https://console.cloud.google.com/).
2. Project dropdown (top bar) → **New project** → name it `jarvis-waitlist` → **Create**.
   Make sure that project is selected before continuing.
3. Go to [Google Sheets API](https://console.cloud.google.com/apis/library/sheets.googleapis.com) → **Enable**.

This is free. The Sheets API has no cost at any volume you'll see from a waitlist.

## 3. Create the service account and download its key

A service account is a robot user with its own email address. It only gets
access to sheets you explicitly share with it.

1. Go to [Credentials](https://console.cloud.google.com/apis/credentials) →
   **Create credentials** → **Service account**.
2. Name it `waitlist-writer` → **Create and continue**.
3. Skip the optional role and access steps → **Done**.
4. Click the new service account → **Keys** tab → **Add key** → **Create new key** → **JSON** → **Create**.

A `.json` file downloads. Open it — you need two fields:

```json
{
  "client_email": "waitlist-writer@jarvis-waitlist.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
}
```

- `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `private_key` → `GOOGLE_PRIVATE_KEY`

> **Treat this file like a password.** Don't commit it. Delete it once the env
> vars are set. If it leaks, delete the key in the Keys tab and make a new one.

## 4. Share the sheet with the service account

This is the step people forget, and it produces a `403` if skipped.

1. Open the sheet → **Share**.
2. Paste the `client_email` value from step 3.
3. Set it to **Editor**.
4. Untick "Notify people" (it's a robot) → **Share**.

## 5. Set the env vars and verify

**Locally** — copy `.env.example` to `.env.local` and fill it in. The private key
must stay wrapped in double quotes with its `\n` sequences intact:

```bash
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
```

Then run the check script. It authenticates, writes the header row, and appends
one test row:

```bash
node --env-file=.env.local scripts/check-sheets.mjs
```

Expected output:

```
  ✓ authenticated as waitlist-writer@jarvis-waitlist.iam.gserviceaccount.com
  ✓ wrote header row to "Waitlist"
  ✓ appended a test row — open the sheet, confirm it, then delete it
```

Open the sheet, confirm the test row is there, then delete that row.

**On Vercel** — add the same four variables under
Settings → Environment Variables (Production + Preview), or from the CLI:

```bash
vercel env add GOOGLE_SHEETS_SPREADSHEET_ID production
vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL production
vercel env add GOOGLE_PRIVATE_KEY production
vercel env add GOOGLE_SHEETS_TAB_NAME production
```

When pasting `GOOGLE_PRIVATE_KEY` into the Vercel dashboard, paste the value
**exactly as it appears in the JSON**, including the `\n` sequences, without the
surrounding quotes. Redeploy after adding them — env vars are read at runtime,
but a redeploy is the simplest way to be sure.

---

## What lands in the sheet

One row per signup:

| Column | Example | Notes |
| --- | --- | --- |
| Timestamp | `2026-08-16T14:03:11.204Z` | UTC, ISO 8601 — sorts correctly as text |
| Email | `dana@acme.io` | validated before the write |
| Who they are | `IT / DevOps` | from the dropdown; blank if they skipped it |
| Source | `landing-waitlist` | which form they used |
| Page | `/` | page they signed up on |
| Referrer | `https://news.ycombinator.com/` | blank for direct traffic |
| UTM Source | `linkedin` | from `?utm_source=` |
| UTM Medium | `social` | from `?utm_medium=` |
| UTM Campaign | `launch` | from `?utm_campaign=` |
| Country | `PL` | two-letter code, from Vercel's edge — blank locally |
| UTM Content | `bio` | from `?utm_content=` — which placement, not which channel |

Values are written with `valueInputOption=RAW`, so a submission starting with
`=` is stored as text rather than executed as a formula.

## The traffic side

The sheet answers "who signed up and where did they come from". For "how many
people visited at all", the site sends [Vercel Web
Analytics](https://vercel.com/docs/analytics) — `<Analytics />` in
`src/app/layout.tsx`. Enable it once in the Vercel dashboard under your project's
**Analytics** tab.

A successful signup also fires a `waitlist_signup` custom event, so the Analytics
dashboard shows visits → signups as a conversion rate alongside the traffic
sources. Custom events need Web Analytics enabled to appear.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| `403` access denied | Sheet not shared with the service account (step 4), or shared as Viewer instead of Editor |
| `404` not found | Wrong `GOOGLE_SHEETS_SPREADSHEET_ID` — check you copied the ID, not the whole URL |
| `Unable to parse range` | Tab name doesn't match `GOOGLE_SHEETS_TAB_NAME` (case-sensitive) |
| `could not sign with GOOGLE_PRIVATE_KEY` | The `\n` sequences were mangled, or the quotes were dropped |
| `Google has not been used in project ... before` | Sheets API not enabled (step 2) |
| Form says "Something went wrong" | Check the Vercel function logs — the real error is logged there |

## Where this lives in the code

- `src/lib/google-sheets.ts` — JWT auth and the append call
- `src/lib/leads.ts` — maps a lead to a row; no-ops when unconfigured
- `src/app/actions.ts` — validation, country header, calls `saveLead`
- `src/components/waitlist-form.tsx` — the form and attribution capture
- `scripts/check-sheets.mjs` — the setup verifier
