import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import {
  Card,
  Cards,
  ComparisonTable,
  CtaBand,
  H3,
  Lede,
  Mono,
  Note,
  P,
  PageHero,
  ReadNext,
  Section,
} from "@/components/content/primitives";
import { findPage, metaTitle } from "@/lib/content/pages";
import {
  breadcrumbJsonLd,
  jsonLdString,
  pageJsonLd,
} from "@/lib/structured-data";

const page = findPage("/mcp");

export const metadata: Metadata = {
  title: metaTitle(page),
  description: page.description,
  alternates: { canonical: page.path },
  openGraph: {
    title: page.title,
    description: page.description,
    url: page.path,
    type: "article",
  },
};

/* The tools the server actually exposes. Listed because a developer deciding
   whether to wire this up wants the surface area, not adjectives — and because
   naming them gives an AI answer something concrete to quote. */
const TOOLS = [
  {
    name: "search_context",
    blurb:
      "Full-text and semantic search across every synced source at once. One query, ranked results, with the source and date attached.",
  },
  {
    name: "get_thread",
    blurb:
      "The whole conversation a message belongs to, so an answer carries the argument that produced it rather than one line out of context.",
  },
  {
    name: "get_surrounding_messages",
    blurb:
      "The messages either side of a hit. Cheap way to widen a result without pulling an entire channel into the model's context window.",
  },
  {
    name: "get_messages_on_date",
    blurb:
      "Everything from a given day across all sources — the query behind \"what did I miss on Tuesday?\"",
  },
  {
    name: "list_conversations",
    blurb:
      "The channels, DMs, and threads available to search, so a client can scope a query before running it.",
  },
  {
    name: "get_conversation_messages",
    blurb: "A single conversation, read in order, paginated.",
  },
];

