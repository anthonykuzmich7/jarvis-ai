import type { NextConfig } from "next";

/*
  /ingest/* is PostHog, served from our own origin.

  Analytics loaded from a third-party domain is blocked for a meaningful share
  of an engineering audience, and a blocked request is a visitor who silently
  does not exist in any funnel. Proxying through a first-party path fixes that:
  the browser only ever talks to jarvis, and Vercel forwards the traffic.

  EU region — the rewrite destinations are what pins that, not the SDK config.
  Assets and ingestion live on different hosts, hence the split: static assets
  come from eu-assets, events go to eu.

  `skipTrailingSlashRedirect` is required. Without it Next answers some of
  PostHog's own API calls with a 308 to a slashed URL, and the SDK does not
  follow it.
*/

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
