"use server";

import { saveLead } from "@/lib/leads";

export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function joinWaitlist(
  _prev: WaitlistState,
  formData: FormData,
): Promise<WaitlistState> {
  // Honeypot — bots fill hidden fields, humans don't.
  if (formData.get("company_website")) {
    return { status: "success", message: "You're on the list." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() || undefined;

  if (!EMAIL_RE.test(email)) {
    return {
      status: "error",
      message: "Please enter a valid email address.",
    };
  }

  try {
    await saveLead({
      email,
      role,
      source: "landing-waitlist",
      createdAt: new Date().toISOString(),
    });
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  return {
    status: "success",
    message: "You're on the list. We'll be in touch soon.",
  };
}
