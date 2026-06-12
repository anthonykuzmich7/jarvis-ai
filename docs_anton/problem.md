# The problem (Anton)

## You join, and you're handed a hundred steps

The day you start a job, someone sends you a document. It's long. It has a
hundred small steps: register on this, create an account there, install these,
message that person, change your avatar in Slack, set up time tracking, learn
how to request a day off, find the repo, get on the right channels.

None of it is hard. All of it is unclear. A document can *tell* you to "set up
your profile" — it can't show you where, can't tell you when you've done it
right, and can't answer the question that comes up two steps in. So you do it
slowly, half-wrong, and alone.

## A doc can't onboard you. A person could — but nobody has time

The reason onboarding is painful isn't that the information is missing. It's that
information isn't onboarding. Onboarding is someone sitting next to you saying
"click here, no not that, yes — done, next." That's what actually works, and it's
exactly what nobody has time to do for every new hire.

So companies write it down instead, and writing it down strips out the one thing
that made it work: a person who can see your screen and react to where you
actually are.

## The first week is the loneliest, most confused week of the job

When you walk into a new company, you don't understand how anything works. As a
developer you want to know how merges happen, how deploys work, who to ask about
what. As anyone, you want to know the unwritten stuff — where things live, who
owns what, how the team actually operates day to day.

And here's the part that hurts: you don't even know *who to ask*. In your first
week you end up messaging a bunch of people — "hey, where does X happen?" — and
not all of them know, and some of them are on vacation, and you feel like you're
bothering everyone. You're piecing the company together from scattered DMs, and
you feel slow and annoying the whole time.

## The specific things that go wrong

- **Setup you can't picture.** "Create your profile and configure time tracking"
  means nothing until you're on the screen. You guess, you misconfigure, you
  redo it.
- **Process you can't see.** How does a deploy work here? How does code review
  go? What's the flow for requesting time off? It exists in someone's head and
  maybe a stale wiki page.
- **Ownership you can't find.** Who owns this feature? Who do I ask about that
  service? There's no map, so you ask around and hope.
- **People who aren't there.** The one person who knows is on vacation, in
  another timezone, or just slow. You wait, blocked, on something small.

Each one is a half-day of quiet confusion. Across the first two weeks, that's a
real chunk of the productivity the company already paid for by hiring you.

## Why this matters more for some roles

A developer's first day and a founder's first day at the same company have
almost nothing in common. A dev needs the repo, the environment, the deploy
flow, the review conventions, who owns which service. A non-technical hire needs
the tools, the people, the rituals, the where-do-I-click basics. Hand both of
them the same hundred-step doc and you've failed both — one is bored, the other
is lost.

## The honest scope of what we're fixing

The original instinct was to solve *access* — automatically grant the tools and
permissions a new hire needs. That's a real pain, but it's not the pain people
feel most. People feel: "I'm alone with a list, I don't know how this works, and
I don't know who to ask." That's the problem this product attacks first.
Automated access can come later; it's not what makes day one miserable.

## Who pays

- **New hires** spend their first week guessing, redoing setup, and DMing
  strangers — instead of doing the job they were hired for.
- **Teammates and managers** absorb the interruptions: the same setup questions
  and "who owns X" pings, for every new person, forever.
- **The company** pays twice — once to hire someone, and again for the week or
  two of confusion before they're actually contributing.
