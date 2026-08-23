/*
  The FAQ content, lifted out of the page so the rendered accordion and the
  FAQPage JSON-LD are generated from the same array. Two hand-maintained copies
  of this list would drift, and structured data that contradicts the visible
  page is a manual-action risk, not just a stale-content one.
*/

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "How does Jarvis grant access safely?",
    a: "Access is the sensitive part, so it runs on rules you define, with approvals where you want them and a full audit trail. You decide what Jarvis can grant on its own and what still needs a human yes.",
  },
  {
    q: "What about data privacy?",
    a: "Jarvis separates your personal work context — your Slack, meetings, contacts — from shared company knowledge. You control what teammates and admins can see.",
  },
  {
    q: "What does it connect to?",
    a: "Slack and your knowledge base to start, with identity providers, code hosting, meetings, and cloud on the roadmap. Jarvis also exposes context to AI tools over MCP.",
  },
  {
    q: "Is it available today?",
    a: "We're in early access and validating with design partners. Join the waitlist and we'll reach out as we open spots.",
  },
  {
    q: "Does it work with our existing tools?",
    a: "Yes — Jarvis sits on top of what you already use. It reads from Slack, Confluence, GitHub, and your identity provider. No migration, no new workflow.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are running in under a day. Connect your integrations, define your access rules, and Jarvis is ready to onboard your next hire.",
  },
];
