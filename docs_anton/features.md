# Features (Anton)

Jarvis is two stages wrapped in one character. Stage one does your real
onboarding with you, hands-on. Stage two becomes the teammate who knows how the
company works. Everything below serves one of those two.

## 1. A character that lives on your screen

Jarvis isn't a tab or a window you summon. He's a small, gamified character —
think a cute creature, a little animal you'd want around, not a corporate avatar
— who sits on your screen: top, side, ideally something Dynamic-Island-like
that's always quietly present.

This is on purpose. Onboarding is when people are least likely to ask for help —
they're new and don't want to look lost. A friendly presence you actually *want*
to poke at gets used in the moment you're stuck, where a corporate portal gets
avoided. The character is the reason the rest of the product gets used at all,
so it has to be genuinely delightful — something you'd keep around even before
it's useful.

## 2. Talk to him by voice, from anywhere

You don't type at Jarvis, you talk to him — fast voice interaction in the spirit
of Wispr Flow. Grab him, say the thing, done. No window, no form. Because the
whole point is that asking him is *faster* than the alternative (searching,
DMing, opening a doc); the moment it's slower than guessing, people stop using
it. Voice is what keeps him quicker than the workarounds.

## 3. The day-one install flow

The ideal: you accept the offer, you get an email — "Download your onboarding
buddy." You install a desktop app. The character appears and starts your
onboarding. No portal login, no "explore the dashboard." A companion shows up
and begins walking you through your first day.

## 4. Hands-on, screen-aware onboarding (the core)

This is the part that doesn't exist anywhere today. Jarvis sees your screen and
guides you through the real setup, step by step, by pointing — and, if you let
him, by driving.

- **He sees where you are.** He's watching the actual screen, so he reacts to
  your real state, not a fixed script. If you're on the wrong window, he says so.
- **He moves a cursor next to yours.** He points at exactly what to click. He can
  go further and drive — move the cursor, click the thing — so you see precisely
  how it's done, then do it yourself.
- **He walks the real steps.** "Install Chrome — here." "Set up your work mail."
  "Create your profile." "This is where you track your hours." "This is how you
  request a day off." The boring mandatory list, done *with* you instead of read
  alone.
- **He's role-specific.** A developer gets repo, environment, deploy flow, review
  conventions. A founder or a non-technical hire gets a completely different
  day one. Same character, different walkthrough.

The mental model is a person sitting next to you saying "click here, yes, now
this" — except it scales to every new hire and never runs out of patience.

## 5. Introductions to the humans

Part of setup is people, not tools. Jarvis shows you the room: "These are your
teammates — message them here. Want me to draft the hello?" He makes the first
human contact feel easy instead of intimidating, so you're not staring at an
empty DM box wondering how formal to be.

## 6. Active help that doesn't annoy you

This is the feature I most want to get right — and the hardest. Jarvis shouldn't
just sit there waiting to be asked. He should *actively* help while you work:
notice you're stuck, notice you're about to do the setup step wrong, notice the
thing you're looking for and surface it before you ask. Real, useful, well-timed
interventions.

The whole game is doing that without becoming Clippy. Active but never noise.
The line between "this saved me" and "go away" is narrow, and finding it is the
signature design problem of the product — it's what would make Jarvis feel
magic instead of like another assistant. (Exact mechanic still being worked out;
see open-questions.)

## 7. Company context, on demand (stage two)

Once you're set up, the character changes job. Now he's the teammate with all
the context. He's integrated with the company's tools — Slack, Confluence,
Notion, and whatever else — so he genuinely knows things. You ask in plain
language:

- "How does deploy usually work here?"
- "Who owns this feature?"
- "What are we working on right now?"
- "How do I request access to X?" (he tells you the process — he doesn't grant
  it; see scope)

He's the person you ask *first*, before you go bother a human — so you stop
cold-DMing five people and hoping one of them is online and knows.

## 8. Sits in on your meetings and remembers them

This is what makes stage two actually smart instead of just a wrapper over stale
docs. You can drop Jarvis into any call — standups, planning, that one meeting
where the real decision got made — and he accumulates the transcripts. Over
time he builds genuine context from what the team *actually said this week*, not
from a wiki page nobody updated.

So when you ask "what did we decide about X?" or "who's working on Y right now?",
the answer comes from the meetings where it was decided, in real words, with who
said it. This is a big part of the moat: the longer he's around, the more of the
company's real, spoken context he holds.

## 9. Honest routing when he doesn't know

Jarvis doesn't bluff. When he isn't sure, he says so and points you at the human
who probably knows — with the reason: "This person likely knows, they opened a
ticket about exactly this a while back." Instead of a dead end or a confident
wrong answer, you get a warm intro to the right person and *why* they're the
right person.

---

## What's explicitly out of scope (for now)

- **Automated access provisioning.** Jarvis can *explain* how to request access
  and *route* you, but he does not grant it himself in this version. The original
  access-agent idea is a later evolution, not the launch.
- **Always-on ambient listening / heavy overnight proactivity.** Active help
  (feature 6) is curated and in-the-moment, not a bot that silently records
  everything you do and pings you at 8am. Meetings (feature 8) are opt-in per
  call, not always-on surveillance. The deeper "I analyzed everything overnight"
  behavior can come later, carefully.

## Integration roadmap

**MVP (start here):**
- Screen awareness + guided cursor — the hands-on onboarding engine
- Voice interaction (Wispr-Flow-style) — the primary way you talk to him
- Role-based onboarding scripts (developer vs. everyone else, to start)
- Slack + Confluence / Notion — enough context for stage two to answer real
  questions and route to the right human

**Near-term:**
- Meeting bot — joins calls, accumulates transcripts, feeds stage-two context
- First version of active, in-the-moment help (feature 6)
- Wider tool coverage for context (Jira/Linear, Drive, internal tools)
- Better "who probably knows this" routing from ticket/message history
- Eventually: the original access automation, once the buddy is loved
