import { ScrubHero } from "@/components/scrub-hero";
import { ProblemTimeline } from "@/components/problem-timeline";
import { MeetJarvis } from "@/components/meet-jarvis";
import { FeatureShowcase } from "@/components/feature-showcase";
import { TeamSpotlight } from "@/components/team-spotlight";
import { OutcomesSwitch } from "@/components/outcomes-switch";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteNav } from "@/components/site-nav";
import { ShieldIcon } from "@/components/icons";


function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="/"
      aria-label="jarvis"
      className={"wordmark text-2xl text-foreground " + (className ?? "")}
    >
      jarvis<span className="cursor-blink select-none" aria-hidden="true">_</span>
    </a>
  );
}

function SectionHeading({
  title,
  description,
  eyebrow: _eyebrow, // kept for API compat, not rendered
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h2
        className="font-display text-3xl font-medium leading-[1.2] tracking-[-0.64px] text-foreground sm:text-4xl text-balance"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-[1.4] tracking-[-0.18px] text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-24 bg-background">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="rounded-[32px] bg-pressed-charcoal px-6 py-14 text-center sm:px-12">
          <h2 className="font-display text-3xl font-medium leading-[1.2] tracking-[-0.64px] text-white sm:text-4xl text-balance">
            Get Jarvis for your team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-[1.4] tracking-[-0.18px] text-white/70 text-pretty">
            We&apos;re building this now and onboarding early teams. Leave your
            email and we&apos;ll be in touch.
          </p>
          <div className="mt-10 rounded-2xl bg-sky-wash p-5 sm:p-6">
            <WaitlistForm />
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
    <section id="faq" className="scroll-mt-24 bg-card">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <SectionHeading title="The questions you&apos;re already asking" />
        <div className="mt-12 divide-y divide-border/30">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-medium leading-[1.35] tracking-[-0.14px] text-foreground marker:content-none">
                {f.q}
                <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
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
              <p className="mt-3 text-sm leading-relaxed tracking-[-0.14px] text-muted-foreground">
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
    <footer className="border-t border-border/30 bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-3 text-foreground">
          <span className="wordmark text-sm">jarvis</span>
          <span className="text-xs text-fog">working title</span>
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
      <div className="fixed left-6 top-5 z-50 sm:left-8 sm:top-7">
        <Wordmark />
      </div>
      <SiteNav />

      <main className="flex-1">
        <ScrubHero />
        <ProblemTimeline />
        <MeetJarvis />
        <FeatureShowcase />
        <TeamSpotlight />
        <OutcomesSwitch />
        <WaitlistSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
