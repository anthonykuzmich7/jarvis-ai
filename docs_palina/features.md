# Features (Palina)

Jarvis has five things that make it different from a knowledge base, a chatbot,
or a help center. Together they create something closer to a personal guide
than a tool.

## 1. Desktop overlay — keyboard shortcut and voice

Jarvis lives on your desktop, not in a browser tab. You summon him with a
keyboard shortcut or by speaking — similar to how Wispr Flow works. He appears
on top of whatever you're doing: Slack, Confluence, your IDE, Google Sheets,
any app.

This is the delivery mechanism that makes everything else work. Onboarding
questions don't happen when you're sitting in a knowledge base. They happen
when you're already inside a tool for the first time, looking at a codebase
you don't understand yet, or stuck waiting on something. Jarvis meets you there.

## 2. Role-aware personalized onboarding

When you join, Jarvis knows your role and builds your onboarding around it.

He doesn't surface the master HR doc. He surfaces what a designer specifically
needs on day one. Then the next layer on day two. The information exists in the
company already — the filtering and sequencing is what's new.

**Developer, day one:**
- Environment setup, specific to this company's stack
- Deploy pipeline and who owns it
- Code review process and PR conventions
- Which services you'll be touching

**Designer, day one:**
- Design system location and last update date
- What's currently in review vs. live vs. exploration in Figma
- How design reviews work here
- Who the PM is and what's in the current sprint

**Business / PM, day one:**
- Current quarter OKRs and the reasoning behind them
- Which data sources exist and how to access them
- Pending decisions that need new-hire context
- Key stakeholders and their focus areas

The same logic applies to any role. Jarvis pre-selects what's relevant and
skips what isn't.

## 3. Proactive context surface — action points without asking

Jarvis monitors the company's context sources and surfaces what matters before
you ask. This is the Victor.ai mechanic applied to onboarding and ongoing work.

He runs in the background and builds a picture of what's happening: who's
working on what, what's blocked, what decisions were just made, what roadmap
updates came through. When something is relevant to you specifically, he
surfaces it.

Examples:
- "There's a new product decision that affects the feature you're working on.
  Here's the summary and who made it."
- "The service you'll be touching had a deploy issue yesterday. Here's the
  post-mortem and who to follow up with."
- "Your manager just shared a new sprint brief. Here are the three things
  that affect your work this week."

This is what separates Jarvis from a search box: he brings context to you,
in the moment it matters.

## 4. Contextual app overlay — guidance inside the tools you're using

When you open a new tool for the first time, Jarvis appears on top of it and
guides you through it in context — not in a separate onboarding flow, but
overlaid on the actual interface.

**Slack, day one:**
"You've been added to 47 channels. Here are the 4 that matter for your
role this week. Want me to mute the rest?" — "This is your manager. Want me
to help draft a hello message?"

**A new internal tool:**
"This is [tool name]. Your team uses it for [specific use case]. Here's
how to do the thing you'll do most often." Not a generic product tour — the
company's actual workflow.

**Any tool, any day:**
You can summon Jarvis with a shortcut while using any app and ask a question
in natural language. "Who owns this service?" "Where does this live in
Confluence?" "Who do I ask about X?" He answers in context and disappears.

## 5. Active blocker removal

Jarvis doesn't just answer questions — he routes around blockers.

If you need something from a colleague who's on vacation, Jarvis knows this
(from calendar integration) and immediately surfaces: who else can help, what
the process is, and a drafted message to the right person. The blocker
doesn't become a day of waiting.

Similarly: if a tool access you need could have been predicted from your role,
Jarvis flags it before you hit the wall. He knows what a developer at this
company typically needs access to, and he makes sure it's handled before it
becomes a blocker.

## 6. Living company knowledge base

After onboarding, Jarvis stays. He becomes the company's institutional memory —
updated continuously, accessible to anyone.

- Roadmaps get added as they change, with context about why decisions were made
- Processes get updated when they evolve
- Decisions get logged with the reasoning behind them

Any employee — week one or year three — can ask "how does X work here?" and
get an answer that reflects the current reality, not a doc written 18 months ago.

This is the long-term value that makes Jarvis a company-wide tool, not just an
onboarding product.

---

## Integration roadmap

**MVP (start here):**
- Confluence / Notion — company documentation
- Slack — channels, structure, key conversations
- Calendar + org chart — who's who, who's your manager, who's available

**Near-term goal:**
- Full Slack history — proactive context surface, blocker detection
- Jira / Linear — roadmap, active sprints, blockers
- Any tool the employee opens — contextual overlay guidance
