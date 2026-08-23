"use client";

import type { ReactNode } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";

/* On the homepage the nav scrolls between sections, so bare hashes are right.
   Off it there are no such sections — `#faq` on /mcp resolves to nothing — so
   the same labels have to point back at the homepage instead. NavBar already
   ignores any href that is not a live in-page anchor and lets Next route it
   normally, so one component serves both. */
const sectionItems = [
  { name: "Home", url: "#home" },
  { name: "Product", url: "#product" },
  { name: "Why Jarvis", url: "#problem" },
  { name: "Features", url: "#features" },
  { name: "FAQ", url: "#faq" },
];

const offSiteItems = sectionItems.map((item) => ({
  ...item,
  url: item.url === "#home" ? "/" : `/${item.url}`,
}));

export function SiteNav({
  brand,
  offSite = false,
}: {
  brand?: ReactNode;
  /** True on any page that is not the homepage. */
  offSite?: boolean;
}) {
  return (
    <NavBar
      items={offSite ? offSiteItems : sectionItems}
      cta={{ label: "Get early access", url: offSite ? "/#waitlist" : "#waitlist" }}
      brand={brand}
    />
  );
}
