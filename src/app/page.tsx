import { ScrubHero } from "@/components/scrub-hero";
import { ProblemSection } from "@/components/problem-section";
import { OrbitSyncJarvis } from "@/components/orbit-sync-jarvis";
import { JarvisOverlaySection } from "@/components/jarvis-overlay-section";
import { FeatureShowcase } from "@/components/feature-showcase";
import { OutcomesSwitch } from "@/components/outcomes-switch";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteNav } from "@/components/site-nav";
import { ShieldIcon } from "@/components/icons";


function JarvisFace({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <circle cx="24" cy="24" r="24" fill="#0E1A43" />
      <ellipse cx="29.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
      <ellipse cx="17.9609" cy="20.895" rx="3" ry="7" fill="#C5F4FF" />
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="/"
      aria-label="jarvis"
      className={"flex items-center gap-2.5 " + (className ?? "")}
    >
      <JarvisFace className="h-[32px] w-[32px] shrink-0" />
      <span className="wordmark text-xl text-foreground leading-none">
        jarvis<span className="cursor-blink select-none" aria-hidden="true">_</span>
      </span>
    </a>
  );
}

function SectionHeading({
  title,
  description,
  eyebrow: _eyebrow,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className="font-display text-3xl font-semibold leading-[1.15] tracking-[-0.64px] text-foreground sm:text-4xl text-balance"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-[17px] leading-[1.5] tracking-[-0.16px] text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-24 bg-ledger-white">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
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
          <div className="relative z-10 px-8 py-20 text-center sm:px-16 sm:py-24">
            <h2 className="font-display text-[40px] font-bold leading-[1.1] tracking-[-1.44px] text-coal-ink text-balance sm:text-[52px] sm:tracking-[-2px]">
              Get Jarvis for your team
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-[17px] leading-[1.55] tracking-[-0.16px] text-graphite text-pretty">
              We&apos;re building this now and onboarding early teams. Leave
              your email and we&apos;ll be in touch.
            </p>

            {/* Frosted glass form card */}
            <div
              className="mx-auto mt-12 max-w-3xl rounded-2xl bg-white/80 px-8 py-8 backdrop-blur-md sm:px-10"
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
  const faqs = [
    {
      q: "How does Jarvis grant access safely?",
      a: "Access is the sensitive part, so it runs on rules you define, with approvals where you want them and a full audit trail. You decide what Jarvis can grant on its own and what still needs a human yes.",
    },
    {
      q: "What about data privacy?",
      a: "Jarvis separates your personal work context (your Slack, meetings, contacts) from shared company knowledge. You control what teammates and admins can see.",
    },
    {
      q: "What does it connect to?",
      a: "Slack and your knowledge base to start, with identity, code hosting, meetings, and cloud on the roadmap. He also exposes context to AI tools over MCP.",
    },
    {
      q: "Is it available today?",
      a: "We're in early access and validating with design partners. Join the waitlist and we'll reach out as we open spots.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 bg-ledger-white">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <SectionHeading title="The questions you&apos;re already asking" />
        <div className="mt-12 divide-y divide-ash">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold leading-[1.35] tracking-[-0.14px] text-foreground marker:content-none">
                {f.q}
                <span className="shrink-0 text-graphite transition-transform group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    className="h-5 w-5"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed tracking-[-0.12px] text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-ash bg-ledger-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-3 text-foreground">
          <JarvisFace className="h-[22px] w-[22px]" />
          <span className="wordmark text-sm">jarvis</span>
          <span className="text-xs text-stone">working title</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldIcon className="h-4 w-4" />
          Built for IT companies. Early access.
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      {/* Brand mark fixed top-left; tubelight nav floats top-center / bottom on mobile. */}
      <div className="fixed left-6 top-5 z-50 sm:left-8 sm:top-6">
        <Wordmark />
      </div>
      <SiteNav />

      <main className="flex-1">
        <ScrubHero />
        <ProblemSection />
        <OrbitSyncJarvis />
        <JarvisOverlaySection />
        <FeatureShowcase />
        <OutcomesSwitch />
        <WaitlistSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
