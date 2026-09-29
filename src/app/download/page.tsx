import type { Metadata } from "next";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter, Wordmark } from "@/components/site-shell";
import { DownloadHero } from "@/components/download/download-hero";
import { latestRelease } from "@/lib/release";

/* Re-read the appcast on this cadence, so a release shows up here within
   minutes without a redeploy. Must be a literal for Next's static analysis;
   keep it equal to RELEASE_REVALIDATE in lib/release.ts. */
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Download Jarvis for Mac",
  description:
    "Download Jarvis for macOS. Jarvis reads Slack, Gmail and your calendar and opens on one sentence about your day.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Jarvis for Mac",
    description:
      "Jarvis reads Slack, Gmail and your calendar and opens on one sentence about your day.",
    url: "/download",
  },
};

export default async function DownloadPage() {
  const release = await latestRelease();

  return (
    <>
      <SiteNav brand={<Wordmark />} offSite />
      <main className="flex flex-1 flex-col bg-ledger-white pt-[72px] sm:pt-[84px]">
        <DownloadHero release={release} />
      </main>
      <SiteFooter />
    </>
  );
}
