import { latestRelease } from "@/lib/release";

/*
  The one link to share: jarviscontext.com/download/mac starts the newest
  .dmg straight away. Nobody needs a GitHub account and nobody sees a GitHub
  page, and if the file ever moves off GitHub, only this redirect changes.

  The redirect is 302, not 301, on purpose. A browser keeps a permanent
  redirect for good, so it would keep handing out whatever version it saw
  first. `latestRelease` already caches the appcast for RELEASE_REVALIDATE
  seconds, so the handler itself stays uncached.
*/
export async function GET() {
  const release = await latestRelease();
  return new Response(null, {
    status: 302,
    headers: {
      Location: release.url,
      "Cache-Control": "no-store",
    },
  });
}
