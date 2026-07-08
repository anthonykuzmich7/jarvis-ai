"use client";

import { Home, Clock, Layers, MessageSquare, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home",     url: "#",        icon: Home },
  { name: "Problem",  url: "#problem", icon: Clock },
  { name: "Features", url: "#features", icon: Layers },
  { name: "FAQ",      url: "#faq",     icon: MessageSquare },
];

export function SiteNav() {
  return (
    <NavBar
      items={navItems}
      cta={{ label: "Join waitlist", url: "#waitlist", icon: Mail }}
    />
  );
}
