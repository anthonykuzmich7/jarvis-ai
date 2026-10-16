/*
  The FAQ content, lifted out of the page so the rendered accordion and the
  FAQPage JSON-LD are generated from the same array. Two hand-maintained copies
  of this list would drift, and structured data that contradicts the visible
  page is a manual-action risk, not just a stale-content one.
*/

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: "Which apps does Jarvis read?",
    a: "Slack, Rocket.Chat, Telegram, Gmail, Apple Mail and Jira, plus Google Calendar for your meetings.",
  },
  {
    q: "Does it store my messages?",
    a: "Chat messages are read live and never saved. Gmail is kept in a database on your Mac. Nothing is stored on a Jarvis server.",
  },
  {
    q: "Does a bot join my calls?",
    a: "No. Jarvis records the call’s audio on your Mac when you press Take notes, so nobody sees an extra participant.",
  },
  {
    q: "Which Macs does it run on?",
    a: "Apple Silicon and Intel Macs. Recording both sides of a call needs macOS 14.4 or later.",
  },
  {
    q: "Can I change what Jarvis thinks is urgent?",
    a: "Yes. Pin any task’s priority, or tell Jarvis a rule like “anything from Alex is urgent”. A priority you pin always wins.",
  },
  {
    q: "What happens after the trial?",
    a: "Jarvis Pro is €15 a month, VAT included. Subscribe or cancel from Settings → Plan.",
  },
];
