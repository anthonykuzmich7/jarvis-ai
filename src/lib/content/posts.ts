/*
  Posts, stored as blocks rather than a markdown string.

  The reason is the schema: `Article` JSON-LD wants a headline, a date, and a
  word count, and the blog index wants an excerpt and a reading time. Deriving
  all of that from structured blocks is exact; deriving it from a markdown blob
  means a parser and a pile of edge cases for a two-post blog.

  Dates are ISO and fixed at publication. They appear in `datePublished`, so
  changing one retroactively tells Google the article is newer than it is.
*/

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "note"; label: string; text: string }
  | { kind: "code"; lines: string[] };

export type Post = {
  slug: string;
  title: string;
  /** <meta name="description"> and the index excerpt. 140–155 characters. */
  description: string;
  /** ISO date. */
  published: string;
  /** The question this post is trying to be the answer to, in search. */
  targets: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "give-claude-context-about-your-work",
    title: "How to give Claude context about your work",
    description:
      "Four ways to stop re-explaining your project to an AI assistant every morning — from better pasting to a context server that fetches it for you.",
    published: "2026-08-18",
    targets: "how do I give Claude context about my work",
    body: [
      {
        kind: "p",
        text: "Every morning you open a new conversation and the model knows nothing. Not what you shipped yesterday, not the argument in the channel about the schema, not the decision your lead made on the call you missed. So you spend the first five minutes reconstructing it by hand.",
      },
      {
        kind: "p",
        text: "That reconstruction is a tax, and it compounds: the context you paste is only ever the context you remembered to look for, which is a fraction of what exists and biased toward whatever you happened to read last. Here are four ways to reduce it, from cheapest to most complete.",
      },
      { kind: "h2", text: "1. Write the context down once, in the repo" },
      {
        kind: "p",
        text: "The lowest-effort improvement is a file the assistant reads automatically. Claude Code picks up CLAUDE.md; other tools have their own convention. Put in it the things you would otherwise explain every time: what this project is, the conventions that are not obvious from the code, the decisions someone would otherwise undo.",
      },
      {
        kind: "p",
        text: "This works well for facts that are stable and about the code. It works badly for anything that changes weekly or lives in a conversation — which is most of what you actually need.",
      },
      { kind: "h2", text: "2. Paste better, not more" },
      {
        kind: "p",
        text: "When you do paste, paste the argument rather than the conclusion. A model given the decision alone will defend it; a model given the thread that produced it can tell you the tradeoff was already considered and rejected for a reason that no longer holds.",
      },
      {
        kind: "ul",
        items: [
          "Include who said it. Attribution changes how much weight a claim deserves, for a model as much as for you.",
          "Include the date. Half of what is in a channel is superseded, and nothing in the text says so.",
          "Include the thing that was rejected, not just the thing that was chosen.",
        ],
      },
      { kind: "h2", text: "3. Point the assistant at a search tool" },
      {
        kind: "p",
        text: "Better than pasting is letting the model fetch. If your assistant supports tools, giving it a search function over your own sources removes the step where you have to know in advance what is relevant.",
      },
      {
        kind: "p",
        text: "The catch is that you now own a retrieval pipeline: a connector per source, the auth for each, backfill, incremental sync, and an index that goes quietly stale when a token expires. This is a real project, and it is why most people who start here end up back at pasting.",
      },
      { kind: "h2", text: "4. Use a context server" },
      {
        kind: "p",
        text: "The Model Context Protocol standardised this. Instead of building a bespoke tool per assistant, you run one server that holds your context and speaks a protocol any MCP client can call. Claude Code, Claude Desktop, and your own agents all connect the same way.",
      },
      {
        kind: "p",
        text: "What makes it work is coverage. A server over your documents alone gets you what you already had. A server over the conversations — Slack threads, email, what was said on the call — gets you the part that was never written down anywhere else.",
      },
      {
        kind: "code",
        lines: [
          "❯ what did I miss on the payments bug?",
          "",
          "jarvis － search_context(query: \"payments bug\")",
          "  └ 12 messages across 4 sources",
          "",
          "Tom's fix is in review, not shipped. It double-charged 3 customers.",
          "  #eng · 3d   ENG-2481   PR #142   Eng sync, Aug 19",
        ],
      },
      {
        kind: "p",
        text: "Note the citations. A context server that answers without telling you where the answer came from has replaced one trust problem with a worse one — you can no longer check it. Insist on sources.",
      },
      { kind: "h2", text: "What to do about it" },
      {
        kind: "p",
        text: "Start with the file in the repo, because it costs an hour and removes the most repetitive explaining. Then look honestly at what is left: if what you keep pasting is threads and call notes rather than facts about the code, no amount of documentation will fix it, because the problem is retrieval, not writing.",
      },
      {
        kind: "note",
        label: "What we're building",
        text: "Jarvis is a context server over Slack, Gmail, and meeting notes, with the index kept on your own machine. It's in early access — if this is the problem you have, we'd like to hear what you'd want it to answer.",
      },
    ],
  },
  {
    slug: "what-is-an-mcp-context-server",
    title: "What is an MCP context server?",
    description:
      "A plain explanation of Model Context Protocol servers — what they do, how they differ from RAG, and what separates a useful one from a demo.",
    published: "2026-08-21",
    targets: "what is an MCP context server",
    body: [
      {
        kind: "p",
        text: "An MCP server is a program that exposes tools an AI client can call. The Model Context Protocol defines how they talk, so any client that speaks it can use any server without either side knowing about the other in advance. A context server is the subset whose job is retrieval: it holds information and hands it over when asked.",
      },
      {
        kind: "p",
        text: "The practical effect is that the model stops depending on what you remembered to paste. It asks.",
      },
      { kind: "h2", text: "What actually happens in a call" },
      {
        kind: "p",
        text: "When you connect a client to a server, the server advertises its tools — names, descriptions, and the shape of their arguments. The model reads those descriptions and decides when a tool is worth calling. You ask a question, the model recognises it needs context it does not have, and it issues a call.",
      },
      {
        kind: "ul",
        items: [
          "The client sends a tool call with arguments the model chose.",
          "The server runs the query against whatever it holds and returns results.",
          "The results enter the conversation as context, and the model answers from them.",
        ],
      },
      {
        kind: "p",
        text: "The tool descriptions matter more than people expect. They are the only thing the model has to decide with, so a vague description produces a server that is technically connected and never actually used.",
      },
      { kind: "h2", text: "How this differs from RAG" },
      {
        kind: "p",
        text: "Retrieval-augmented generation usually means a pipeline you own: chunk the documents, embed them, store the vectors, and inject the top matches into the prompt before the model sees it. Retrieval happens whether or not it was needed, and the application decides what gets pulled.",
      },
      {
        kind: "p",
        text: "MCP inverts that. The model decides, mid-conversation, whether to retrieve and what to ask for — and it can ask twice, narrowing the second time. It also decouples the retrieval from the app: the same server serves every client you use, rather than each app carrying its own copy of the pipeline.",
      },
      {
        kind: "p",
        text: "They are not exclusive. Plenty of MCP servers run a RAG pipeline behind the tool call. The difference is who controls when it fires.",
      },
      { kind: "h2", text: "What separates a useful server from a demo" },
      { kind: "h3", text: "It covers something not already accessible" },
      {
        kind: "p",
        text: "A server over your codebase is mostly redundant — the assistant can already read the files. The valuable coverage is what the model has no other route to: the Slack thread where the approach was chosen, the email where the client changed their mind, what was actually said on the call.",
      },
      { kind: "h3", text: "It cites its sources" },
      {
        kind: "p",
        text: "Results should carry a source and a timestamp. Without them you cannot tell a current decision from one superseded three weeks ago, and neither can the model — which is how you get a confident answer built on a thread that everyone involved has since abandoned.",
      },
      { kind: "h3", text: "It returns little enough to be useful" },
      {
        kind: "p",
        text: "A tool that returns an entire channel has moved the problem rather than solved it. Good retrieval tools return ranked, scoped results and offer a second call to widen a specific hit — a thread, or the messages either side of a match.",
      },
      { kind: "h3", text: "It stays current on its own" },
      {
        kind: "p",
        text: "The most common failure is not a bad answer. It is a server that indexed everything once, six weeks ago, and has been quietly answering from a snapshot ever since. Continuous sync is not a nice-to-have here; without it the whole thing degrades into confident staleness.",
      },
      { kind: "h2", text: "Where the data lives" },
      {
        kind: "p",
        text: "A context server over your work conversations is, by construction, an index of your Slack and your inbox. That is worth a moment's thought before you run someone else's. A local server answers queries from your own machine, which removes the question entirely and has the side benefit of resolving in milliseconds and working offline.",
      },
      {
        kind: "note",
        label: "Related",
        text: "Jarvis runs as a local MCP server over Slack, Gmail, and meeting notes, exposing six retrieval tools with cited results. See the MCP page for the tool surface.",
      },
    ],
  },
];

export const findPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Word count across prose blocks — used for the reading time and for the
    `wordCount` field in Article schema. */
export const wordCount = (post: Post) =>
  post.body.reduce((total, block) => {
    const text =
      block.kind === "ul"
        ? block.items.join(" ")
        : block.kind === "code"
          ? ""
          : block.kind === "note"
            ? block.text
            : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);

export const readingMinutes = (post: Post) =>
  Math.max(1, Math.round(wordCount(post) / 220));
