import { HeroAsk } from "@/components/hero/hero-ask";
import { StrugglesSection } from "@/components/struggles-section";
import { ConnectAnywhere } from "@/components/connect-anywhere";
import { PaperGlow } from "@/components/paper-glow";
import { JarvisOverlaySection } from "@/components/jarvis-overlay-section";
import { FeatureShowcase } from "@/components/feature-showcase";
import { OutcomesSwitch } from "@/components/outcomes-switch";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter, Wordmark } from "@/components/site-shell";
import { faqs } from "@/lib/faqs";
import { homeJsonLd, jsonLdString } from "@/lib/structured-data";




function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-16 bg-ledger-white">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-6 sm:py-28">
        {/* Contained card with Panxo video background */}
        <div
          className="relative rounded-[20px]"
          style={{
            boxShadow:
              "rgba(95,99,106,0.14) 0px 0px 0px 1px, rgba(43,43,48,0.2) 0px 12px 48px 0px",
          }}
        >
          {/* Background video — same source as panxo.com hero */}
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover rounded-[20px]"
            src="https://framerusercontent.com/assets/JSWnPN9pwLkqzwQU31viRhMAJA.mp4"
          />

          {/* Content */}
          <div className="relative z-10 px-5 py-14 text-center sm:px-16 sm:py-24">
            <h2 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-1px] text-coal-ink text-balance sm:text-[40px] sm:tracking-[-1.44px] lg:text-[52px] lg:tracking-[-2px]">
              Get Jarvis for your team
            </h2>

            {/* Frosted glass form card */}
            <div
              className="mx-auto mt-8 max-w-3xl rounded-2xl bg-white/80 px-4 py-6 backdrop-blur-md sm:mt-12 sm:px-10 sm:py-8"
              style={{
                boxShadow:
                  "rgba(255,255,255,0.35) 0px 0px 0px 1px, rgba(43,43,48,0.1) 0px 4px 24px 0px",
              }}
            >
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-16 bg-ledger-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-28">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-[2fr_3fr] lg:gap-24">

          {/* Left — sticky heading block */}
          <div className="lg:pt-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-graphite">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-[28px] font-bold leading-[1.13] tracking-[-0.84px] text-coal-ink sm:text-[32px] sm:tracking-[-0.96px] lg:text-[40px] lg:tracking-[-1.2px]">
              Questions you&apos;re already asking.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] tracking-[-0.12px] text-slate-mid">
              Still have something on your mind?{" "}
              <a
                href="mailto:hello@jarviscontext.com"
                className="font-medium text-coal-ink underline underline-offset-2 hover:text-graphite transition-colors"
              >
                Drop us a line.
              </a>
            </p>
          </div>

          {/* Right — accordion */}
          <div className="divide-y divide-ash border-t border-ash">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left [&::-webkit-details-marker]:hidden sm:gap-6">
                  <span className="text-[15px] font-semibold leading-[1.4] tracking-[-0.2px] text-coal-ink group-open:text-coal-ink sm:text-[16px]">
                    {f.q}
                  </span>
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ash bg-white text-graphite transition-transform duration-200 group-open:rotate-45"
                    style={{ boxShadow: "rgba(95,99,106,0.08) 0px 0px 0px 1px" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-[14px] leading-[1.65] tracking-[-0.1px] text-slate-mid">
                  {f.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      {/* Organization + WebSite + SoftwareApplication + FAQPage, as one @graph.
          Rendered server-side in the page body: crawlers read JSON-LD anywhere
          in the document, and keeping it beside the page it describes means the
          noindexed /compare route does not inherit an FAQ schema for content it
          does not have. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd) }}
      />

      {/* One nav for both. On mobile it splits into a translucent top bar
          carrying the brand and a bottom-fixed pill carrying the sections;
          on desktop both live in the single fixed bar. */}
      <SiteNav brand={<Wordmark />} />

      {/* One tree, one set of section ids. There used to be a second,
          mobile-only tree (`MobileLayout`) rendered beside this one, which
          meant every section existed twice and the two copies drifted:
          different copy, different features, and anchors the mobile nav
          could not reach, because `#problem` and friends resolved to the
          desktop sections that were `display:none` at that width. The
          sections below are responsive instead. */}
      <main className="flex flex-1 flex-col" style={{ backgroundColor: "#FBFEFD" }}>
        {/* The hero and Connect share one sheet of paper and one light.
            Both sections clip their own overflow, so a glow living
            inside either of them got sliced at the boundary and drew a
            hard rule between the two. Hanging it here instead lets it
            cross. `overflow-x-clip` rather than `overflow-x-hidden`:
            clip stops the sideways bleed without making this a scroll
            container, which would clip vertically and undo the point. */}
        <div className="relative isolate overflow-x-clip bg-ledger-white">
          <PaperGlow />
          <HeroAsk />
          <ConnectAnywhere />
        </div>
        <JarvisOverlaySection />
        <StrugglesSection />
        <FeatureShowcase />
        <OutcomesSwitch />
        <FaqSection />
        <WaitlistSection />
      </main>

      <SiteFooter />
    </>
  );
}
