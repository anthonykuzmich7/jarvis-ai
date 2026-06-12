# Landing page — Palina's vision

## Goal

Validate that the personalized onboarding problem is real and painful enough
that companies would pay to solve it. The page should feel like it was built
for the person reading it — not a generic SaaS pitch.

---

## Core message

**Onboarding isn't slow because companies don't care. It's slow because the
same experience can't serve everyone equally.**

A developer and a designer join the same company on the same day. They get the
same HR doc, the same Slack welcome, the same 1:1 schedule. Two weeks later,
one of them is still waiting for a tool access. The other still doesn't know
which Confluence space is theirs.

Jarvis fixes this — not by adding another tool to the stack, but by sitting on
top of the tools they're already using and guiding each person through what's
relevant to them specifically.

---

## Page structure

### 1. Hero — the feeling, not the feature

Open with something visceral. Not "AI-powered onboarding platform." The feeling
of week one: you don't know who to ask, the docs don't apply to you, you're
taking notes in a 1:1 just to have something to do.

**Headline direction:**
- "Your new hire's first two weeks — personalized for their role."
- "Everyone joins the same company. Nobody has the same first week."
- "Stop onboarding everyone the same way."

**Animation idea:** a split screen — two hires, same start date, different
roles. One path is smooth (Jarvis guiding), one is the default chaos (tabs,
Slack noise, generic docs). The paths diverge visually as you scroll.

Primary CTA: join the waitlist.

---

### 2. The pain — make it land

Name the specific blockers that make the first two weeks slow. Use concrete,
role-aware examples so the reader sees themselves:

- "Joined as a developer? You spent your first three days waiting for GitHub
  access and asking DevOps where to find the deploy pipeline."
- "Joined as a designer? Your first Figma file was a 200-frame doc with no
  explanation of what's live and what's exploration."
- "Joined as a PM? You had five 1:1s before you understood what your team
  actually shipped last quarter."

**Animation idea:** a timeline of "day 1 → day 14" for a typical new hire.
Each day shows what they're doing instead of working: waiting on access,
reading docs that don't apply, scheduling another 1:1. The wasted time adds
up visually.

This is where we quantify it: weeks of lost productivity per hire, number of
1:1s that exist only to transfer context, IT hours spent on access requests
that could have been predicted on day one.

---

### 3. Meet Jarvis — show don't tell

This is the product demo section. No feature bullet lists. Show the overlay
in action with a short animated mockup (built in Figma, then animated).

**Three scenarios to show, one at a time:**

**Scenario A — Slack, day one**
Jarvis appears as an overlay over Slack. "You've been added to 47 channels.
Here are the 4 that actually matter for your role this week." He drafts a
hello message to the new hire's manager. One click to send.

**Scenario B — New tool, any day**
The employee opens a tool they've never used. Jarvis appears: "This is
[tool]. Here's what your team uses it for and how to get started." Not a
generic tutorial — context specific to this company's workflow.

**Scenario C — Blocker, any day**
The person needs something from a colleague who's on vacation. Instead of
a dead end, Jarvis surfaces: who else can help, what the process is, and
drafts the message. The blocker gets routed around.

**Visual treatment:** the overlay design is clean and minimal — Jarvis sits
in the corner of the screen, appears when relevant, disappears when not
needed. Not intrusive. Not another notification. A presence.

---

### 4. Personalization — the differentiator

This section makes the "role-aware" angle explicit and concrete. Use a
toggle or tab interaction: pick your role, see what Jarvis gives you on day
one.

**Designer:**
- Design system location and last update
- Who the PM is and what's currently in review
- Which Figma files are live vs. exploration
- Design review process step by step

**Developer:**
- Environment setup, specific to this company's stack
- Deploy pipeline and who to ask when something breaks
- Code review process and PR conventions
- Which services you'll own

**Business / PM:**
- Current quarter priorities and OKRs
- Which data sources exist and how to access them
- Stakeholders and their focus areas
- Pending decisions that need context

The message: it doesn't matter what your role is. Jarvis already knows.

---

### 5. Beyond onboarding — the long-term value

Brief section. Jarvis doesn't leave when week two ends. He becomes the place
where company knowledge lives and stays current.

- Roadmap updates get added as they happen
- New decisions get logged with context
- Any employee — month one or year three — can ask "how does X work here?"
  and get a current answer

One line: "The new hire tool that becomes your company's memory."

---

### 6. Who it's for — clear audience

Name the buyer personas explicitly so the right person knows they're in the
right place:

- **People & HR leaders** — you own the onboarding experience. Jarvis gives
  you something measurable: personalized, role-aware, trackable.
- **Engineering managers** — every new developer costs you four to six hours
  in the first week just answering the same questions. Jarvis handles those.
- **Design and product leads** — your onboarding gaps don't show up in HR
  metrics. A new designer confused about the design system is invisible until
  they're slow.
- **IT and DevOps** — access requests that could have been predicted on day
  one stop being surprises.

---

### 7. CTA — waitlist

Frame it as joining a small group, not signing up for a product:

"We're working with early teams to get this right. If your company is
growing and onboarding is already feeling like it doesn't scale, we'd love
to talk."

Input: email + optional "what's your role?" to qualify leads.

---

## What to validate with this page

1. Does the role-personalization angle land as clearly differentiated, or
   does it read as "another onboarding tool"?
2. Does the overlay mechanic feel interesting or strange to the buyer?
3. Which persona actually converts — HR, manager, or someone else entirely?
4. Does the "beyond onboarding" angle strengthen or dilute the pitch?
