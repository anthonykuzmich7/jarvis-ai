import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Jarvis AI — your new hire's first teammate",
  description:
    "Jarvis is an AI teammate that grants new hires their access and answers their onboarding questions — so people are productive on day one, and IT stops being the bottleneck.",
  openGraph: {
    title: "Jarvis AI — your new hire's first teammate",
    description:
      "Onboard new hires and grant their access without an IT specialist. Productive on day one instead of week two.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
