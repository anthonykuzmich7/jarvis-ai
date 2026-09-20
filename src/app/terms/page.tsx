import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import { PageHero } from "@/components/content/primitives";
import {
  LegalDocument,
  LegalFooterNote,
  LegalItem,
  LegalList,
  LegalP,
  LegalSection,
  Mailto,
  Outbound,
  type LegalEntry,
} from "@/components/content/legal";
import { findLegalPage, metaTitle } from "@/lib/content/pages";
import { CONTACT_EMAIL } from "@/lib/site";

const page = findLegalPage("/terms");

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

const EFFECTIVE = "20 September 2026";

const CONTENTS: LegalEntry[] = [
  { id: "agreement", title: "Who you agree with" },
  { id: "what-it-is", title: "What Jarvis is" },
  { id: "early-access", title: "Early access and cost" },
  { id: "your-side", title: "Your side of it" },
  { id: "acceptable-use", title: "Acceptable use" },
  { id: "third-parties", title: "Connected services" },
  { id: "your-content", title: "Your content" },
  { id: "no-warranty", title: "No warranty" },
  { id: "liability", title: "Liability" },
  { id: "ending", title: "Ending it" },
  { id: "law", title: "Changes and governing law" },
];

export default function TermsPage() {
  return (
    <ContentShell>
      <PageHero
        eyebrow="Terms"
        title="Terms of service"
        standfirst={
          <>
            The agreement between you and us when you use Jarvis. It is short
            on purpose. The part people actually care about, what happens to
            their data, lives in the{" "}
            <Link
              href="/privacy"
              className="text-coal-ink underline decoration-fossil underline-offset-[3px] transition-colors hover:decoration-graphite"
            >
              privacy policy
            </Link>
            .
          </>
        }
      />

      <div className="pb-4 sm:pb-8" />

      <LegalDocument contents={CONTENTS}>
        <LegalSection id="agreement" index={1} title="Who you agree with">
          <LegalP>
            These terms are between you and Palina Shymanovich, an individual
            trading as Jarvis, based in Poland. Installing or using the Jarvis
            macOS application, or using this website, means you accept them. If
            you do not, do not use Jarvis.
          </LegalP>
          <LegalP>
            If you are using Jarvis for work, you confirm you are allowed to
            connect the accounts you connect. Some employers restrict which
            applications may read company mail or chat. Checking that is your
            call to make, not ours.
          </LegalP>
        </LegalSection>

        <LegalSection id="what-it-is" index={2} title="What Jarvis is">
          <LegalP>
            Jarvis is a Mac application that reads sources you connect, builds a
            private index of them on your own machine, and uses that index to
            show you your day, find your tasks, and answer questions from your
            coding tools. It runs on your computer. We do not host your data and
            we cannot see it.
          </LegalP>
        </LegalSection>

        <LegalSection id="early-access" index={3} title="Early access and cost">
          <LegalP>
            Jarvis is in early access. Features appear, change, and are removed.
            Some of what you see may not survive to a stable release. We may
            limit or pause access, or stop offering Jarvis entirely, at any
            time.
          </LegalP>
          <LegalP>
            Jarvis is currently free. If we introduce paid plans we will say so
            before charging anyone, and using it up to that point never becomes
            a bill after the fact.
          </LegalP>
        </LegalSection>

        <LegalSection id="your-side" index={4} title="Your side of it">
          <LegalList>
            <LegalItem>
              Keep your own machine and your account credentials secure. Anyone
              with access to your Mac has access to what Jarvis has indexed.
            </LegalItem>
            <LegalItem>
              If you use your own Anthropic API key, usage billed to that key is
              yours, including usage by features that run on a schedule.
            </LegalItem>
            <LegalItem>
              If you record meetings, tell the other people on the call. The law
              on this differs by country and the obligation is yours.
            </LegalItem>
            <LegalItem>
              Keep your own backups. Jarvis stores everything locally and we
              hold no copy to restore from.
            </LegalItem>
          </LegalList>
        </LegalSection>

        <LegalSection id="acceptable-use" index={5} title="Acceptable use">
          <LegalP>Do not use Jarvis to:</LegalP>
          <LegalList>
            <LegalItem>
              read accounts, mailboxes, or conversations you are not entitled to
              read;
            </LegalItem>
            <LegalItem>
              break the law, or breach the terms of Google, Slack, Microsoft,
              Anthropic, or any other service you connect;
            </LegalItem>
            <LegalItem>
              record people covertly where doing so is unlawful;
            </LegalItem>
            <LegalItem>
              attack, overload, or reverse engineer the parts of Jarvis we run,
              including the update feed and the model relay.
            </LegalItem>
          </LegalList>
        </LegalSection>

        <LegalSection id="third-parties" index={6} title="Connected services">
          <LegalP>
            Jarvis talks to services you connect: Google, Slack, Microsoft, and
            Anthropic. Each has its own terms and its own privacy policy, and
            your use of them is governed by those, not by this document. We are
            not responsible for their availability, their pricing, or their
            decisions. If one of them changes an API or cuts off access, the
            matching Jarvis feature may stop working.
          </LegalP>
          <LegalP>
            Jarvis reads those services on your behalf, under your own
            authorisation, and only within the scope you grant. You can revoke
            that authorisation at any time from the service&apos;s own settings,
            for example at{" "}
            <Outbound href="https://myaccount.google.com/permissions">
              myaccount.google.com/permissions
            </Outbound>
            .
          </LegalP>
        </LegalSection>

        <LegalSection id="your-content" index={7} title="Your content">
          <LegalP>
            Your messages, meetings, notes, and tasks are yours. We claim no
            ownership of them and no licence over them. Because they are stored
            on your machine rather than ours, there is nothing for us to claim a
            licence to.
          </LegalP>
          <LegalP>
            The Jarvis software, name, and brand remain ours. Using the app does
            not transfer any of that to you.
          </LegalP>
        </LegalSection>

        <LegalSection id="no-warranty" index={8} title="No warranty">
          <LegalP>
            Jarvis is provided as is and as available, without warranty of any
            kind, to the fullest extent the law allows. We do not promise it is
            free of defects, that it will always be available, or that it is fit
            for any particular purpose.
          </LegalP>
          <LegalP>
            In particular, Jarvis uses language models, and language models get
            things wrong. A task it finds may not be a task. A summary may
            mislead. A deadline it reads out of a message may be the wrong date.
            Check anything that matters before you act on it.
          </LegalP>
        </LegalSection>

        <LegalSection id="liability" index={9} title="Liability">
          <LegalP>
            To the fullest extent permitted by law, we are not liable for
            indirect or consequential loss, lost profits, lost business, or lost
            data arising from your use of Jarvis. Where liability cannot be
            excluded, it is limited to the greater of the amount you paid us in
            the twelve months before the claim, or fifty euro.
          </LegalP>
          <LegalP>
            Nothing here limits liability for death or personal injury caused by
            negligence, for fraud, or for anything else that cannot lawfully be
            limited. If you are a consumer in the European Union, your statutory
            rights are unaffected by this section.
          </LegalP>
        </LegalSection>

        <LegalSection id="ending" index={10} title="Ending it">
          <LegalP>
            You can stop at any time: disconnect your accounts, delete the app,
            and delete its data folder. We can suspend or end your access if you
            breach these terms, or if we stop offering Jarvis. Sections 7, 8, 9,
            and 11 survive the end of this agreement.
          </LegalP>
        </LegalSection>

        <LegalSection id="law" index={11} title="Changes and governing law">
          <LegalP>
            We may update these terms. The effective date below changes when we
            do, and material changes will be flagged in the app rather than
            slipped in here. Continuing to use Jarvis after a change means you
            accept it.
          </LegalP>
          <LegalP>
            These terms are governed by the law of Poland, and the courts of
            Poland have jurisdiction. If you are a consumer, this does not
            deprive you of the protection of the mandatory law of the country
            you live in. Questions go to <Mailto address={CONTACT_EMAIL} />.
          </LegalP>
        </LegalSection>

        <LegalFooterNote effective={EFFECTIVE}>
          See also the{" "}
          <Link
            href="/privacy"
            className="text-graphite underline decoration-fossil underline-offset-[3px] transition-colors hover:text-coal-ink"
          >
            privacy policy
          </Link>
          .
        </LegalFooterNote>
      </LegalDocument>
    </ContentShell>
  );
}
