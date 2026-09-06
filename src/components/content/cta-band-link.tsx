"use client";

import Link from "next/link";
import { capture } from "@/lib/analytics";

/**
 * The "Get early access" link inside CtaBand, split out for one reason: it
 * needs an onClick, and `primitives.tsx` is a server component imported by
 * server pages. Marking that whole file `"use client"` to name one event
 * would ship every content primitive to the browser for nothing.
 */
export function CtaBandLink() {
  return (
    <Link
      href="/#waitlist"
      onClick={() =>
        capture("early_access_clicked", {
          label: "Get early access",
          placement: "cta_band",
        })
      }
      className="cta-shine relative mt-8 inline-flex cursor-pointer overflow-hidden whitespace-nowrap rounded-full bg-coal-ink px-6 py-3 text-[14px] font-semibold tracking-[-0.14px] text-white transition-colors hover:bg-graphite active:scale-[0.98]"
    >
      Get early access
    </Link>
  );
}
