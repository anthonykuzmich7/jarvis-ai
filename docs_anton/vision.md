# Jarvis AI — Vision (Anton)

> Working title: **Jarvis AI**. Name is not final.

## One line

Jarvis is a gamified onboarding buddy — a desktop companion that lives on your
screen, takes you by the hand on day one and literally walks you through every
real setup step, and then stays as the teammate who knows how the company
actually works.

## Where this started, and where it landed

The first idea was about access: an AI agent, available in different surfaces
(Slack, MCP, etc.), that grants and manages access for you. The more I looked at
it, the more it felt like the hard, unglamorous middle of a much better product.

The thing people actually feel on day one isn't "I don't have access." It's
"I'm alone, I have a 100-step doc, and I don't know how any of this works or who
to ask." So Jarvis is the buddy who removes that — not an access pipe. Automated
access provisioning is explicitly **not** in this version. We can grow into it
later; we don't lead with it.

## The metaphor: a buddy, not a tab

When you join a company, someone hands you a document. It has a hundred steps:
register here, create that, message this person, change your Slack avatar, set up
time tracking, request your first day off "like this." It's boring, it's slow,
and half of it is unclear because a doc can't show you — it can only tell you.

Jarvis is the opposite of a doc. He's a small character — think a cute creature,
a little animal you actually want around, not a corporate avatar — who lives on
your screen (top, side, ideally something Dynamic-Island-like) and is just
*there*. He's not a window you remember to open. He's a presence that runs your
first days with you, and then sticks around as the one who knows things. And you
can talk to him from anywhere — by voice, fast, like Wispr Flow: grab him, say
the thing, done.

## What it looks like — the ideal flow

The dream business case: you accept an offer, and you get an email — "Download
your onboarding buddy." You install a desktop app. A little character appears.
That's it. From that moment, your onboarding isn't a document you read alone;
it's something a companion does *with* you.

**Day one, he runs the real setup, hands-on:**

- He knows your role, so the path is yours specifically — a developer and the
  founder do not get the same day one.
- He sees your screen and moves a cursor next to yours. "Install Chrome — click
  here." "Set up your work mail — here." "Create your profile." He points, and
  if you want, he can drive: move your cursor, click the thing, show you exactly.
- He walks you through the boring-but-mandatory stuff: "This is where you track
  your work hours." "This is where you request time off." "Here's how that flow
  works." Not a screenshot in a wiki — the actual screen, with him on it.
- He introduces the humans: "Message your teammates here — want me to draft the
  hello?" He shows you the room before throwing you in it.

This is the part I care most about: it's not "here's a checklist." It's a guide
who is on the screen with you, watching where you are, and walking you forward
step by step until you're actually set up.

## Two stages, one companion

**Stage 1 — Real onboarding (hands-on).**
Jarvis physically onboards you. He sees your screen, guides (or drives) the
cursor, and takes you through every concrete first-day step for your role until
you're operational. This is the part that's missing today — nobody walks you
through it, you just get a list.

**Stage 2 — Company context (chat).**
Once you're set up, Jarvis becomes the teammate with all the context. He's
integrated with everything the company uses — Slack, Confluence, Notion, the
tools — and, crucially, he can sit in on your meetings: drop him into any call
and he accumulates the transcripts, so his context isn't just stale docs, it's
what the team actually said this week. You talk to him in plain language (typed
or by voice):

- "How does deploy usually work here?"
- "Who owns this feature?"
- "What are we even working on right now?"
- "How do I request access to X?"

And when he doesn't *know* for certain, he doesn't bluff. He routes you: "Hey,
this person probably knows — they opened a ticket about exactly this a while
back." The point is you always have a first place to ask, instead of guessing
who to DM and hoping they're not on vacation.

## Why a character, why gamified

Onboarding is emotionally the loneliest week of a job. You're new, you don't
want to look stupid, and you're afraid to ask the same question twice. A small
companion on your screen changes the feeling: it's lighter, it's friendly, it's
something you *want* to interact with instead of a corporate portal you avoid.

The character is not decoration. It's the reason people actually use the thing
in the moment they're stuck, instead of pretending they're fine and burning a
day. It has to be genuinely delightful — a creature you'd keep around even if it
did nothing — and then it does a lot.

The hard, important design problem: he should *actively* help, not just sit there
waiting to be asked — but without becoming Clippy. Real, useful interventions at
the right moment, never noise. Nailing "actively helpful but never annoying" is
the signature challenge of this product, and getting it right is the whole magic.
(Still thinking through exactly what that looks like — see open-questions.)

## What makes it different

- **It does it with you, not for you to read.** The hands-on, screen-aware,
  cursor-driving onboarding is the core. Everyone else gives you a doc; Jarvis
  gives you a guide who's on the screen.
- **It's a presence, not a search box.** A character that lives on your screen,
  not a tab you have to remember exists.
- **It's role-specific from second one.** Your first day is built for your job,
  not the company's master checklist.
- **It's honest about what it knows.** When it doesn't know, it points you at the
  human who probably does — with the reason why.
- **It talks like a person, by voice.** Fast voice interaction (Wispr-Flow-style)
  so asking him is quicker than opening anything.
- **It builds its own context.** Drop him into meetings and he accumulates the
  transcripts — his knowledge comes from what the team actually said, not only
  from docs someone forgot to update.

## Related docs

- [problem.md](./problem.md) — the pain we're solving
- [features.md](./features.md) — what Jarvis does
- [customers.md](./customers.md) — who we sell to and why
- [landing-page.md](./landing-page.md) — page structure and validation plan
- [open-questions.md](./open-questions.md) — what we still need to decide
