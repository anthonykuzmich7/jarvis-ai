/*
  Lead storage seam.

  Leads land in a Google Sheet (see docs/google-sheets-setup.md). When the
  credentials aren't set — local dev, preview deploys — this logs the signup
  instead so the form still works end to end.

  Keep the signature stable so the form and server action don't change.
*/

import { appendRow, readSheetsConfig } from "@/lib/google-sheets";
import { roleLabel } from "@/lib/roles";

export type Lead = {
  email: string;
  role?: string;
  source: string;
  createdAt: string;
  /** Path the signup happened on, e.g. "/" or "/compare". */
  page?: string;
  /** External referrer, blank for direct traffic and same-site navigation. */
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  /** Placement within the channel — which post or placement, not which channel. */
  utmContent?: string;
  /** Two-letter country from Vercel's edge geo header. */
  country?: string;
};

/** Builds the row in SHEET_COLUMNS order. */
function toRow(lead: Lead): string[] {
  return [
    lead.createdAt,
    lead.email,
    roleLabel(lead.role),
    lead.source,
    lead.page ?? "",
    lead.referrer ?? "",
    lead.utmSource ?? "",
    lead.utmMedium ?? "",
    lead.utmCampaign ?? "",
    lead.country ?? "",
    /* Appended after Country rather than filed beside the other UTM columns.
       The sheet already holds rows written in the old order, and inserting a
       column mid-row would shift every historical Country value one cell to
       the right. New columns go on the end. */
    lead.utmContent ?? "",
  ];
}

export async function saveLead(lead: Lead): Promise<void> {
  const config = readSheetsConfig();

  if (!config) {
    console.log("[waitlist] no Sheets config, logging only:", JSON.stringify(lead));
    return;
  }

  // Let this throw: a dropped lead should surface as a retryable error in the
  // form rather than a silent success.
  await appendRow(config, toRow(lead));
}
