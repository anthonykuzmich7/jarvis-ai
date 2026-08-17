"use server";

import { headers } from "next/headers";
import { saveLead } from "@/lib/leads";
import { ROLE_OPTIONS } from "@/lib/roles";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Echoed back on success so the confirmation can name the address we captured. */
  email?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Attribution fields come from the browser, so cap them before they reach the
// sheet. Long enough for a real referrer or campaign name, short enough that a
// junk submission can't bloat a row.
const MAX_ATTRIBUTION_LEN = 300;

function attribution(formData: FormData, field: string): string {
  return String(formData.get(field) ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .trim()
    .slice(0, MAX_ATTRIBUTION_LEN);
}

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  // Honeypot — bots fill hidden fields, humans don't.
  if (formData.get("company_website")) {
    return { status: "success", message: "You're on the list." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const submittedRole = String(formData.get("role") ?? "").trim();
  const role = ROLE_OPTIONS.some((option) => option.value === submittedRole)
    ? submittedRole
    : undefined;

  if (!EMAIL_RE.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  // Vercel sets this at the edge; absent locally.
  const country = (await headers()).get("x-vercel-ip-country") ?? "";

  try {
    await saveLead({
      email,
      role,
      source: "landing-waitlist",
      createdAt: new Date().toISOString(),
      page: attribution(formData, "page"),
      referrer: attribution(formData, "referrer"),
      utmSource: attribution(formData, "utm_source"),
      utmMedium: attribution(formData, "utm_medium"),
      utmCampaign: attribution(formData, "utm_campaign"),
      country,
    });
  } catch (error) {
    // Log the cause — the visitor only ever sees the generic message.
    console.error("[waitlist] failed to save lead:", error);
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return {
    status: "success",
    message: "",
    email,
  };
}
