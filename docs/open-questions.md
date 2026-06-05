# Open questions

Things we still need to decide or validate. Not blockers for documenting the
vision, but they shape the product and the landing page.

## Positioning

- **Name.** "Jarvis AI" is a working title. Is it final? (Trademark / the
  Marvel association may be a problem.)
- **Who is the buyer?** IT/DevOps lead, eng manager, or People/HR Ops? They have
  different pains and different budgets.
- **Company size sweet spot.** Fast-growing startups (lots of hires, weak
  process) vs. mid-size vs. enterprise (more security/compliance friction).

## Product

- **Access provisioning is the hard, sensitive part.** Actually *granting*
  access means deep, trusted integration with identity and permission systems
  (Okta, Google Workspace, GitHub, cloud IAM…). What's the minimum we can do
  safely, and what's just "tell you who to ask" at first?
- **Security model.** How does Jarvis decide who gets what? Approval flows?
  Audit trail? This is likely the #1 objection from buyers.
- **Integrations to prioritize.** Slack and Confluence are named. What else for
  v1 — Google Meet/Zoom, GitHub/GitLab, the cloud?
- **MCP surface.** What exactly does Jarvis expose over MCP to tools like Claude
  Code, and how does it authenticate per user?
- **Personal vs. company context boundary.** Jarvis holds *your* Slack/meetings
  and the *company's* knowledge. Where's the privacy line? What can teammates or
  admins see?

## Go-to-market

- **Pricing model.** Per seat, per hire onboarded, flat platform fee?
- **First wedge.** Lead with access-provisioning, with the knowledge/onboarding
  assistant, or with the personal-context-for-AI-tools angle?

## Validation

- **What counts as success** on the landing page (conversion bar, number of
  qualified signups).
- **How we drive the right traffic** to it (where do IT/eng leads hang out?).
