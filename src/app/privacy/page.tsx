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

const EFFECTIVE = "22 September 2026";

/* One entry per LegalSection below, in the same order. The rail numbers the
   sections from this array, so adding a section means adding it here. */
const CONTENTS: LegalEntry[] = [
  { id: "who-we-are", title: "Who we are" },
  { id: "google-data", title: "Google user data we access" },
  { id: "storage", title: "Where it is stored" },
  { id: "protection", title: "How we protect your data" },
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
      "Text is sent to Anthropic when Jarvis writes your day or finds tasks. Section 5 says exactly what, and how to turn it off.",
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
      "Messages in your inbox, for the history window you pick: the sender, subject, date, and body text of each one, plus the connected mailbox's own address, used to label the account. Attachments are never downloaded.",
    purpose:
      "Finding the requests, tasks, and commitments buried in your mail, and showing you which email a task came from.",
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
      "Today's events on your primary calendar: title, start and end time, how many people are invited, your own reply (so declined meetings are hidden), and the joining link, which Jarvis looks for in the event's conference details, location, or description.",
    purpose:
      "Drawing today's meetings on the Focus screen, with a Join button that opens the call.",
    lands: (
      <>
        Nowhere. Calendar events are held in memory while the screen is open and
        are never written to disk.
      </>
    ),
  },
  {
    scope: "openid · email · profile",
    reads:
      "Your name, email address, profile picture, and Google account ID, from the signed token Google returns when you sign in with Google. Requested only if you use shared access.",
    purpose:
      "Signing in to shared access (section 5). Our relay checks the verified email address against the list of people we have given access.",
    lands: (
      <>
        Nowhere on our side. The relay reads the email address, issues a
        time-limited session token, and keeps nothing. The app stores that
        session token on your Mac.
      </>
    ),
  },
];

