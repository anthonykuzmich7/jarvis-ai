import { JarvisHero } from "@/components/jarvis-hero";
import { WaitlistForm } from "@/components/waitlist-form";
import { SiteNav } from "@/components/site-nav";
import DisplayCards from "@/components/ui/display-cards";
import {
  KeyIcon,
  CompassIcon,
  BrainIcon,
  ClockIcon,
  HelpIcon,
  WrenchIcon,
  SlackIcon,
  PlugIcon,
  UsersIcon,
  ShieldIcon,
  CheckIcon,
} from "@/components/icons";


function Wordmark({ className }: { className?: string }) {
  return (
    <a
      href="#"
      aria-label="jarvis"
      className={"wordmark text-base font-normal text-foreground " + (className ?? "")}
    >
      jarvis<span className="cursor-blink" aria-hidden>_</span>
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

function ProblemSection() {
  const pains = [
    {
      icon: ClockIcon,
      title: "Two weeks to get unblocked",
      body: "New hires wait days for access to the tools they were hired to use. The first sprint is half-spent just getting in.",
    },
    {
      icon: HelpIcon,
      title: "Nobody knows who to ask",
      body: "Is it DevOps? A team lead? The platform team? The process lives in people's heads and stale docs, so everyone guesses.",
    },
    {
      icon: WrenchIcon,
      title: "IT drowns in the same requests",
      body: "Specialists spend real hours granting access and re-explaining how merge requests, deploys, and ownership work.",
    },
  ];

  return (
    <section id="problem" className="scroll-mt-24 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="The problem"
          title="Joining a company is slow, and it costs everyone"
          description="Access and onboarding knowledge are scattered across Slack, wikis, and senior engineers' memory. New hires rebuild it slowly — and expensively."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                <p.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeetJarvis() {
  const surfaces = [
    { icon: SlackIcon, label: "As a Slack user", body: "DM him like any teammate." },
    { icon: UsersIcon, label: "As a real account", body: "A member of your systems." },
    { icon: PlugIcon, label: "Over MCP", body: "Inside tools like Claude Code." },
  ];

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Meet Jarvis
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              A teammate, not another chatbot
            </h2>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              Think of the helpful senior who answers your questions for the
              first month — except Jarvis is available instantly, never forgets a
              process, and can actually grant the access instead of pointing you
              to someone who can.
            </p>
            <p className="mt-4 text-muted-foreground">
              You plug his body into your company once. He shows up wherever your
              people already work.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {surfaces.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold text-foreground">{s.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const featureCards = [
    {
      icon: <KeyIcon className="size-4 text-background" />,
      title: "Access",
      description: "Granted on day one",
      date: "No IT specialist",
    },
    {
      icon: <CompassIcon className="size-4 text-background" />,
      title: "Context",
      description: "Knows how the company runs",
      date: "Confluence + your stack",
    },
    {
      icon: <BrainIcon className="size-4 text-background" />,
      title: "Memory",
      description: "Carries your work context",
      date: "Slack · meetings · MCP",
    },
  ];

  return (
    <section id="features" className="scroll-mt-24 border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="What it does"
          title="One teammate, three jobs"
          description="Jarvis gets people in the door, then keeps helping them do the work."
        />
        <div className="mt-16 flex min-h-[440px] items-center justify-center overflow-hidden lg:mt-24 lg:min-h-[520px]">
          <div className="origin-center scale-50 sm:scale-75 lg:scale-110">
            <DisplayCards cards={featureCards} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const roles = [
    {
      label: "People & HR",
      primary: true,
      body: "Give every new hire a smooth first day instead of a two-week scramble.",
    },
    {
      label: "Engineering managers",
      body: "Cut time-to-first-commit. New engineers ship instead of waiting.",
    },
    {
      label: "IT & DevOps",
      body: "Stop hand-granting access and re-answering the same onboarding questions.",
    },
    {
      label: "Leadership",
      body: "Recover weeks of lost productivity across every hire you make.",
    },
  ];

  return (
    <section id="team" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading
          eyebrow="For your team"
          title="Built for everyone onboarding touches"
          description="Different people feel the pain differently. Jarvis answers to all of them."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((r) => (
            <div
              key={r.label}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              {r.primary ? (
                <span className="absolute right-4 top-4 rounded-full bg-foreground/5 px-2.5 py-1 text-xs font-semibold text-foreground">
                  Primary
                </span>
              ) : null}
              <UsersIcon className="h-6 w-6 text-foreground" />
              <h3 className="mt-4 font-semibold text-foreground">{r.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OutcomesSection() {
  const outcomes = [
    {
      title: "Day one, not week two",
      body: "Access and answers arrive immediately, so new hires start contributing right away.",
    },
    {
      title: "IT gets its time back",
      body: "No more manual access grants or repeating the same onboarding walkthroughs.",
    },
    {
      title: "Knowledge that stays",
      body: "Company process lives in Jarvis, not only in the heads of your senior people.",
    },
  ];

  return (
    <section className="border-t border-border bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <SectionHeading eyebrow="What changes" title="The outcome we're after" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {outcomes.map((o) => (
            <div
              key={o.title}
              className="rounded-2xl border border-border bg-card p-7"
            >
              <CheckIcon className="h-6 w-6 text-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {o.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
        <div className="flex items-center gap-3 text-foreground">
          <span className="wordmark text-sm font-normal">
            jarvis<span className="cursor-blink" aria-hidden>_</span>
          </span>
          <span className="text-xs text-muted-foreground">working title</span>
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
        <ProblemSection />
        <MeetJarvis />
        <FeaturesSection />
        <TeamSection />
        <OutcomesSection />
        <WaitlistSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  );
}