export default function McpPage() {
  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            pageJsonLd({ ...page, type: "TechArticle" }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "MCP server", path: page.path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Model Context Protocol"
        title="Your work context, as an MCP server"
        standfirst={
          <>
            Jarvis syncs your Slack, Gmail, and meeting notes into a store on
            your own machine, then serves it over MCP. Claude Code, Claude
            Desktop, or any MCP client can query it directly — so the model
            already knows what you have been working on before you type a word.
          </>
        }
      />

      <Section title="The problem MCP actually solves">
        <Lede>
          Every model you use starts each conversation with amnesia. You
          compensate by pasting: the thread where the decision was made, the
          ticket, last week&apos;s call notes, the bit of the doc that matters.
        </Lede>
        <P>
          That paste is the whole job. It is also the reason your AI tools stay
          shallow — you only ever give them the context you remembered to find,
          which is a fraction of what exists and skewed toward whatever you
          looked at most recently.
        </P>
        <P>
          The Model Context Protocol exists so tools can fetch context for
          themselves. Jarvis is the server on the other end of that connection:
          instead of you searching Slack and pasting the result, the model
          issues <Mono>search_context</Mono> and gets it.
        </P>
      </Section>

      <Section title="What it looks like in practice">
        <P>
          A real exchange, in Claude Code. You ask a question that has no answer
          in the repository, because the answer lives in the last three days of
          your team&apos;s conversation:
        </P>
        <div className="mt-5 max-w-[68ch] overflow-hidden rounded-[12px] border border-ash bg-coal-ink">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[11.5px] text-white/45">
              Claude Code
            </span>
          </div>
          <div className="space-y-3 px-5 py-5 font-mono text-[12.5px] leading-[1.7]">
            <p className="text-white/85">
              <span className="text-white/40">❯</span> what did I miss on the
              payments bug?
            </p>
            <p className="text-white/55">
              jarvis － search_context(query: &quot;payments bug&quot;)
              <br />
              <span className="text-white/35">
                &nbsp;&nbsp;└ 12 messages across 4 sources
              </span>
            </p>
            <p className="text-white/85">
              Tom&apos;s fix is in review, not shipped. It double-charged 3
              customers.
            </p>
            <p className="text-white/35">
              #eng · 3d&nbsp;&nbsp;·&nbsp;&nbsp;ENG-2481&nbsp;&nbsp;·&nbsp;&nbsp;PR
              #142&nbsp;&nbsp;·&nbsp;&nbsp;Eng sync, Aug 19
            </p>
          </div>
        </div>
        <p className="mt-3 max-w-[68ch] text-[13px] leading-[1.55] text-stone">
          Four sources, one question, no pasting. The citations matter as much
          as the answer — you can check the claim rather than trust it.
        </p>
      </Section>

      <Section title="The tools the server exposes">
        <P>
          Six retrieval tools, deliberately narrow. Each returns cited results
          with a source and a timestamp, so the model can attribute what it
          tells you and you can follow it back.
        </P>
        <Cards>
          {TOOLS.map((tool) => (
            <Card
              key={tool.name}
              title={<span className="font-mono text-[13.5px]">{tool.name}</span>}
            >
              {tool.blurb}
            </Card>
          ))}
        </Cards>
      </Section>

      <Section title="Why the store is local">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <H3>Your inbox does not need another cloud copy</H3>
            <P>
              Syncing years of Slack and email into someone else&apos;s
              infrastructure is a real decision with real consequences, and it
              is the reason most people never adopt a tool like this. Jarvis
              keeps the index on your machine.
            </P>
            <H3>Retrieval is a local read</H3>
            <P>
              Queries resolve in milliseconds against a local store, and they
              work on a plane. There is no round trip to a vector database you
              are renting by the month.
            </P>
          </div>
          <div>
            <H3>Personal context stays personal</H3>
            <P>
              Jarvis keeps the context you accumulate separate from what your
              team shares. Your DMs and your inbox inform your answers without
              becoming company-wide knowledge, which is the distinction most
              &quot;team knowledge base&quot; products collapse.
            </P>
            <H3>You can point it at any client</H3>
            <P>
              MCP is a protocol, not an integration. Anything that speaks it —
              Claude Code, Claude Desktop, your own agent — connects the same
              way.
            </P>
          </div>
        </div>
      </Section>

      <Section title="How this differs from a RAG pipeline">
        <ComparisonTable
          themLabel="Rolling your own RAG"
          checked="August 2026"
          rows={[
            {
              axis: "Getting the data in",
              them: "Write and maintain a connector per source, plus the auth, backfill, and incremental sync for each.",
              us: "Slack, Gmail, and meeting notes sync out of the box. Adding a source is a setting, not a sprint.",
            },
            {
              axis: "Keeping it current",
              them: "A scheduled re-index you own, which silently goes stale when a token expires.",
              us: "Continuous sync. The store reflects this morning's threads, not last month's snapshot.",
            },
            {
              axis: "Where it runs",
              them: "Usually a hosted vector database, billed monthly, holding a copy of your inbox.",
              us: "On your machine. Nothing leaves it to answer a query.",
            },
            {
              axis: "Wiring it to a model",
              them: "A bespoke tool definition per client, rewritten when the client changes.",
              us: "One MCP endpoint. Any MCP client connects without new code.",
            },
          ]}
        />
        <div className="mt-6">
          <Note label="What this is not">
            <p>
              This is not a general-purpose document store, and it is not a
              replacement for search over your codebase — your repository is
              already a better index of itself than any of this.
            </p>
            <p>
              It is specifically the conversational context that lives outside
              your code: what was decided, by whom, in which thread, and what
              was still unresolved when the meeting ended.
            </p>
          </Note>
        </div>
      </Section>

      <Section title="Getting access">
        <P>
          Jarvis is in early access and we are onboarding design partners a few
          at a time — developers using Claude Code daily are exactly who we want
          on it now. Join the waitlist and tell us what you would want it to
          answer.
        </P>
        <P>
          If you want the broader picture first,{" "}
          <Link
            href="/ai-context-management"
            className="font-medium text-coal-ink underline underline-offset-2 hover:text-graphite"
          >
            how Jarvis handles context generally
          </Link>{" "}
          covers what it syncs and how the layers separate.
        </P>
      </Section>

      <CtaBand
        title="Give your AI tools your context"
        body="Early access is open to design partners. Tell us what you'd want Jarvis to answer and we'll be in touch."
      />

      <ReadNext
        links={[
          {
            href: "/ai-context-management",
            title: "AI context management",
            blurb:
              "What Jarvis syncs, how personal and shared context stay separate.",
          },
          {
            href: "/meeting-assistant",
            title: "Meeting assistant",
            blurb:
              "How calls become one source in your context rather than an orphaned transcript.",
          },
          {
            href: "/vs/granola",
            title: "Jarvis vs Granola",
            blurb:
              "Why a notetaker and a context layer are different products.",
          },
        ]}
      />
    </ContentShell>
  );
}
