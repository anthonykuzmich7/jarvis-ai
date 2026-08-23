import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentShell } from "@/components/site-shell";
import {
  ComparisonTable,
  CtaBand,
  H3,
  Lede,
  Note,
  P,
  PageHero,
  ReadNext,
  Section,
} from "@/components/content/primitives";
import { competitors, findCompetitor } from "@/lib/content/competitors";
import { findPage, metaTitle } from "@/lib/content/pages";
import {
  breadcrumbJsonLd,
  comparisonJsonLd,
  jsonLdString,
} from "@/lib/structured-data";

type Props = { params: Promise<{ slug: string }> };

/* Prerenders all three comparison pages at build time, and — because the route
   has no dynamic fallback — makes any other /vs/* URL a clean 404 rather than
   a thin generated page. Crawlers should not be able to invent routes here. */
export function generateStaticParams() {
  return competitors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const competitor = findCompetitor(slug);
  if (!competitor) return {};
  const page = findPage(`/vs/${slug}`);
  return {
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
}

export default async function ComparisonPage({ params }: Props) {
  const { slug } = await params;
  const competitor = findCompetitor(slug);
  if (!competitor) notFound();
  const page = findPage(`/vs/${slug}`);

  const others = competitors.filter((c) => c.slug !== slug);

  return (
    <ContentShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            comparisonJsonLd({
              path: page.path,
              title: page.title,
              description: page.description,
              competitor: { name: competitor.name, url: competitor.url },
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdString(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: `Jarvis vs ${competitor.name}`, path: page.path },
            ]),
          ),
        }}
      />

      <PageHero
        eyebrow="Comparison"
        title={`Jarvis vs ${competitor.name}`}
        standfirst={
          <>
            Short version: these are not the same product.{" "}
            {competitor.name} is a meeting tool and a good one. Jarvis is a
            context layer that reads your meetings, your Slack, and your email
            together. If you are picking one to take notes on your calls, pick{" "}
            {competitor.name}.
          </>
        }
      />

      <Section title={`What ${competitor.name} is good at`}>
        <Lede>{competitor.positioning}</Lede>
        <div className="mt-6 grid max-w-[72ch] gap-5">
          {competitor.strengths.map((strength) => (
            <div key={strength.title}>
              <H3>{strength.title}</H3>
              <P>{strength.body}</P>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Side by side">
        <P>
          The rows below are the ones that actually differ. Where{" "}
          {competitor.name} is ahead, the row says so.
        </P>
        <ComparisonTable
          themLabel={competitor.name}
          rows={competitor.rows}
          checked="August 2026"
        />
      </Section>

      <Section title="Which one you want">
        <div className="grid max-w-[76ch] gap-3 sm:grid-cols-2">
          <div className="rounded-[10px] border border-ash bg-white p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-graphite">
              Choose {competitor.name}
            </p>
            <ul className="space-y-2.5">
              {competitor.pickThem.map((reason) => (
                <li
                  key={reason}
                  className="text-[14px] leading-[1.6] tracking-[-0.1px] text-slate-mid"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[10px] border border-ash bg-parchment p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-smolder">
              Choose Jarvis
            </p>
            <ul className="space-y-2.5">
              {competitor.pickUs.map((reason) => (
                <li
                  key={reason}
                  className="text-[14px] leading-[1.6] tracking-[-0.1px] text-graphite"
                >
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="You can also use both">
        <P>
          Jarvis reads meeting notes as a source. If your team has already
          standardised on {competitor.name}, those notes become part of what
          Jarvis searches alongside Slack and email — it sits above your
          notetaker rather than replacing it.
        </P>
        <P>
          That is the honest answer for most teams reading this page: keep the
          notetaker you like, and add the layer that connects it to everything
          else.{" "}
          <Link
            href="/meeting-assistant"
            className="font-medium text-coal-ink underline underline-offset-2 hover:text-graphite"
          >
            How Jarvis handles meetings
          </Link>
          .
        </P>
        <div className="mt-6">
          <Note label="Fair warning">
            <p>
              Jarvis is in early access with fewer sources and less polish than
              a product that has been shipping for years. If you need something
              working across your team this week, {competitor.name} is the
              safer call and we would rather tell you now.
            </p>
          </Note>
        </div>
      </Section>

      <CtaBand
        title="If the context problem is the one you have"
        body="We're onboarding design partners a few at a time. Tell us where your context goes missing and we'll reach out."
      />

      <ReadNext
        links={[
          ...others.map((other) => ({
            href: `/vs/${other.slug}`,
            title: `Jarvis vs ${other.name}`,
            blurb: other.positioning.split(".")[0] + ".",
          })),
          {
            href: "/mcp",
            title: "The MCP server",
            blurb: "How your context reaches Claude and other AI tools.",
          },
        ]}
      />
    </ContentShell>
  );
}
