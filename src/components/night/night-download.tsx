"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { NightMark } from "@/components/night/night-mark";
import { useGaze } from "@/components/night/jarvis-window";
import { capture } from "@/lib/analytics";
import { attributionFields } from "@/lib/attribution";
import { requestDownloadLink, type WaitlistState } from "@/app/actions";
import type { Release } from "@/lib/release";

/*
  /download in the Night style: the app icon under the same sunrise the
  homepage hero sits in, one button, and the facts a downloader checks (version,
  size, macOS).

  Analytics are the ones the old page fired: `download_clicked` (with the
  version) and `download_link_requested` from the not-on-a-Mac form.
*/

/** True on a Mac, false elsewhere, null until the browser has been asked. */
function useIsMac(): boolean | null {
  return React.useSyncExternalStore(noSubscribe, detectMac, () => null);
}
const noSubscribe = () => () => {};
function detectMac(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? nav.platform ?? "";
  const mac = /mac/i.test(platform) || /Macintosh/.test(nav.userAgent);
  // iPadOS reports a Mac user agent; a touch screen rules it out.
  return mac && nav.maxTouchPoints < 2;
}

/** The app icon: a dark plate with the live face on it. The eyes follow you. */
function IconPlate() {
  const face = React.useRef<SVGSVGElement>(null);
  const { gaze, blink } = useGaze(face);
  return (
    <div aria-hidden className="nt-dl-icon">
      <NightMark ref={face} size={76} ground="#141416" gaze={gaze} blink={blink} />
    </div>
  );
}

function DownloadButton({ release }: { release: Release }) {
  const [phase, setPhase] = React.useState<"idle" | "starting" | "started">("idle");
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const label = phase === "starting" ? "Starting download…" : phase === "started" ? "Downloading" : "Download for Mac";

  return (
    <a
      href={release.url}
      data-phase={phase}
      aria-live="polite"
      className="nt-btn nt-btn-primary nt-dl-btn"
      onClick={() => {
        capture("download_clicked", { version: release.version });
        if (timer.current) clearTimeout(timer.current);
        setPhase("starting");
        timer.current = setTimeout(() => setPhase("started"), 1600);
      }}
    >
      <span aria-hidden className="nt-dl-fill" />
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10 }}>
        {phase === "started" ? <Check /> : <AppleIcon />}
        {label}
      </span>
    </a>
  );
}

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="nt-btn nt-btn-primary nt-dl-send">
      {pending ? "Sending…" : "Email me the link"}
    </button>
  );
}

const initialState: WaitlistState = { status: "idle", message: "" };

function NotOnAMac() {
  const [state, formAction] = React.useActionState(requestDownloadLink, initialState);

  React.useEffect(() => {
    if (state.status === "success") capture("download_link_requested");
  }, [state.status]);

  if (state.status === "success") {
    return (
      <p className="nt-dl-note" style={{ fontSize: 16 }}>
        We&apos;ll send the link to <b style={{ color: "#F4F4F5", fontWeight: 600 }}>{state.email}</b>. Open it on your Mac.
      </p>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: 460, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>Jarvis is a Mac app.</p>
      <p className="nt-dl-note" style={{ margin: 0 }}>We&apos;ll email you the link to open there.</p>
      <form action={formAction} className="nt-dl-form">
        <label htmlFor="download-email" className="sr-only">
          Email
        </label>
        <input
          id="download-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
        />
        {/* Honeypot, same as the waitlist form. */}
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden style={{ display: "none" }} />
        {Object.entries(attributionFields()).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <SendButton />
      </form>
      {state.status === "error" && (
        <p role="alert" style={{ margin: 0, fontSize: 13, color: "#F87171" }}>
          {state.message}
        </p>
      )}
    </div>
  );
}

function megabytes(bytes: number): string | null {
  return bytes > 0 ? `${Math.round(bytes / 1_000_000)} MB` : null;
}

export function NightDownload({ release }: { release: Release }) {
  const isMac = useIsMac();
  const facts = [`Version ${release.version}`, megabytes(release.size), `macOS ${release.minimumSystemVersion} or later`].filter(Boolean);

  return (
    <>
      <section className="nt-wrap nt-dl-hero">
        <div style={{ position: "relative", isolation: "isolate", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* The homepage's sunrise, smaller, rising behind the icon. Anchored to
              the icon, not the section, so it stays behind it at any height. */}
          <div aria-hidden className="nt-glow" style={{ zIndex: -1, top: -136, width: 1300, maxWidth: "160vw", height: 560, background: "radial-gradient(ellipse 45% 55% at 50% 30%, rgba(255,110,40,0.42) 0%, rgba(220,80,20,0.20) 40%, rgba(120,40,10,0.08) 65%, transparent 85%)", filter: "blur(30px)" }} />
          <div aria-hidden className="nt-glow" style={{ zIndex: -1, top: -56, width: 420, height: 260, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,170,90,0.55), transparent 70%)", filter: "blur(24px)" }} />

          <IconPlate />
          <h1>
            Jarvis for <span className="nt-mark">your</span> Mac.
          </h1>
          <p className="nt-dl-lede">Jarvis reads your Slack, Gmail and calendar, then tells you what needs you today.</p>

          <div style={{ marginTop: 40, width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {isMac === false ? <NotOnAMac /> : <DownloadButton release={release} />}
          </div>

          <p className="nt-dl-facts">
            {facts.join(" · ")}
          </p>
        </div>
      </section>

    </>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        fill="currentColor"
        d="M16.37 12.6c-.02-2.2 1.8-3.26 1.88-3.31-1.03-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.88-.76-1.48.02-2.85.86-3.61 2.19-1.54 2.67-.39 6.62 1.11 8.79.73 1.06 1.61 2.25 2.75 2.2 1.1-.04 1.52-.71 2.86-.71 1.33 0 1.71.71 2.88.69 1.19-.02 1.94-1.08 2.67-2.14.84-1.23 1.19-2.42 1.21-2.48-.03-.01-2.32-.89-2.34-3.55zM14.18 6.13c.61-.74 1.02-1.76.91-2.78-.88.04-1.94.59-2.57 1.32-.56.65-1.06 1.69-.93 2.69.98.08 1.98-.5 2.59-1.23z"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
