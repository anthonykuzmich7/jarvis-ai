import type { ComparisonRow } from "@/components/content/primitives";

/*
  Comparison-page content.

  A rule for everything in this file: no claim about another product that we
  have not checked, and no row engineered so we win it. These pages exist to
  capture people searching "<competitor> alternative", and that reader has
  already used the product — a table that misrepresents it destroys the trust
  the page was built to earn, and invites a complaint we would deserve.

  Where a competitor is genuinely better, the row says so. Where Jarvis has not
  shipped something yet, the row says that too.

  Facts verified August 2026 against each vendor's own documentation and
  current third-party reviews. Re-check before editing; these products ship
  fast.
*/

export type Competitor = {
  slug: string;
  name: string;
  url: string;
  /** One line on what they are, in their terms, not ours. */
  positioning: string;
  /** Genuine strengths. Written to be fair, not faint praise. */
  strengths: { title: string; body: string }[];
  rows: ComparisonRow[];
  /** The honest routing advice. */
  pickThem: string[];
  pickUs: string[];
};

export const competitors: Competitor[] = [
  {
    slug: "granola",
    name: "Granola",
    url: "https://www.granola.ai",
    positioning:
      "A bot-free AI notepad that records meeting audio locally and enhances the notes you type yourself, rather than dumping a generic transcript on you.",
    strengths: [
      {
        title: "The bot-free model is the right one",
        body: "Granola captures system audio from your own machine, so nothing joins the call as a visible participant. No awkward 'Granola Notetaker has entered the meeting' in a client call.",
      },
      {
        title: "It augments your notes instead of replacing them",
        body: "You keep typing during the call and Granola fills in around what you wrote. The result reads like your notes on a good day, which is a genuinely different product from a transcript summariser.",
      },
      {
        title: "It already integrates well",
        body: "Slack, Notion, HubSpot, Affinity, Attio and Zapier on the Business tier, plus an MCP integration of its own. If your need is meeting notes reaching other tools, Granola does that today.",
      },
    ],
    rows: [
      {
        axis: "What it's for",
        them: "Making one meeting produce excellent notes.",
        us: "Answering questions that span meetings, Slack, and email at once.",
      },
      {
        axis: "Sources",
        them: "Meetings you attend, captured from your machine's audio.",
        us: "Slack channels and DMs, Gmail, and meeting notes — including notes from a tool like Granola.",
      },
      {
        axis: "Bot in the call",
        them: "No. Records system audio locally.",
        us: "No. Same approach.",
      },
      {
        axis: "MCP",
        them: "Yes — exposes Granola's meeting content to MCP clients.",
        us: "Yes — exposes Slack, email, and meetings together through one server.",
      },
      {
        axis: "Where the data sits",
        them: "Notes sync to Granola's cloud so they're available across devices.",
        us: "The searchable store stays on your machine; queries resolve locally.",
      },
      {
        axis: "Maturity",
        them: "Shipping, widely used, Mac and Windows.",
        us: "Early access, onboarding design partners. Fewer sources, less polish.",
      },
    ],
    pickThem: [
      "Your problem is meeting notes specifically, and you want the best tool for that job today.",
      "You want something mature that you can roll out this week.",
      "You take notes during calls and want them made better rather than replaced.",
    ],
    pickUs: [
      "Your problem is that the answer is never in one place — it's split across a channel, a call, and an email.",
      "You want your AI tools to pull that whole picture themselves rather than waiting for a paste.",
      "You'd rather the index of your inbox and DMs lived on your own machine.",
    ],
  },
  {
    slug: "otter",
    name: "Otter.ai",
    url: "https://otter.ai",
    positioning:
      "The long-running transcription incumbent. OtterPilot joins your calls as a participant, transcribes in real time, and builds a deep searchable archive.",
    strengths: [
      {
        title: "Transcription accuracy and custom vocabulary",
        body: "Otter claims 95%+ accuracy and lets you train it on industry terms and names it would otherwise mangle. If a verbatim record is the deliverable, this matters more than anything else on this page.",
      },
      {
        title: "Real-time transcription during the call",
        body: "The transcript appears live, which is genuinely useful for accessibility and for anyone who joined late and needs to catch up mid-meeting.",
      },
      {
        title: "Years of archive and a mature product",
        body: "Otter has been doing this longer than almost anyone, and the depth of its searchable archive reflects that.",
      },
    ],
    rows: [
      {
        axis: "What it's for",
        them: "A reliable, searchable transcript of what was said.",
        us: "An answer to what was decided, drawn from wherever it was decided.",
      },
      {
        axis: "Bot in the call",
        them: "Yes. OtterPilot joins as a visible participant, which some guests and clients notice.",
        us: "No bot joins the call.",
      },
      {
        axis: "Sources",
        them: "Meetings, plus what you upload.",
        us: "Slack, Gmail, and meetings together.",
      },
      {
        axis: "Languages",
        them: "Four — English, French, Spanish, German.",
        us: "English today. Fewer than Otter, and worth knowing if your calls aren't in English.",
      },
      {
        axis: "Free tier",
        them: "300 minutes a month, capped at 30 minutes per recording.",
        us: "No free tier yet — early access is invite-based while we onboard design partners.",
      },
      {
        axis: "Maturity",
        them: "Long-established, heavily used, enterprise-ready.",
        us: "Early access. We're the newer, narrower product and we're not pretending otherwise.",
      },
    ],
    pickThem: [
      "You need a verbatim, accurate transcript as the actual deliverable — for compliance, research, or accessibility.",
      "Your meetings aren't in English.",
      "You want real-time captions during the call.",
    ],
    pickUs: [
      "You don't want a bot appearing in client calls.",
      "The transcript isn't the problem — finding the decision across Slack, email, and the call is.",
      "You want that context available to Claude and your other AI tools.",
    ],
  },
  {
    slug: "fathom",
    name: "Fathom",
    url: "https://fathom.video",
    positioning:
      "A fast, free, well-reviewed meeting recorder. Records natively on Zoom without a visible bot, turns around summaries in about thirty seconds, and gives away more on its free plan than anyone else.",
    strengths: [
      {
        title: "The most generous free plan in the category",
        body: "Unlimited recordings and transcripts with no storage limit or minute cap, with AI summaries limited to five a month. For an individual, that's hard to argue with.",
      },
      {
        title: "Very fast turnaround",
        body: "Summaries land roughly thirty seconds after the call ends, which is the difference between reading it now and reading it never.",
      },
      {
        title: "Broad language and platform coverage",
        body: "38 languages across Zoom, Google Meet, and Microsoft Teams — considerably wider than most of the category, and wider than Jarvis today.",
      },
    ],
    rows: [
      {
        axis: "What it's for",
        them: "Fast, free, accurate summaries of individual calls.",
        us: "One searchable memory across your calls, Slack, and email.",
      },
      {
        axis: "Sources",
        them: "Meetings on Zoom, Google Meet, and Microsoft Teams.",
        us: "Slack, Gmail, and meeting notes together.",
      },
      {
        axis: "Languages",
        them: "38.",
        us: "English today. Fathom wins this one clearly.",
      },
      {
        axis: "Cost to start",
        them: "Free, with unlimited recording and five AI summaries a month.",
        us: "Invite-based early access while we onboard design partners.",
      },
      {
        axis: "Answering across sources",
        them: "Answers are scoped to your recorded meetings.",
        us: "A question searches meetings, channels, and email at once, and cites which source each part came from.",
      },
      {
        axis: "Feeding your AI tools",
        them: "Integrations and exports out to other tools.",
        us: "An MCP server your AI client queries directly, with no export step.",
      },
    ],
    pickThem: [
      "You want something excellent for free, today, with no sales conversation.",
      "You record a lot of calls and mostly need each one summarised well.",
      "You need language coverage beyond English.",
    ],
    pickUs: [
      "Your meetings are only part of the picture and the rest lives in Slack and email.",
      "You keep re-explaining your work to Claude and want it to fetch context itself.",
      "You'd rather your searchable index of work conversations stayed on your machine.",
    ],
  },
];

export const findCompetitor = (slug: string) =>
  competitors.find((c) => c.slug === slug);
