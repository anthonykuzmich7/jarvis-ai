# Open questions

Things we still need to decide or validate. Not blockers for documenting the
vision, but they shape the product, the go-to-market, and the landing page.

## Positioning

- **Name.** "Jarvis AI" is a working title. Is it final? (Trademark / the Marvel
  association may be a problem.)
- **Company size sweet spot.** We're betting on growing 100+ person companies. Too
  small and they onboard informally with no budget; too large and there's an
  established L&D / IT machine with existing tools. Is 100+ (and how far up) the
  right band?
- **Which C-level buyer converts first.** We target the group — COO, CTO, CRO /
  Head of Operations — but who actually signs? COO has budget and owns throughput;
  CTO feels engineer ramp most directly. Validate via the landing page.

## Product

- **MVP scope.** What exactly is in v1? Likely the interface (overlay + Slackbot +
  desktop app), core context sources, role-aware onboarding for one or two roles,
  screen-guided pointing, and agentic onboarding actions — but the cut needs a
  real discussion.
- **Screen awareness — how it's built and how far it goes.** v1 highlights/points;
  it does not drive the cursor. Reading the screen across arbitrary apps (Chrome,
  IDE, desktop tools): native macOS/Windows app, accessibility APIs, or screen
  capture + vision model? This decision gates the signature moment. When (if ever)
  do we add full cursor-driving?
- **Admin panel & the permission / isolation model.** Sensitive context must stay
  isolated across teams. Is a person's access computed *automatically* from the
  Slack channels and calls they're in, or *configured* by an admin? What does the
  admin panel control? Needs a dedicated brainstorm.
- **Where the role-specific onboarding content comes from.** Does the company
  configure each role's day-one steps, does Jarvis infer them from sources, or a
  hybrid? The setup burden on the company is make-or-break for adoption.
- **How it knows your role.** Company config, new-hire picks on first launch, or
  pulled from the HR system / offer letter? Changes how "automatic" day one feels.
- **Automated access provisioning (post-MVP).** MVP routes and sets up access;
  later Jarvis grants it himself. How technically and security-wise hard is that —
  approval flows, audit trail? This is likely the #1 buyer objection. Needs a real
  review before committing.
- **Technical form of the desktop app.** Native macOS/Windows, Electron, browser
  extension? Each has different distribution friction and capability tradeoffs,
  and the keyboard shortcut + voice mechanics depend on it.
- **How voice works across apps.** Push-to-talk, a hotword, or grab-the-overlay-
  then-speak? Always-listening is powerful but creepy and awkward when you're
  already on a call. What feels instant but not invasive?
- **How we guarantee no hallucinations.** The principle is "never invent, route to
  the responsible human." What's the actual mechanism that enforces it?
- **MCP surface.** What exactly does the personal layer expose over MCP to tools
  like Claude Code, and how does it authenticate per user?
- **How much character is too much.** v1 is minimalism + a light, warm character.
  How playful can it be before it undercuts trust with a C-level buyer — and is it
  adjustable per company?

## Privacy / trust

- **Screen awareness comfort.** The signature moment depends on Jarvis seeing the
  screen. New hires might love it on day one and dislike it on day thirty. Is it
  strictly onboarding-scoped or always available? How do we make "it sees my
  screen" feel safe, not surveilled?
- **Meeting consent & privacy.** One-on-ones are opt-in — good. For team calls:
  whose consent is needed, is there a visible "Jarvis is here" indicator, what's
  retained, for how long, and who can query it later? Done right it's a moat; done
  wrong it's what gets us banned from the company.

## Go-to-market

- **Pricing model.** Per seat, per hire onboarded, or a platform subscription?
- **Integrations to prioritize for v1.** Slack, Docs, and Calendar are named. What
  else first — Jira/Linear, GitHub/GitLab, Google Meet/Zoom?

## Validation

- **Which hero angle resonates** — "shrink time-to-performance" vs. "grow more top
  performers" (test together).
- **Which CTA converts** — waitlist vs. book-a-call.
- **What counts as success** on the landing page (conversion bar, number of
  qualified signups from the right people).
- **How we drive the right traffic** to it (where do COO / CTO / CRO leaders hang
  out?).

## Vision

- **The emotional core.** We have the operational framing (top performers,
  time-to-performance); we still want the one human line about what it *feels* like
  to start a job with no context. Draft: *"Starting a new job means being dropped
  into a company with no context — you don't know how anything works, who owns
  what, or who to ask, and you spend your best early weeks feeling slow instead of
  doing the work you were hired for."* Replace when a sharper line clicks.
