# Landing page — validation plan

## Goal

Before building the product, find out whether this problem is painful enough that
companies would pay to solve it. The landing page is the cheapest way to test
that.

We are testing two things:

1. **Does the problem resonate?** Do visitors recognize the onboarding/access
   pain as their pain?
2. **Is there pull?** Will they take an action that costs them something small —
   leaving an email, booking a call, joining a waitlist?

## Decisions so far

- **Primary CTA: join the waitlist (email capture).** Lowest friction; we want a
  clean read on interest first.
- **Primary audience: People / HR leadership** (CPO, HR partners), then
  engineering managers, IT managers, and senior management. Copy leads with the
  People/HR angle. See [customers.md](./customers.md).

## Success signal

A meaningful share of relevant visitors (IT/eng leads) sign up to learn more.
We'll decide the exact bar before launch, but the point is: real interest from
the right people, not just traffic.

## Page outline (first draft)

1. **Hero**
   - Headline on the core promise: onboard new hires and grant their accesses
     without an IT specialist.
   - Subhead naming the pain: "Getting access to everything you need shouldn't
     take two weeks."
   - Primary call to action: join the waitlist / request early access.

2. **The problem**
   - The two-week access wait, not knowing who to ask, IT toil.
   - Make the reader feel "yes, that's us."

3. **Meet Jarvis**
   - He's a teammate, not a chatbot. Lives in Slack, as a real user, or via MCP.

4. **What he does** (from [features.md](./features.md))
   - Grants access, no IT specialist needed.
   - Knows the company: processes, who owns what, how the product works.
   - Carries your personal context: Slack, meetings, contacts — ready in your AI
     tools.

5. **Why it matters / ROI**
   - Weeks of productivity recovered, IT hours saved.

6. **Call to action (repeat)**
   - Email capture / waitlist / book a demo.

7. **FAQ / objections**
   - Security and access control, data privacy, what it connects to.

## Build notes

- The site is a **Next.js app** (App Router, Tailwind), already deployed on
  Vercel — so we can ship and iterate the landing page fast.
- Keep it one page to start. Add an email capture that actually stores leads.
- Copy should sound human and specific, not like generic AI-startup marketing.

## Open decisions for the page

- Exact headline and primary CTA wording.
- Waitlist vs. "book a call" as the primary action.
- Whether to show a concrete demo / mockup of Jarvis in Slack.

See [open-questions.md](./open-questions.md) for the broader list.
