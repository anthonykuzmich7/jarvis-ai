/*
  The latest macOS build, read from the same Sparkle appcast the app itself
  checks for updates. One feed means the download page can never offer a
  different version than an installed copy would update to, and a release
  needs no edit here: `release.sh` publishes the appcast, and this page picks
  it up on its next revalidation.

  The appcast lists newest first, and inside an <item> the full .dmg
  enclosure comes before the <sparkle:deltas> block, so the first match of
  each field in the first item is the one we want.
*/

export const APPCAST_URL =
  "https://raw.githubusercontent.com/anthonykuzmich7/jarvis-releases/main/appcast.xml";

/** How often the page re-reads the appcast, in seconds. */
export const RELEASE_REVALIDATE = 600;

export type Release = {
  version: string;
  url: string;
  /** Bytes, from the enclosure. */
  size: number;
  /** e.g. "14.0" */
  minimumSystemVersion: string;
};

/* Served when the appcast cannot be read, so a GitHub hiccup costs a stale
   version number rather than a page with no download button. */
const FALLBACK: Release = {
  version: "0.19.24",
  url: "https://github.com/anthonykuzmich7/jarvis-releases/releases/download/downloads/Jarvis-0.19.24.dmg",
  size: 37731106,
  minimumSystemVersion: "14.0",
};

export function parseAppcast(xml: string): Release | null {
  const item = xml.match(/<item>([\s\S]*?)<\/item>/)?.[1];
  if (!item) return null;

  const version = item.match(
    /<sparkle:shortVersionString>([^<]+)<\/sparkle:shortVersionString>/,
  )?.[1];
  const enclosure = item.match(/<enclosure\b[^>]*>/)?.[0];
  const url = enclosure?.match(/\burl="([^"]+)"/)?.[1];
  const size = Number(enclosure?.match(/\blength="(\d+)"/)?.[1] ?? 0);
  const minimumSystemVersion =
    item.match(
      /<sparkle:minimumSystemVersion>([^<]+)<\/sparkle:minimumSystemVersion>/,
    )?.[1] ?? FALLBACK.minimumSystemVersion;

  if (!version || !url || !url.endsWith(".dmg")) return null;
  return { version, url, size, minimumSystemVersion };
}

export async function latestRelease(): Promise<Release> {
  try {
    const res = await fetch(APPCAST_URL, {
      next: { revalidate: RELEASE_REVALIDATE },
    });
    if (!res.ok) throw new Error(`appcast ${res.status}`);
    return parseAppcast(await res.text()) ?? FALLBACK;
  } catch (error) {
    console.error("[download] could not read the appcast:", error);
    return FALLBACK;
  }
}
