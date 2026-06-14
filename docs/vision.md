# Jarvis AI — Vision

> Working title: **Jarvis AI**. Name is not final.

## One line

Jarvis is an AI teammate — a chief of staff for every employee — that assembles
the context each person needs (company, team, personal) and **acts** on it: it
onboards a new hire hands-on in their first days, and then stays as the agent
that keeps driving their daily work.

## The core: context that acts, entered through onboarding

The product is a **context engine wrapped in an agent**. Onboarding is the wedge —
the cleanest way to enter a company and start proving value on day one — but the
thing Jarvis actually *is* is the context every employee wishes they had, plus an
operator who gets things done with it.

Two ideas hold the whole product together:

1. **Context, not access.** Access provisioning and a tidy checklist are real and
   valuable, but they're *use cases* that sit on top of context — not the core.
   Solve context, and access stops being a two-week scavenger hunt.
2. **It acts, it doesn't just answer.** On day one Jarvis doesn't say "ask DevOps
   for access." He spins up a Slack chat with you and the two people who own that
   access, writes the intro himself, finds a slot all three of you have free, and
   proposes the call. Smart senior who knows everything, plus an operator who
   gets it done.

## The metaphor: the colleague who already has the context — and moves things

When you join a company, what you really want is the senior colleague who already
knows how everything works *and* has the standing to get things moving for you.
Most people never get that person — they're busy, or they don't exist.

Jarvis is that colleague, crossed with a chief of staff. He's not a tab you have
to remember to open; he's a presence that follows your work. He already holds the
context at every level, and he doesn't just tell you things — he opens the chat,
finds the slot, books the call, points you at the right person.

## What it looks like

A minimalist, **voice-first overlay** in the spirit of Wispr Flow: one keystroke
summons him on top of whatever app you're in. He's also a **Slackbot** you can
message where work already happens, and a **desktop app** that holds your
conversation history plus real standalone value — your action points, your
personal analytics, your open and closed tasks.

The base is clean minimalism with a **light, warm character** — a small friendly
avatar and a human tone, not a full mascot. The first week is the loneliest week
of a job; a warm presence makes people actually reach for help instead of
pretending they're fine. But the buyer is a serious operational leader, so the
product reads as a professional tool first.

## The signature onboarding moment: a guide on your screen

The part nobody does today: during setup Jarvis **sees your screen and points** —
"Install Chrome, click here," "this is where you track your hours," "set up your
profile" — highlighting exactly where to go on the real screen, not in a wiki
screenshot. In the first version he **highlights and points; he does not drive
your cursor for you.** Driving is more magical and more terrifying (and riskier
on trust and privacy), so it's a deliberate later evolution, not the launch.

This is the hands-on thing a document can never do: information isn't onboarding.
A doc can tell you "set up your environment"; it can't see where you are and react.

## Context lives on three levels

Jarvis holds context in layers, and the layers don't bleed into each other.

1. **Company.** The highest level: vision, goals, and where the company is
   heading. From the founders and C-level.
2. **Team / direction.** A developer and a marketer in the same company live in
   completely different contexts — including their accesses. This layer is shaped
   for the specific person by the Slack channels they're in and the calls they
   attend. Crucially, **sensitive context stays isolated**: a new engineer should
   not stumble onto marketing ROAS, and vice versa.
3. **Personal.** The employee's own working context, accumulated as they work,
   which they can plug into their own AI tools (e.g. Claude Code over MCP) to work
   more effectively.

## How the layers get filled — and stay current

The problem with company knowledge isn't only that it goes stale. It's that it
mostly **doesn't exist in any usable form** — today it lives in heads, manual
onboarding calls, and scattered docs written for someone else. Jarvis assembles
it instead:

- **Connected sources:** Docs (Confluence / Notion), Slack, Calendar + org chart,
  Jira.
- **Team calls:** Jarvis sits in on shared team meetings (weekly strategy,
  engineering dailies) and builds the team layer from what's actually said.
- **One-on-ones are opt-in** — the employee's choice — but Jarvis *proactively
  offers*: "to make our 1:1s work better, I can join your calls."

## Two stages, one companion

**Stage 1 — Onboarding (super-proactive).** In the first ~2 weeks Jarvis is
maximally proactive: role-aware first day, screen-guided setup, agentic actions
(opens chats, drafts intros, finds slots, books stakeholder calls, gets your
accesses moving), and introductions to the humans — while explaining the
capabilities you'll lean on later.

**Stage 2 — Teammate forever (sticky).** Once you're set up, Jarvis becomes the
teammate with the context. You ask in plain language — "how does deploy work
here?", "who owns this feature?", "what did we decide about X?" — and he answers
from real, current context, including the meetings he sat in on. Proactivity is
deliberately pruned to a few pointed triggers (action points after calls, a short
morning sync) so he never becomes an always-pinging Clippy.

## Why it's sticky

Onboarding gets him in the door; the context built **during** onboarding plus the
**personal layer** is what keeps people using him long after week two. You can't
lead only with personal context — nobody wants to spend weeks teaching yet another
tool. But once Jarvis is already present, the personal context accumulates for
free, and that's the daily-usage engine. That compounding context is the moat.

## What makes it different

- **Context-first, not access-first or doc-first.** We make the static onboarding
  document obsolete: fresh, per-person, per-direction context instead of a doc
  nobody keeps current.
- **It acts.** Real agentic actions — opens chats, drafts intros, finds calendar
  slots, books calls — not just answers.
- **It's layered and permissioned.** Company / team / personal, with sensitive
  context kept isolated between teams.
- **It does the hands-on part a doc can't.** A guide on your screen during setup,
  not a checklist you read alone.
- **It's sticky, not one-and-done.** Onboarding is the entry; context is the
  retention.
- **It's honest.** No hallucinations by design — when something isn't known,
  Jarvis connects with the responsible person and asks, instead of guessing.

## Who we sell to, in one line

C-level leaders who own how fast a team gets productive — COO first, alongside
CTO and CRO / Head of Operations — at growing 100+ person companies. The pitch is
operational: **onboard your best people so their time-to-performance shrinks, and
grow more top performers inside your team.** See [customers.md](./customers.md).

## Where we are

Earliest stage. Before building the full product we want a **landing page** to
validate that the problem is painful enough that these buyers would pay to solve
it. See [landing-page.md](./landing-page.md).

## Related docs

- [problem.md](./problem.md) — the pain we're solving
- [features.md](./features.md) — what Jarvis does
- [customers.md](./customers.md) — who we sell to and why
- [landing-page.md](./landing-page.md) — page structure and validation plan
- [open-questions.md](./open-questions.md) — what we still need to decide
