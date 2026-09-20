import type { Metadata } from "next";
import Link from "next/link";
import { ContentShell } from "@/components/site-shell";
import { PageHero } from "@/components/content/primitives";
import {
  ActionList,
  LegalDocument,
  LegalFooterNote,
  LegalH3,
  LegalItem,
  LegalList,
  LegalP,
  LegalSection,
  LimitedUseCallout,
  Mailto,
  Mono,
  Outbound,
  PlainSummary,
  ScopeGrid,
  type LegalEntry,
} from "@/components/content/legal";
import { findLegalPage, metaTitle } from "@/lib/content/pages";
import { CONTACT_EMAIL } from "@/lib/site";

const page = findLegalPage("/privacy");

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

/* One entry per LegalSection below, in the same order. The rail numbers the
   sections from this array, so adding a section means adding it here. */
const CONTENTS: LegalEntry[] = [
  { id: "who-we-are", title: "Who we are" },
  { id: "google-data", title: "Google account data" },
  { id: "storage", title: "Where it is stored" },
  { id: "leaves", title: "When data leaves your Mac" },
  { id: "other-sources", title: "Slack, Teams and meetings" },
  { id: "never", title: "What we never do" },
  { id: "delete", title: "Deleting data, revoking access" },
  { id: "website", title: "This website" },
  { id: "rights", title: "Your rights" },
  { id: "changes", title: "Changes" },
  { id: "contact", title: "Contact" },
];

const SUMMARY = [
  {
    claim: "Your mail stays on your Mac",
    detail:
      "Jarvis reads Gmail into a database inside your own user library. There is no copy of it on any server we run.",
  },
  {
    claim: "We hold no account for you",
    detail:
      "The app has no backend that stores your messages, meetings, or tasks. Nothing to breach, nothing for us to hand over.",
  },
  {
    claim: "One thing does leave",
    detail:
      "Text is sent to Anthropic when Jarvis writes your day or finds tasks. Section 4 says exactly what, and how to turn it off.",
  },
  {
    claim: "Deleting is deleting",
    detail:
      "Drag the app to the bin and delete one folder. The data is gone, because it was only ever in that folder.",
  },
];

const SCOPES = [
  {
    scope: "gmail.readonly",
    reads:
      "Subject, sender, recipients, date, and body text of messages in your inbox, for the history window you pick when you connect.",
    purpose:
      "Building the local search index, and finding the tasks and commitments buried in your mail.",
    lands: (
      <>
        A database file on your Mac. Read only: Jarvis cannot send, delete, or
        alter a message.
      </>
    ),
  },
  {
    scope: "calendar.events.readonly",
    reads:
      "Today's events on your primary calendar: title, time, attendees, and the joining link.",
    purpose: "Drawing today's meetings on the Focus screen.",
    lands: (
      <>
        Nowhere. Calendar events are held in memory while the screen is open and
        are never written to disk.
      </>
    ),
  },
];

