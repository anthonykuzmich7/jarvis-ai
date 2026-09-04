"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

/*
  PostHog, initialised once on the client.

  Three things here are deliberate.

  `api_host` is "/ingest", not eu.i.posthog.com. Every request goes out to our
  own origin and `next.config.ts` rewrites it onward. Blocking a first-party
  path is something no ad blocker does by default, and a landing page whose
  audience is engineers loses a real slice of its traffic to blocked analytics
  otherwise. `ui_host` then has to be spelled out, because with a proxied
  api_host PostHog can no longer work out which dashboard "open in PostHog"
  links should point at.

  `defaults` pins the behaviour set rather than letting it drift with the SDK:
  pageviews on history changes (which is what App Router navigation is), and
  scripts injected into <head> so nothing mutates the DOM mid-hydration.

  Session recording is off. The page has one form and it collects a work email;
  replaying strangers typing their address into it is not worth the insight, and
  keeping it off means nothing here needs a consent banner it does not have.

  The key arrives as a prop from the server layout rather than being read from
  `process.env` here. A project API key has to reach the browser for any of this
  to work — it is a write-only ingestion token and that is by design — but Next
  will only inline a variable into the client bundle if it is named
  `NEXT_PUBLIC_*`, and ours is stored on Vercel as a plain secret. Reading it
  server-side and passing it down gets the same value into the same place
  without keeping a second, differently-named copy of it around.
*/

export function PostHogAnalytics({
  apiKey,
  children,
}: {
  /** Undefined whenever the environment has no key — the normal local state. */
  apiKey?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // No key is the normal state locally and in any fork. Stay silent.
    if (!apiKey || posthog.__loaded) return;

    posthog.init(apiKey, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2026-08-30",

      // Clicks, form submits and route changes, with no per-element code.
      autocapture: true,

      // Click maps and scroll depth. The long scroll-driven sections are the
      // whole pitch, so how far down them people actually get is the number
      // worth having.
      capture_heatmaps: true,

      disable_session_recording: true,

      // Only people who hand over an email get a stored profile; everyone else
      // stays an anonymous event stream.
      person_profiles: "identified_only",
    });

    /* Preview deploys and `next dev` hit the same project as production. Stamp
       every event so a dashboard can exclude them, the way the waitlist action
       already labels non-production leads before they reach the sheet. */
    posthog.register({
      environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    });
  }, [apiKey]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
