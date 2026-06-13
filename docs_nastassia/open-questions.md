# Open questions (Nastassia)

Things we still need to decide or validate. Not blockers for documenting the
vision, but they shape the product, the go-to-market, and the landing page.

## Product

- **MVP scope.** What exactly is in v1? To be decided with the team. Likely
  centers on the interface (overlay + Slackbot + desktop app), core context
  sources, and agentic onboarding actions — but the cut needs a real discussion.
- **Admin panel & the permission / isolation model.** Sensitive context must stay
  isolated across teams. Is a person's access computed *automatically* from the
  Slack channels and calls they're in, or *configured* by an admin? What does a
  single admin panel even look like, and what does it actually control? This
  needs a dedicated brainstorm.
- **Automated access provisioning (post-MVP).** MVP routes and sets up access;
  later Jarvis grants it himself. How technically and security-wise hard is that?
  Needs a real double-check before committing.
- **Where the role-specific onboarding comes from.** Jarvis is role-agnostic and
  adapts by prompt — but does the *content* of a role's onboarding come from the
  company configuring it, from Jarvis inferring it from sources, or a hybrid?
- **Technical form of the desktop app.** Native macOS/Windows, Electron,
  something else? How do the keyboard shortcut and voice work reliably across all
  apps?
- **How we guarantee no hallucinations.** The principle is "never invent, route to
  the responsible human instead." What's the actual mechanism that enforces this?
- **Meeting consent & privacy.** One-on-ones are opt-in — good. But for team
  calls: whose consent is needed, is there a visible "Jarvis is here" indicator,
  what's retained, for how long, and who can query it later?

## Go-to-market

- **Pricing model.** Per seat, per hire onboarded, or a platform subscription?
- **Confirm the buyer.** Is the COO (then Head of Operations) really the
  converting persona? Validate via the landing page.

## Validation

- **Which hero angle resonates** — "shrink time-to-performance" vs. "grow more top
  performers" (test together).
- **Which CTA converts** — waitlist vs. book-a-call.
- **What counts as success** on the landing page (conversion bar, number of
  qualified signups from the right people).

## Vision

- **The emotional core (Q6).** Still open. We have the operational framing (top
  performers, time-to-performance); we still want the one human line about what
  it *feels* like to start a job with no context. Placeholder draft lives in
  [vision.md](./vision.md) — to be replaced when it clicks.