const DELETION = [
  {
    action: "Disconnect the account",
    detail: (
      <>
        Settings, then Gmail, then Disconnect. This deletes the stored
        credential for that account from your Mac.
      </>
    ),
  },
  {
    action: "Delete the local data",
    detail: (
      <>
        Quit Jarvis and delete{" "}
        <Mono>~/Library/Application Support/JarvisGuide/</Mono>. That folder is
        every message, meeting, task, and credential the app holds.
      </>
    ),
  },
  {
    action: "Revoke our access at Google",
    detail: (
      <>
        Independently of the app, at{" "}
        <Outbound href="https://myaccount.google.com/permissions">
          myaccount.google.com/permissions
        </Outbound>
        . Revoking stops any further reading immediately.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <ContentShell>
      <PageHero
        eyebrow="Privacy"
        title="What Jarvis does with your data"
        standfirst={
          <>
            Jarvis is a Mac app that reads your mail, your calendar, and your
            chat so it can tell you what your day looks like. That is an
            unusual amount of access, so this page is specific about what it
            reads, where the result sits, and the one case where anything
            leaves your machine.
          </>
        }
      />

      <PlainSummary points={SUMMARY} />

      <LegalDocument contents={CONTENTS}>
        <LegalSection id="who-we-are" index={1} title="Who we are">
          <LegalP>
            Jarvis is built and operated by Palina Shymanovich, an individual
            trading as Jarvis, based in Poland. For the purposes of the EU
            General Data Protection Regulation, she is the data controller for
            the limited personal data described in sections 8 and 9.
          </LegalP>
          <LegalP>
            Reach us at <Mailto address={CONTACT_EMAIL} />. This policy covers
            the Jarvis macOS application and the website at
            www.jarviscontext.com.
          </LegalP>
        </LegalSection>

        <LegalSection id="google-data" index={2} title="Google account data">
          <LegalP>
            When you connect a Google account, Jarvis asks for two read-only
            scopes and no others. Each one is here because a specific feature
            needs it.
          </LegalP>

          <ScopeGrid scopes={SCOPES} />

          <LegalP>
            You choose how far back the first sync reads, 7, 30, or 90 days,
            in Settings before you connect. Jarvis never requests write
            access to Gmail or Calendar, so it cannot send mail, delete mail,
            or change an event.
          </LegalP>

          <LimitedUseCallout>
            <p>
              Jarvis&apos;s use and transfer of information received from Google
              APIs adheres to the{" "}
              <Outbound href="https://developers.google.com/terms/api-services-user-data-policy">
                Google API Services User Data Policy
              </Outbound>
              , including the Limited Use requirements.
            </p>
            <p>
              Concretely: Google user data is used only to provide and improve
              the features described above. It is never sold, never used for
              advertising, never used to train any machine learning or
              generative model, and is never read by a human at Jarvis. We have
              no ability to read it, because we never receive a copy.
            </p>
          </LimitedUseCallout>
        </LegalSection>

        <LegalSection id="storage" index={3} title="Where it is stored">
          <LegalP>
            Everything Jarvis syncs is written to a single folder on your own
            Mac: <Mono>~/Library/Application Support/JarvisGuide/</Mono>.
          </LegalP>
          <LegalList>
            <LegalItem>
              <Mono>messages.db</Mono> holds the message text, the full-text
              search index, and the numeric embeddings used for semantic search.
            </LegalItem>
            <LegalItem>
              <Mono>meetings/</Mono> holds meeting audio and transcripts, if you
              use meeting capture.
            </LegalItem>
            <LegalItem>
              OAuth credentials are stored beside them as files readable only by
              your own user account.
            </LegalItem>
          </LegalList>
          <LegalP>
            The search that makes Jarvis useful runs entirely on that machine.
            The embedding model ships inside the app and needs no network, so
            indexing your mail and searching it happen offline.
          </LegalP>
        </LegalSection>

        <LegalSection id="leaves" index={4} title="When data leaves your Mac">
          <LegalP>
            Some Jarvis features are written by a large language model: the
            sentence that opens your day, the task finder, task extraction from
            mail, and meeting summaries. Those features send text to Anthropic,
            the company behind Claude. This is the only routine case where
            content leaves your machine.
          </LegalP>

          <LegalH3>What is sent</LegalH3>
          <LegalP>
            The relevant excerpts for that request, which can include the
            subject and body text of emails, the transcript of a meeting you
            recorded, and the titles of tasks Jarvis already knows about. Only
            what the request needs is sent, not your database.
          </LegalP>

          <LegalH3>How it is sent</LegalH3>
          <LegalList>
            <LegalItem>
              With your own Anthropic API key, the app calls Anthropic directly
              over HTTPS. Nothing passes through us.
            </LegalItem>
            <LegalItem>
              With shared access, the request is relayed by a small server we
              run so that our key can be used instead of yours. That server
              forwards the request to Anthropic and returns the answer. It does
              not store, log, or inspect the content of your request.
            </LegalItem>
          </LegalList>

          <LegalH3>What Anthropic does with it</LegalH3>
          <LegalP>
            Anthropic processes the request to produce a reply and does not use
            data submitted through its API to train its models. Their handling
            is governed by their own terms and privacy policy, which you can
            read at{" "}
            <Outbound href="https://www.anthropic.com/legal/privacy">
              anthropic.com/legal/privacy
            </Outbound>
            .
          </LegalP>

          <LegalH3>Turning it off</LegalH3>
          <LegalP>
            These features are the reason to use Jarvis, so they are on by
            default. If you remove your API key and do not use shared access,
            the model features stop and the rest of the app, including search
            and the local index, keeps working.
          </LegalP>
        </LegalSection>

        <LegalSection
          id="other-sources"
          index={5}
          title="Slack, Microsoft Teams and meetings"
        >
          <LegalH3>Slack and Microsoft Teams</LegalH3>
          <LegalP>
            Both are read live and nothing is kept. When a search needs a Slack
            or Teams message, Jarvis asks their API at that moment, uses the
            reply to answer, and discards it. No Slack or Teams message text is
            ever written to the database. Jarvis only ever looks in the
            conversations you select.
          </LegalP>

          <LegalH3>Meetings</LegalH3>
          <LegalP>
            Meeting capture is off until you start it, and it records the audio
            of the call on your Mac. Transcription runs on your machine with a
            speech model that ships with the app, so the audio itself is never
            uploaded anywhere. The resulting transcript is text like any other,
            which means a summary of it follows section 4.
          </LegalP>
          <LegalP>
            Recording other people has legal requirements that vary by country.
            Telling the people on the call is your responsibility, not ours.
          </LegalP>
        </LegalSection>

        <LegalSection id="never" index={6} title="What we never do">
          <LegalList>
            <LegalItem>
              We never sell your data, and we have nothing to sell: we hold no
              copy of it.
            </LegalItem>
            <LegalItem>
              We never use your content for advertising or profiling.
            </LegalItem>
            <LegalItem>
              We never use your content, or any Google user data, to train a
              model.
            </LegalItem>
            <LegalItem>
              No employee or contractor reads your messages. There is no
              administrative console that could show them.
            </LegalItem>
            <LegalItem>
              We do not share your content with any third party beyond the model
              provider named in section 4.
            </LegalItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="delete"
          index={7}
          title="Deleting data and revoking access"
        >
          <LegalP>
            Because your data lives on your own machine, deleting it is
            something you do rather than something you request.
          </LegalP>
          <ActionList actions={DELETION} />
          <LegalP>
            If you would rather we did it, or you want confirmation of what we
            hold, write to <Mailto address={CONTACT_EMAIL} /> and we will answer
            within 30 days.
          </LegalP>
        </LegalSection>

        <LegalSection id="website" index={8} title="This website">
          <LegalP>
            The website is separate from the app and is the only place we
            collect anything ourselves.
          </LegalP>
          <LegalList>
            <LegalItem>
              <span className="text-coal-ink">Analytics.</span> We use PostHog,
              hosted in the European Union, to count visits and see which pages
              work. Session recording is on, with every form field masked, so
              what you type is not captured.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">Early access list.</span> If you
              give us your email address, we store it in a private spreadsheet
              to email you about Jarvis. Ask us to remove it at any time and we
              will.
            </LegalItem>
          </LegalList>
          <LegalP>
            Website data is kept for as long as it is useful and no longer than
            two years. We do not run advertising trackers.
          </LegalP>
        </LegalSection>

        <LegalSection id="rights" index={9} title="Your rights">
          <LegalP>
            Under the GDPR you may ask for a copy of the personal data we hold
            about you, ask us to correct or erase it, object to our using it,
            ask us to restrict how we use it, or ask for it in a portable form.
            Write to <Mailto address={CONTACT_EMAIL} />.
          </LegalP>
          <LegalP>
            In practice the answer is usually short, because the only personal
            data we hold about you is an email address you gave us and the
            website analytics in section 8. Everything the app reads stays with
            you. If you believe we have handled your data badly, you may
            complain to your national data protection authority. In Poland that
            is the President of the Personal Data Protection Office.
          </LegalP>
        </LegalSection>

        <LegalSection id="changes" index={10} title="Changes to this policy">
          <LegalP>
            If this policy changes in a way that affects what Jarvis does with
            your data, we will change the effective date below and say what
            moved. Continuing to use Jarvis after that counts as accepting the
            new version. A change that would widen what we collect will be put
            to you in the app before it takes effect, not buried here.
          </LegalP>
        </LegalSection>

        <LegalSection id="contact" index={11} title="Contact">
          <LegalP>
            Palina Shymanovich, operating as Jarvis, Poland.
            <br />
            <Mailto address={CONTACT_EMAIL} />
          </LegalP>
          <LegalP>
            Questions about a specific clause are welcome and get a real answer.
          </LegalP>
        </LegalSection>

        <LegalFooterNote effective={EFFECTIVE}>
          See also the{" "}
          <Link
            href="/terms"
            className="text-graphite underline decoration-fossil underline-offset-[3px] transition-colors hover:text-coal-ink"
          >
            terms of service
          </Link>
          .
        </LegalFooterNote>
      </LegalDocument>
    </ContentShell>
  );
}
