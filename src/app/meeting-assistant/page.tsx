import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import {
  Card,
  Cards,
  CtaBand,
  Lede,
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

const page = findPage("/meeting-assistant");

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

export default function MeetingAssistantPage() {
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
              { name: "Meeting assistant", path: page.path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Meetings"
        title="A meeting assistant that remembers the rest of your week"
        standfirst={
          <>
            The transcript was never the hard part. Half a dozen tools produce
            an excellent summary of one call and then leave it sitting in an app
            you have to remember to open. Jarvis files the call next to the
            Slack thread and the email that explain it, and answers questions
            across all three.
          </>
        }
      />

      <Section title="The gap notetakers leave">
        <Lede>
          Meeting tools have got very good. Recording is reliable, summaries are
          accurate, and most of them will post a recap into Slack when the call
          ends.
        </Lede>
        <P>
          The gap is what happens on Thursday, when you need to know why the
          launch date moved. The decision was floated in a channel on Monday,
          argued in a call on Tuesday, and confirmed in an email to the client
          on Wednesday. Your notetaker has a perfect record of Tuesday and no
          idea the other two happened.
        </P>
        <P>
          So you do the reconstruction by hand — search Slack, scroll the
          recap, find the email — which is exactly the work the tool was
          supposed to remove.
        </P>
      </Section>

      <Section title="What Jarvis does with a call">
        <Cards>
          <Card title="Captures it">
            Jarvis is present on the calls you want it on — team meetings and
            standups by default, one-on-ones only if you opt in, with Jarvis
            asking rather than assuming.
          </Card>
          <Card title="Pulls out what's actionable">
            Decisions, owners, and open loops, rather than a wall of text that
            reads like a transcript with the timestamps removed.
          </Card>
          <Card title="Files it with everything else">
            The call joins your Slack threads, email, and tickets in one
            searchable store — one source among several, not its own island.
          </Card>
          <Card title="Answers across all of it">
            &quot;What did we decide about the launch date?&quot; searches the
            call, the channel, and the thread together, and cites which is which.
          </Card>
          <Card title="Reports back in the morning">
            A short sync on what moved and what needs you, rather than a
            notification per meeting.
          </Card>
          <Card title="Hands it to your AI tools">
            Meeting context reaches Claude over MCP with everything else, so
            your assistant knows what the call concluded.
          </Card>
        </Cards>
      </Section>

      <Section title="If you already use a notetaker, keep it">
        <P>
          This is the part most comparison pages will not tell you: Granola,
          Otter, and Fathom are good at what they do, and Jarvis is not trying
          to beat them at transcription accuracy.
        </P>
        <P>
          Jarvis reads meeting notes as a source. If your team has standardised
          on a notetaker, those notes become part of the context Jarvis searches
          alongside Slack and email — the layer above, not a replacement.
        </P>
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { href: "/vs/granola", label: "Jarvis vs Granola" },
            { href: "/vs/otter", label: "Jarvis vs Otter" },
            { href: "/vs/fathom", label: "Jarvis vs Fathom" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-ash bg-white px-4 py-2 text-[13.5px] font-medium text-graphite transition-colors hover:border-fossil hover:text-coal-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Where it stands today">
        <Note label="Early access">
          <p>
            Jarvis is onboarding design partners rather than generally
            available. Slack, Gmail, and meeting notes are synced today;
            wider coverage is on the roadmap.
          </p>
          <p>
            If meetings are the sharpest version of this problem for your team,
            that is useful for us to know — say so when you join and we will
            prioritise accordingly.
          </p>
        </Note>
      </Section>

      <CtaBand
        title="Stop reconstructing last week"
        body="Early access is open to design partners. Tell us where your context goes missing and we'll be in touch."
      />

      <ReadNext
        links={[
          {
            href: "/ai-context-management",
            title: "AI context management",
            blurb: "The full picture of what Jarvis syncs and how it separates.",
          },
          {
            href: "/mcp",
            title: "The MCP server",
            blurb: "How your meeting context reaches Claude and other AI tools.",
          },
          {
            href: "/vs/granola",
            title: "Jarvis vs Granola",
            blurb: "Notetaker or context layer — an honest comparison.",
          },
        ]}
      />
    </ContentShell>
  );
}
