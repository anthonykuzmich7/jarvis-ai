import { JarvisHero } from "@/components/jarvis-hero";
import { ProblemTimeline } from "@/components/problem-timeline";
import { MeetJarvis } from "@/components/meet-jarvis";
import { FeatureShowcase } from "@/components/feature-showcase";
import { TeamSpotlight } from "@/components/team-spotlight";
import { OutcomesSwitch } from "@/components/outcomes-switch";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteNav } from "@/components/site-nav";
import { ShieldIcon } from "@/components/icons";

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <rect width="24" height="24" rx="7" fill="currentColor" />
      <path
        d="M12 6v7.5a2.5 2.5 0 1 1-2.5-2.5"
        stroke="white"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8" r="1.3" fill="white" />
    </svg>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="#"
      className={
        "flex items-center gap-2 text-lg font-extrabold tracking-tight text-foreground " +
        (className ?? "")
      }
    >
      <Logo className="h-7 w-7 text-foreground" />
      Jarvis<span className="text-muted-foreground">AI</span>
    </a>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function WaitlistSection() {
  return (
    <section id="waitlist" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="rounded-3xl bg-primary px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
            Get Jarvis for your team
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80 text-pretty">
            We&apos;re building this now and onboarding early teams. Leave your
            email and we&apos;ll be in touch.
          </p>
          <div className="mt-10 rounded-2xl bg-background p-5 sm:p-6">
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
    <section id="faq" className="scroll-mt-24 border-t border-border bg-muted">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <SectionHeading eyebrow="FAQ" title="The questions you're already asking" />
        <div className="mt-12 divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-semibold text-foreground marker:content-none">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
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
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2 font-extrabold tracking-tight text-foreground">
          <Logo className="h-6 w-6 text-foreground" />
          Jarvis<span className="text-muted-foreground">AI</span>
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            working title
          </span>
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
      {/* Fixed brand mark (top-left); tubelight nav floats top-center / bottom on mobile. */}
      <div className="fixed left-5 top-5 z-50 sm:left-7 sm:top-7">
        <Wordmark />
      </div>
      <SiteNav />

      <main className="flex-1">
        <JarvisHero />
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
