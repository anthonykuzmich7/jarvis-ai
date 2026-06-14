# The problem

## The context you need to do your job doesn't exist in any usable form

When you join a company, the context you need isn't missing because it went
stale — it's missing because it was never assembled. It lives in people's heads,
in manual onboarding calls, and in scattered docs written for someone else. So
you spend your first weeks reconstructing it by hand: asking around, sitting in
calls, reading things that may or may not apply to you.

The root pain isn't "access takes too long" and it isn't "the checklist is
boring." It's that **the context — about the company, your team, and your own
work — is absent, scattered, and not personalized to you.**

## A document can't onboard you

Companies do have information — in Confluence, Notion, Slack history, Drive. The
problem isn't that it doesn't exist. It's that **information isn't onboarding.** A
document can tell you "set up your environment" or "here's how we work"; it can't
see your screen, can't answer the question that comes up two steps in, and can't
*do* anything for you.

Onboarding is someone sitting next to you saying "click here, no not that, yes —
done, next." That's what actually works, and it's exactly what nobody has time to
do for every new hire. So companies write it down instead, and writing it down
strips out the one thing that made it work: a person who can see where you are and
react. People — especially the early-adopter teams already living inside AI tools —
now expect interactivity: to ask, to get a specific answer, to have something act.

## Different roles need completely different first weeks

A developer and a marketer join the same company on the same day and need almost
nothing in common. Hand all of them the same generic onboarding pack and you fail
all of them — one is bored, the others are lost.

- A **developer** needs the environment (their specific stack), the deploy flow,
  how code review works here, who owns which service, and how the architecture
  actually fits together.
- A **marketer** needs the brand knowledge: which formats the team has run, which
  concepts actually worked, and who owns which format.
- A **designer** needs where the design system lives and when it was last updated,
  how design reviews work here, who the PM is, and which Figma files are live
  versus exploration.
- A **business / C-level** hire needs the company vision, the goals, the C-level
  plans, and the right stakeholders to talk to.

Generic onboarding asks all of them to self-sort. That's friction that compounds
across the first two weeks.

## The blockers that compound

Week one isn't slow because people aren't trying. It's slow because blockers pile
up and there's no one to route around them:

- **Access you don't have yet.** You find out you need a tool when you open it,
  not when you start. The request goes to someone who takes days to respond. And
  you don't even know who to ask — DevOps? a team lead? the platform team? Nobody
  tells you, so you guess.
- **Questions you don't know to ask.** You don't have the vocabulary yet, so you
  can't search Confluence effectively. You're searching for answers you can't name.
- **People who aren't available.** Your buddy is in another timezone, the person
  who owns the system you need is on vacation, and you wait — blocked on something
  small.
- **Information that exists but isn't yours.** It's in eight-month-old Slack
  threads, in a Confluence page last updated when the product looked different, in
  someone's head. Technically accessible; practically invisible.

Each of these is a half-day lost. Across the first two weeks, that's a real chunk
of the productivity the company already paid for by hiring you.

## Access is a symptom, not the disease

Getting your accesses is one of the things that goes wrong on day one, and because
we enter through onboarding it's an important use case. But it's a *symptom* of
the bigger problem: nobody has assembled the context of who owns what, who grants
what, and how things work here.

## The context that exists isn't safely separated

A side effect of "context lives everywhere and nowhere" is that there's no clean
separation of what each person should see. A new engineer can stumble onto
sensitive business numbers (marketing ROAS, for example); a new marketer can end
up where they shouldn't. Today there's no layer that gives each person exactly the
context they're entitled to and nothing more. We treat this as a design
requirement for the solution as much as a problem in the world — see
[open-questions.md](./open-questions.md).

## Who pays

The company pays for all of this — and the tool that fixes it should appear for
the new hire the moment they start.

- **New hires** lose their first one to two weeks to partial confusion instead of
  building.
- **Seniors and stakeholders** absorb the load: the same context, re-explained for
  every new person, in calls and 1:1s — plus the access provisioning toil.
- **The company** pays twice — once to hire someone, and again for the weeks of
  reduced output before they're contributing.

## The metrics this should move

- **Time-to-productivity** for the new hire (time-to-first-commit,
  time-to-first-deploy for engineers).
- **Senior / stakeholder time saved** on onboarding each person.
- **Daily usage after onboarding** — the signal that Jarvis stayed useful.
- **CSAT** — an indirect read on whether the agent genuinely drives the
  employee's work, not just their first week.
