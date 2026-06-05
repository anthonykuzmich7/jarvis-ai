"use client";

import { Home, Clock, Layers, MessageSquare, Mail } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";

const navItems = [
  { name: "Home", url: "#", icon: Home },
  { name: "Problem", url: "#problem", icon: Clock },
  { name: "Product", url: "#features", icon: Layers },
  { name: "FAQ", url: "#faq", icon: MessageSquare },
  { name: "Waitlist", url: "#waitlist", icon: Mail },
];

export function SiteNav() {
  return <NavBar items={navItems} />;
}
