import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import {
  Card,
  Cards,
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

const page = findPage("/ai-context-management");

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

const LAYERS = [
  {
    name: "Company",
    blurb:
      "Vision, goals, and direction — the things every new person is told once in week one and then has to infer for a year.",
  },
  {
    name: "Team",
    blurb:
      "Current priorities, who owns which direction, what was decided last sprint and why the alternative was rejected.",
  },
  {
    name: "Personal",
    blurb:
      "Your own accumulating work context: your threads, your calls, your open loops. Never pooled into the shared layers.",
  },
];

export default function ContextManagementPage() {
  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(pageJsonLd({ ...page, type: "Article" })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "AI context management", path: page.path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Context management"
        title="Context management for the work you actually do"
        standfirst={
          <>
            Search &quot;AI context management&quot; and you get data
            governance — cataloguing warehouses, enriching metadata, making
            enterprise tables AI-ready. That is a real problem and it is not
            this one. Jarvis manages the context a single person carries around
            in their head, and hands it to whoever asks.
          </>
        }
      />

      <Section title="Two different things share one name">
        <Lede>
          The enterprise version of this category is about governing structured
          data at company scale: which tables mean what, who may query them,
          how lineage is tracked. Buyers are data platform teams.
        </Lede>
        <P>
          The other version — the one that ruins your Tuesday — is that you
          cannot remember which Slack thread had the decision, your AI assistant
          knows nothing about your project, and the answer to
          &quot;what did we agree?&quot; is spread across a channel, an email,
          and a call nobody wrote up.
        </P>
        <P>
          Jarvis is built for the second one. No warehouse, no catalogue, no
          data team required.
        </P>
      </Section>

      <Section title="What Jarvis treats as context">
        <P>
          Context is not documents. It is the conversation around the documents
          — the part that explains why the doc says what it says.
        </P>
        <Cards>
          <Card title="Conversations">
            Slack channels, DMs, and threads. Where most decisions are actually
            made and where none of them are written down.
          </Card>
          <Card title="Email">
            The thread with the customer, the vendor, the contract. Usually the
            only record of an external commitment.
          </Card>
          <Card title="Meetings">
            What was said on the call, filed next to the thread that led to it.
            See <Mono>/meeting-assistant</Mono>.
          </Card>
          <Card title="Docs and tickets">
            Confluence, Notion, Jira, and Linear — the structured record, used
            to anchor the unstructured one.
          </Card>
          <Card title="People and ownership">
            The org chart and who owns which area, so &quot;who do I ask about
            this?&quot; has an answer.
          </Card>
          <Card title="Your own history">
            What you have been working on, accumulating as you work. This is
            what makes it useful on day 200, not just day one.
          </Card>
        </Cards>
      </Section>

      <Section title="Three layers, deliberately separated">
        <P>
          Pooling everything into one index is the easy build and the wrong
          one. An engineer should not surface marketing&apos;s numbers by
          accident, and your DMs should not become company knowledge because
          you happened to mention a decision in one.
        </P>
        <div className="mt-4 grid max-w-[72ch] gap-3">
          {LAYERS.map((layer) => (
            <div
              key={layer.name}
              className="flex flex-col gap-1.5 rounded-[10px] border border-ash bg-white p-5 sm:flex-row sm:gap-6"
            >
              <p className="w-24 shrink-0 font-display text-[15px] font-semibold tracking-[-0.25px] text-coal-ink">
                {layer.name}
              </p>
              <p className="text-[14px] leading-[1.6] tracking-[-0.1px] text-slate-mid">
                {layer.blurb}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Note label="On privacy">
            <p>
              Your personal layer is yours. It informs the answers Jarvis gives
              you without being readable by teammates or admins, and the store
              itself sits on your own machine rather than in a vendor&apos;s
              cloud.
            </p>
          </Note>
        </div>
      </Section>

      <Section title="Context that gets delivered, not just stored">
        <P>
          A context store nobody queries is a more expensive filing cabinet.
          Jarvis exposes what it holds in the three places you would actually
          reach for it:
        </P>
        <div className="mt-4 grid max-w-[72ch] gap-5">
          <div>
            <H3>Ask it in Slack</H3>
            <P>
              Tag Jarvis where the work already happens and get a cited answer
              back in the thread.
            </P>
          </div>
          <div>
            <H3>Let your AI tools query it</H3>
            <P>
              Over MCP, so Claude Code and any other client can pull context
              themselves instead of waiting for you to paste it.{" "}
              <Link
                href="/mcp"
                className="font-medium text-coal-ink underline underline-offset-2 hover:text-graphite"
              >
                How the MCP server works
              </Link>
              .
            </P>
          </div>
          <div>
            <H3>Have it act</H3>
            <P>
              Context is what makes an action safe to take. Knowing who owns an
              access is what lets Jarvis open the right chat, write the intro,
              and find a slot the three of you share.
            </P>
          </div>
        </div>
      </Section>

      <Section title="Honest limits">
        <Note label="What we're not claiming">
          <p>
            Jarvis is in early access. Slack, Gmail, and meeting notes are what
            it syncs today; docs, tickets, and identity providers are on the
            roadmap rather than shipped, and we would rather say so here than
            let you find out after signing up.
          </p>
          <p>
            It also will not invent an answer. When the context is not there,
            it says so and points you at the person most likely to know — a
            confident wrong answer costs more than an honest gap.
          </p>
        </Note>
      </Section>

      <CtaBand />

      <ReadNext
        links={[
          {
            href: "/mcp",
            title: "The MCP server",
            blurb:
              "The six retrieval tools your AI client can call, and why the store is local.",
          },
          {
            href: "/meeting-assistant",
            title: "Meeting assistant",
            blurb: "How calls get captured and filed beside everything else.",
          },
          {
            href: "/blog",
            title: "Writing",
            blurb:
              "Notes on context engineering and why your AI tools keep forgetting.",
          },
        ]}
      />
    </ContentShell>
  );
}
