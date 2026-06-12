# Jarvis AI — Vision (Palina)

> Working title: **Jarvis AI**. Name is not final.

## One line

Jarvis is a personalized corporate buddy — a desktop overlay that knows your
role, guides you through onboarding step by step, removes blockers proactively,
and stays useful long after your first week as the company's living memory.

## The metaphor: a buddy who actually knows you

Most companies have a buddy program on paper. In practice, that buddy is busy,
forgets to follow up, and gives you the same generic checklist everyone gets.

Jarvis is the buddy who shows up every time, knows you're a designer not a
developer, and adjusts everything accordingly. He sits on top of your existing
tools — Slack, Confluence, your IDE, any app — and nudges you exactly when you
need it, in the context you're already in.

He doesn't live in a tab you have to remember to open. He's a presence that
follows your work.

## What it looks like

You join a company. On day one, Jarvis appears — triggered by a keyboard
shortcut or your voice — and says: "Welcome. You're joining as a Product
Designer. Here's what matters for you specifically."

- He opens Slack and walks you through it in place: "This is your manager.
  Want me to help you draft a hello message?" "Here are the 4 channels your
  team actually uses — the rest you can mute for now."
- He surfaces the company docs, roadmaps, and decisions that are relevant to
  your role — not a 40-page PDF for everyone, but the five things you need to
  know today.
- He's proactive: before you ask, he's already analyzed what's going on in
  the team and has action points ready. Think Victor.ai — he works overnight
  on context so your morning starts with clarity, not noise.
- He removes blockers: if you need something from someone who's on vacation,
  Jarvis surfaces who else can help and drafts the message.

## Two modes, one experience

**Proactive:** Jarvis surfaces information before you ask. He monitors context
(Slack, calendar, Jira) and brings you what's relevant at the right moment —
a roadmap update, a blocker that needs routing, a new team decision you should
know about.

**On-demand:** A keyboard shortcut or voice trigger summons him from any app,
any context. You ask, he answers, he disappears. No tab switching.

Onboarding leans proactive. Ongoing work leans on-demand. The mode shifts
naturally as the person settles in.

## The integrations that make it work

Jarvis is only as useful as the context he has. MVP starts with:
- Confluence / Notion (company documentation)
- Slack (channels, org structure, team communication)
- Calendar + org chart (who's who, who's available, who's your manager)

Long-term goal: full context — Slack history, Jira/Linear (roadmap, active
tasks, blockers), plus any tool the employee opens on a given day. Jarvis
understands who's on vacation and why that's a blocker for you right now.

## What makes it different from what exists

- **Not a knowledge base you visit.** He comes to you, in the app you're
  already using.
- **Not generic.** He knows you're a designer. The developer next to you gets
  a completely different day one.
- **Not passive.** He proactively removes blockers, surfaces context you didn't
  know you needed, and keeps you moving.
- **Not a one-time tool.** After onboarding, he becomes the company's living
  memory — updated continuously, accessible to anyone.

## After onboarding

Jarvis doesn't leave when week two ends. He becomes the place where company
knowledge lives:

- Roadmaps get added as they change
- Decisions get logged with context
- Processes get updated when they evolve
- Any employee can ask "how does X work here?" and get a current answer

This is the long-term value: tribal knowledge made accessible, updated in
real time, available to everyone from day one to year five.

## Why this matters

1. **Onboarding is broken because it's not personalized.** A developer and a
   designer have completely different first-week needs. Generic docs fail both.
2. **Blockers compound early.** The first two weeks set the tone. Every blocker
   that isn't removed immediately costs a day of confusion and a 1:1 to fix.
3. **Company knowledge decays.** Roadmaps go stale, people leave, decisions get
   lost. Jarvis keeps institutional knowledge alive and accessible.

## Related docs

- [problem.md](./problem.md) — the pain we're solving
- [features.md](./features.md) — what Jarvis does
- [customers.md](./customers.md) — who we sell to and why
- [landing-page.md](./landing-page.md) — page structure and validation plan
- [open-questions.md](./open-questions.md) — what we still need to decide
