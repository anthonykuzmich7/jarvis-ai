/*
  Lead storage seam.

  Right now this just logs the signup so the waitlist form works end to end.
  To actually persist leads for validation, wire one of these up inside
  `saveLead` (all work on Vercel):

    - Upstash Redis or Neon Postgres via the Vercel Marketplace
    - A form service (Formspree, Resend audience, Loops, ConvertKit)
    - A Google Sheet via an API route

  Keep the signature stable so the form and server action don't change.
*/

export type Lead = {
  email: string;
  role?: string;
  source: string;
  createdAt: string;
};

export async function saveLead(lead: Lead): Promise<void> {
  // TODO: replace with a real datastore. See note above.
  console.log("[waitlist] new signup:", JSON.stringify(lead));
}
