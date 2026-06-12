# Open questions (Anton)

These are the things I'm genuinely unsure about. They shape both the product and
how we'd sell it, and we should try to answer them before building too much.

## Product questions

**How does the screen-aware, cursor-driving onboarding actually get built?**
This is the core and the hardest part. Reading the screen, knowing what's on it,
moving a second cursor, optionally clicking — across arbitrary apps (Chrome, a
desktop tool, an IDE). Native macOS/Windows app? Accessibility APIs? Screen
capture + vision model? This decision gates everything and I don't know the
answer yet.

**How much does Jarvis *drive* vs. *point*?**
There's a spectrum from "he highlights where to click" to "he takes the cursor
and does it for you." Driving is more magical and more terrifying (and riskier
to get wrong). Where's the right default, and should it be adjustable?

**What does "actively helpful but not annoying" actually look like?**
This is the one I most want to nail and have the least clarity on. Jarvis should
intervene on his own — notice you're stuck, catch a setup step about to go wrong,
surface the thing before you ask — without turning into Clippy. What are the
actual triggers? How often is too often? Does he act, or just offer? Is it tuned
per person, or learned over time? Getting this line right is the signature
problem of the whole product; getting it wrong makes him something people mute.

**How does voice work across apps, and how intrusive is it?**
The plan is fast voice like Wispr Flow as the main way to talk to him. Push-to-
talk, a hotword, or grab-the-character-then-speak? Always listening is powerful
but creepy and technically messy (and awkward when you're already on a call).
What's the trigger that feels instant but not invasive?

**Where does the character live, exactly?**
Top, side, a Dynamic-Island-style spot? Always visible or summoned? The "always
present companion" feeling is central to the vision, but always-on can also be
annoying. Need to find the line where it's a friend, not a Clippy.

**How gamified is too gamified?**
A character is the whole emotional hook, but a work tool that feels like a toy
can read as unserious — especially to senior hires and to the founder buying it.
How playful can the character be before it undercuts trust?

**Where does the onboarding script come from?**
Does the company author the day-one steps for each role? Does Jarvis infer them?
A hybrid (company gives the rough list, Jarvis runs it hands-on)? The setup
burden on the company is a make-or-break for adoption.

**How does it know your role?**
Company config? New hire picks on first launch? Pulled from the HR system / offer
letter? This changes the install flow and how "automatic" day one can feel.

## Scope questions

**When do we add automated access — if ever?**
We're deliberately starting with "explain and route," not "grant." That's the
right call for v1. But the original access idea is real value. When does it come
back in, and does adding it strengthen the buddy or turn us back into plumbing?

**Is stage two (context chat) a different product than stage one?**
The hands-on onboarding and the company-context teammate are emotionally one
thing, but technically very different builds. Do we ship stage one alone first
and earn the right to stage two, or is the two-stage arc the whole pitch?

## Privacy / trust questions

**Will people accept a tool that watches their screen?**
The whole mechanic depends on screen awareness. New hires might love it on day
one; they might hate it on day thirty. Is it strictly onboarding-scoped, or
always available? How do we make "it sees my screen" feel safe, not surveilled?

**Meetings: consent, privacy, and trust.**
Jarvis sitting in on calls and keeping transcripts is one of the strongest
features and one of the biggest trust risks. Who consents — just the user, or
everyone on the call? Is there a visible "Jarvis is here" indicator? What's
retained, for how long, and who can later query it? Done right it's a moat; done
wrong it's the thing that gets us banned from the company.

## Go-to-market questions

**Who's the real first buyer — founder or HR?**
Founders feel the pain personally and move fast, but pay less and churn. HR has
budget and owns onboarding but thinks in cohorts, not in "a buddy on your
screen." Which door do we knock on first?

**What's the right company size?**
Too small and the founder just does it themselves. Too large and there's an L&D
team with existing tools. The 30–300 band feels right — is it?

## Validation priorities

1. Does the hands-on "buddy drives your cursor through setup" mechanic make
   people lean in or recoil? This is the whole bet — test it first.
2. Is a screen-watching companion something people will actually keep installed,
   or does it feel intrusive once the novelty fades?
3. Founder vs. HR vs. eng manager — who says "I'd pay for this" fastest?
