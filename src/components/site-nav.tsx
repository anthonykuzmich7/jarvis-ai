"use client";

import { Home, Clock, Box, Layers, MessageSquare, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home",     url: "#home",     icon: Home },
  { name: "Product",  url: "#product",  icon: Box },
  { name: "Problem",  url: "#problem",  icon: Clock },
  { name: "Features", url: "#features", icon: Layers },
  { name: "FAQ",      url: "#faq",      icon: MessageSquare },
];

export function SiteNav() {
  return (
    <NavBar
      items={navItems}
      cta={{ label: "Get early access", url: "#waitlist", icon: Mail }}
    />
  );
}
