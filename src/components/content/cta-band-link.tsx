"use client";

import Link from "next/link";
import { capture } from "@/lib/analytics";

/**
 * The "Get started" link inside CtaBand, split out for one reason: it
 * needs an onClick, and `primitives.tsx` is a server component imported by
 * server pages. Marking that whole file `"use client"` to name one event
 * would ship every content primitive to the browser for nothing.
 */
export function CtaBandLink() {
  return (
    <Link
      href="/download"
      onClick={() =>
        capture("early_access_clicked", {
          label: "Get started",
          placement: "cta_band",
        })
      }
      className="nt-btn nt-btn-primary relative mt-8"
    >
      Get started
    </Link>
  );
}
