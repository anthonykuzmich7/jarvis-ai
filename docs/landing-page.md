# Landing page — validation plan

## Goal

Before building the product, validate that the **operational, performance-framed
pitch** lands with the right buyer — C-level leaders who own team velocity (COO
first, alongside CTO and CRO / Head of Operations) at growing 100+ person
companies. The page should make that buyer feel: "this shrinks time-to-performance
and gives me more top performers."

We are testing two things:

1. **Does the problem resonate?** Do visitors recognize the context/onboarding
   pain as their pain?
2. **Is there pull?** Will they take an action that costs something small —
   leaving an email, booking a call?

---

## Core message

**Onboard your best people so their time-to-performance shrinks — and grow more
top performers inside your team.**

The way to do it: give every new hire a chief of staff that loads the context of
your company and their team during onboarding, then keeps building their personal
context and acting on their behalf — long after week two.

---

## Hero — what we're testing

Two hero angles, both worth validating (run them together as one A/B):

- **A:** "How do you onboard your best employees so their time-to-performance
  shrinks?"
- **B:** "How do you grow more top performers inside your team?"

Subhead: every new hire gets a chief of staff with context from day one — and an
agent that acts, not another doc.

---

## CTA — test both

Put **both** a waitlist (email capture) and a **book-a-call** option on the site
and A/B test them:

- **Waitlist** — lowest friction, clean read on interest.
- **Book a call** — higher friction, but qualifies a C-level B2B buyer much better.

Both CTAs must actually store leads, tagged so we can compare them.

---

## Page structure

### 1. Hero — the outcome, not the feature
Lead with the performance framing (A and B above), aimed squarely at C-level
leaders who own how fast a team gets productive. Subhead: every new hire gets a
chief of staff with context from day one.

### 2. The problem — context doesn't exist yet
The context a new hire needs was never assembled — it's in heads, calls, and
scattered docs. Generic onboarding fails a developer and a marketer equally. Make
the reader feel the wasted first weeks and the senior time burned. Quantify it
where we can: weeks of lost productivity per hire, 1:1s that exist only to
transfer context, access requests that could have been predicted on day one.

### 3. Meet Jarvis — the chief of staff
He's an agent, not a knowledge base. Minimalist, voice-first, lives where you work
(overlay + Slack + a desktop app), and he *acts*. Clean and professional with a
light, warm character — present, not intrusive.

### 4. Persona-based demo — the "wow"
Let the visitor **pick a persona** and see a customized scenario where the agent
onboards by team context **and performs a real action** — plus the screen-guided
moment. Show, don't list. Start as an animated mockup (designed in Figma, then
animated) before any real product exists.

- **Engineer:** instantly get set up for a new tool (Jarvis spins up the Slack
  chat with the access owner and books the call), or get a review of the current
  stack / architecture — with the on-screen guide pointing through setup.
- **Creative marketer:** receive the brand knowledge — every format the team has
  run, the concepts that actually worked, and who owns which format.
- **Business / C-level:** the agent explains the company vision, goals, and C-level
  plans, and schedules calls with the right stakeholders.

Make it unmistakable that the agent adapts to the team's context, **acts like a
real agent**, and **guides on the actual screen**.

### 5. Two-stage arc — onboarding in, teammate forever
Stage 1: super-proactive onboarding that gets you set up hands-on. Stage 2: a
sticky teammate whose context (including your personal layer, pluggable into your
AI tools) keeps driving your daily work. One line: "The new-hire tool that becomes
your company's memory."

### 6. Who it's for
Name the buyer: **C-level leaders who own team velocity — COO, CTO, CRO / Head of
Operations** — at growing 100+ person companies. People who own hiring throughput,
productivity, and OKRs/KPIs.

### 7. CTA (repeat)
Both waitlist and book-a-call, framed as joining early teams.

### 8. FAQ / objections
Security and access control, data privacy, **context isolation between teams**,
what it connects to, screen awareness, and meeting-recording consent.

---

## Build notes

- The site is a **Next.js app** (App Router, Tailwind), already deployed on Vercel —
  so we can ship and iterate the landing page fast.
- One page to start; ship fast and iterate.
- Both CTAs must store leads, tagged so we can compare them.
- Copy should sound human and specific, in the language of operations and
  engineering leaders — not generic AI-startup marketing.

---

## What to validate with this page

1. **Do the hero angles resonate** with the target audience (COO / CTO / CRO)? Run
   A and B together.
2. **Which CTA converts** — waitlist vs. book-a-call?
3. **Does the persona-based, "it acts" + "it guides on screen" demo** feel exciting
   and credible — or does screen awareness feel intrusive?
4. **Does the sticky / context angle** read as clearly different from one-time
   onboarding tools?

See [open-questions.md](./open-questions.md) for the broader list.
