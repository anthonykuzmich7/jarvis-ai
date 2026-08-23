"use client";

import type { ReactNode } from "react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "#home" },
  { name: "Product", url: "#product" },
  { name: "Why Jarvis", url: "#problem" },
  { name: "Features", url: "#features" },
  { name: "FAQ", url: "#faq" },
];

export function SiteNav({ brand }: { brand?: ReactNode }) {
  return (
    <NavBar
      items={navItems}
      cta={{ label: "Get early access", url: "#waitlist" }}
      brand={brand}
    />
  );
}
