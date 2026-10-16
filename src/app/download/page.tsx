import type { Metadata } from "next";
import { NightFooter, NightNav } from "@/components/night/night-shell";
import { NightDownload } from "@/components/night/night-download";
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
    <div className="nt">
      <div className="nt-tiles" aria-hidden />
      <NightNav home={false} action="film" />
      <main>
        <NightDownload release={release} />
      </main>
      <NightFooter home={false} />
    </div>
  );
}
