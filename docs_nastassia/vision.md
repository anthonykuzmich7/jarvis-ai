# Jarvis AI — Vision (Nastassia)

> Working title: **Jarvis AI**. Name is not final.

## One line

Jarvis is an AI teammate that gives every new hire the context their role needs
and acts to get them set up — then stays as the agent that holds company, team,
and personal context.

## The metaphor: the colleague who already has the context — and moves things

When you join a company, the thing you really want is the senior colleague who
already knows how everything works *and* has the standing to get things moving
for you. Most people never get that person — they're busy, or they don't exist.

Jarvis is that colleague, crossed with a chief of staff: he already holds the
context at every level, and he doesn't just tell you things — he acts. He opens
the chat, finds the slot, books the call, points you at the right person. Smart
senior who knows everything, plus an operator who gets it done.

## The core is context, not access

The product is **context**. Onboarding and access provisioning are real and
valuable, but they're *use cases* that sit on top of context — not the core. We
lead with onboarding because it's the cleanest way to enter a company and start
proving value, but the thing Jarvis actually is, is a context engine.

This matters for positioning. "General shared context for your company" is
already a crowded space — there are startups (several in a single YC batch)
chasing exactly that. Entering through onboarding lets us be specific and
ownable instead of generic, while the long game is still context.

## Context lives on three levels

Jarvis holds context in layers, and the layers don't bleed into each other.

1. **Company.** The highest level: the company's vision, goals, and where it's
   heading. This comes from the founders and C-level.
2. **Team / direction.** A developer and a marketer in the same company live in
   completely different contexts — and that includes their accesses. This layer
   tells you the team's current priorities and who owns which direction. Ideally
   it's *shaped for the specific person* by the Slack channels they're added to
   and the calls they attend. Crucially, **sensitive context stays isolated**: a
   new engineer should not stumble onto marketing ROAS, and vice versa.
3. **Personal.** The employee's own working context, accumulated as they work,
   which they can plug into their own AI tools to work more effectively.

## How the layers get filled — and stay current

The problem with company knowledge isn't that it goes stale. It's that it mostly
**doesn't exist in any usable form** — today it lives in manual calls and
scattered docs. Jarvis assembles it instead:

- **Connected sources:** Docs, Slack, Jira.
- **Team calls:** Jarvis sits in on shared team meetings (weekly strategy,
  dailies for engineering) and builds the team layer from what's actually said.
- **One-on-ones are opt-in.** Whether Jarvis joins your 1:1s is the employee's
  choice — but Jarvis *proactively offers*: "to make our 1:1 work better, I can
  join your calls."

## The strategic arc: onboarding in, context as the core, personal layer as retention

- **Onboarding is the wedge.** It's the cleanest entry and the strongest pitch.
  In the first two weeks Jarvis is super-proactive — guides you in, connects you
  to the right people, gets you set up — while explaining what he'll be able to
  do for you later.
- **Context is the core** — company and team context is what makes him useful
  from day one.
- **The personal layer is what drives daily usage.** You can't lead *only* with
  personal context — nobody wants to invest weeks teaching yet another tool. But
  once Jarvis is already present (because he onboarded you), the personal context
  accumulates for free, and that's what keeps him in daily use long after week
  two.

## What it looks like

A minimalist, voice-first overlay in the spirit of Wispr Flow: one keystroke
summons him on top of whatever you're in. He's also a Slackbot you can message,
and there's a desktop app that holds your conversation history plus real extra
value — your action points, your personal analytics, your open and closed tasks.

He's an **agent**, not a help box. On day one he doesn't just say "ask DevOps for
access" — he spins up a Slack chat with you and the two people who own that
access, writes the intro himself, finds a slot all three of you have free, and
proposes the call.

A light, cute character is welcome as a design touch — but the base is clean
minimalism, not a mascot.

## What makes it different

- **Context-first, not access-first or doc-first.** We make the static
  onboarding document obsolete: instead of rewriting the company doc for every
  hire, Jarvis assembles fresh context per person, per direction.
- **It acts.** Real agentic actions — opens chats, drafts intros, finds calendar
  slots, books calls — not just answers.
- **It's layered and permissioned.** Company / team / personal, with sensitive
  context kept isolated between teams.
- **It's sticky, not one-and-done.** Onboarding gets him in; the context built
  during onboarding (plus the personal layer) is what keeps people using him.
- **It's honest.** No hallucinations by design — when something isn't known,
  Jarvis connects with the responsible person and asks, instead of guessing.

## Why this matters

For the company, the pitch is operational: onboard your best people so their
time-to-performance shrinks, and grow more top performers inside the team. The
context that used to live only in senior people's heads becomes something every
new hire has from day one.

Concretely:

1. **New hires lose their first weeks** piecing the company together by hand.
2. **Seniors and stakeholders lose time** re-explaining the same context to
   every new person.
3. **The value compounds after onboarding** — the same agent keeps driving the
   employee's daily work.

> **TODO — emotional core (Q6, to confirm).** Draft: *"Starting a new job means
> being dropped into a company with no context — you don't know how anything
> works, who owns what, or who to ask, and you spend your best early weeks
> feeling slow instead of doing the work you were hired for."* Replace with your
> own one-line version when it clicks.

## Where we are

Earliest stage. Before building the full product we want a **landing page** to
validate that the problem is painful enough that companies (specifically COOs /
Heads of Operations at growing 100+ person companies) would pay to solve it. See
[landing-page.md](./landing-page.md).

## Related docs

- [problem.md](./problem.md) — the pain we're solving
- [features.md](./features.md) — what Jarvis does
- [customers.md](./customers.md) — who we sell to and why
- [landing-page.md](./landing-page.md) — page structure and validation plan
- [open-questions.md](./open-questions.md) — what we still need to decide