const DELETION = [
  {
    action: "Disconnect the account",
    detail: (
      <>
        Settings, then Gmail, then Disconnect. This asks Google to revoke
        Jarvis&apos;s access to that account and deletes the stored credential
        from your Mac.
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
            the limited personal data described in sections 9 and 10.
          </LegalP>
          <LegalP>
            Reach us at <Mailto address={CONTACT_EMAIL} />. This policy covers
            the Jarvis macOS application and the website at
            www.jarviscontext.com.
          </LegalP>
        </LegalSection>

        <LegalSection
          id="google-data"
          index={2}
          title="Google user data we access"
        >
          <LegalP>
            Jarvis accesses Google user data only through the OAuth scopes
            below. When you connect a Google account in Settings, it asks for
            the two read-only data scopes. The three sign-in scopes are asked
            for only if you sign in with Google to use shared access. Each scope
            is here because a specific feature needs it, and Jarvis accesses no
            other Google user data.
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
            <p>
              Jarvis does not use Google Workspace API data to develop, improve,
              or train generalized or non-personalized AI or ML models. The
              model provider named in section 5 does not train on data sent
              through its API.
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
              <Mono>messages.db</Mono> holds the text of synced emails and
              meeting transcripts, and the tasks Jarvis found in them.
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
            Nothing in that folder is copied to a server we run. It stays there
            until you delete it, as described in section 8.
          </LegalP>
        </LegalSection>

        <LegalSection id="protection" index={4} title="How we protect your data">
          <LegalP>
            Google user data, and everything else Jarvis reads, is protected in
            the following ways.
          </LegalP>
          <LegalList>
            <LegalItem>
              <span className="text-coal-ink">Encrypted in transit.</span>{" "}
              Every request to Google, to Anthropic, and to our relay uses HTTPS
              (TLS). The only unencrypted connections are the ones that never
              leave your Mac, such as the sign-in redirect back to the app on
              127.0.0.1.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">No passwords.</span> Google
              sign-in uses OAuth 2.0 with PKCE in your own browser. Jarvis never
              sees your Google password.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">
                Credentials locked to your account.
              </span>{" "}
              OAuth tokens are stored on your Mac as files only your macOS user
              can read (permission 0600, in a folder only you can open), and
              never on a server.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">Stored on your device.</span>{" "}
              Email text and tasks sit only in your own user library, behind
              your macOS login. We recommend keeping FileVault on, which
              encrypts the whole disk, this folder included.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">Only what is needed.</span>{" "}
              Scopes are read-only. Only your inbox, within the window you pick,
              is synced. Attachments are never downloaded, and calendar events
              are never written to disk.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">No central copy.</span> We run no
              database of your content, so there is no central store to breach.
              Our relay forwards requests without storing or logging their
              content.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">Verified software.</span> The app
              is signed with an Apple Developer ID, notarized by Apple, and runs
              with the hardened runtime. Updates are cryptographically signed,
              and the app checks the signature before installing one.
            </LegalItem>
            <LegalItem>
              <span className="text-coal-ink">Access ends on disconnect.</span>{" "}
              Disconnecting a Google account asks Google to revoke the token and
              deletes it from your Mac.
            </LegalItem>
          </LegalList>
          <LegalP>
            If you find a security problem, write to{" "}
            <Mailto address={CONTACT_EMAIL} />.
          </LegalP>
        </LegalSection>

        <LegalSection id="leaves" index={5} title="When data leaves your Mac">
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
            subject and body text of emails, Slack or Teams messages Jarvis read
            for that request, the transcript of a meeting you recorded, and the
            titles of tasks Jarvis already knows about. Only what the request
            needs is sent, not your database.
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
            the model features stop. The rest of the app keeps working: mail
            still syncs, your meetings still show, and meeting capture still
            records, but Jarvis stops finding new tasks.
          </LegalP>
        </LegalSection>

        <LegalSection
          id="other-sources"
          index={6}
          title="Slack, Microsoft Teams and meetings"
        >
          <LegalH3>Slack and Microsoft Teams</LegalH3>
          <LegalP>
            Both are read live and nothing is kept. When Jarvis looks for tasks,
            or shows you where a task came from, it asks their API at that
            moment, uses the reply, and discards it. No Slack or Teams message text is
            ever written to the database. Jarvis only ever looks in the
            conversations you select.
          </LegalP>

          <LegalH3>Meetings</LegalH3>
          <LegalP>
            Meeting capture is off until you start it, and it records the audio
            of the call on your Mac. Transcription runs on your machine with a
            speech model that ships with the app, so the audio itself is never
            uploaded anywhere. The resulting transcript is text like any other,
            which means a summary of it follows section 5.
          </LegalP>
          <LegalP>
            Recording other people has legal requirements that vary by country.
            Telling the people on the call is your responsibility, not ours.
          </LegalP>
        </LegalSection>

        <LegalSection id="never" index={7} title="What we never do">
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
              provider named in section 5.
            </LegalItem>
          </LegalList>
        </LegalSection>

        <LegalSection
          id="delete"
          index={8}
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

        <LegalSection id="website" index={9} title="This website">
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

        <LegalSection id="rights" index={10} title="Your rights">
          <LegalP>
            Under the GDPR you may ask for a copy of the personal data we hold
            about you, ask us to correct or erase it, object to our using it,
            ask us to restrict how we use it, or ask for it in a portable form.
            Write to <Mailto address={CONTACT_EMAIL} />.
          </LegalP>
          <LegalP>
            In practice the answer is usually short, because the only personal
            data we hold about you is an email address you gave us and the
            website analytics in section 9. Everything the app reads stays with
            you. If you believe we have handled your data badly, you may
            complain to your national data protection authority. In Poland that
            is the President of the Personal Data Protection Office.
          </LegalP>
        </LegalSection>

        <LegalSection id="changes" index={11} title="Changes to this policy">
          <LegalP>
            If this policy changes in a way that affects what Jarvis does with
            your data, we will change the effective date below and say what
            moved. Continuing to use Jarvis after that counts as accepting the
            new version. A change that would widen what we collect will be put
            to you in the app before it takes effect, not buried here.
          </LegalP>
          <LegalP>
            22 September 2026: added section 4 on how we protect your data,
            listed the sign-in scopes in section 2, and removed references to a
            local search index the app no longer builds. What Jarvis collects
            did not change.
          </LegalP>
        </LegalSection>

        <LegalSection id="contact" index={12} title="Contact">
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
