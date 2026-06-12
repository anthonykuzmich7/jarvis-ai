# Open questions (Palina)

These are the things I'm genuinely unsure about. They'll shape the product and
the go-to-market, and we should try to answer them before building too much.

## Product questions

**How does Jarvis get the role context?**
Does the company configure this when they set up Jarvis? Does the new hire
select their role on day one? Or does Jarvis infer it from job title in the HR
system? The answer changes the setup experience and the integration complexity.

**What does the overlay actually look like technically?**
An Electron app? A browser extension? A native macOS/Windows widget? Each has
very different distribution friction and capability tradeoffs. The keyboard
shortcut and voice mechanics depend on this.

**How does voice activation work across apps?**
If Jarvis listens for a voice trigger while you're in Slack or a video call,
there are privacy and technical challenges. Do we need push-to-talk instead of
always-on listening?

**What's the right balance of gamification?**
Too little and it's just another corporate tool. Too much and it feels
condescending, especially for senior hires. Where's the line, and is it
adjustable per company?

**When does the mascot feel right vs. out of place?**
A mascot might work well for a consumer-friendly tech company and feel wrong in
a traditional enterprise. Do we offer customization, or do we pick a lane?

## Go-to-market questions

**Does the role-personalization angle resonate with HR buyers?**
HR thinks in cohorts, not individuals. They might not immediately see
"personalized per role" as their problem — they might frame it as "we already
have onboarding tracks per department." We need to understand how they think
about this before we lead with it.

**Is the living knowledge base a separate product or the same one?**
The post-onboarding value proposition (continuously updated company knowledge)
might appeal to a different buyer than the onboarding story. Could be a reason
to stay focused on onboarding only for V1 and expand later.

**How do companies keep Jarvis updated?**
The knowledge base is only as good as the content in it. Who adds roadmap
updates? Who flags when a process changes? Is this automatic, or does it require
someone to maintain it? If it requires maintenance, is that a job someone will
actually do?

**What's the right company size?**
Too small (< 20 people) and informal onboarding works fine. Too large (> 500
people) and there are established L&D teams with existing solutions. The sweet
spot is probably 50–300 people. Is that the right bet?

## Validation priorities

1. Does the role-personalization problem land with HR and managers as clearly as
   we think it does?
2. Would someone actually use a voice or keyboard-shortcut overlay for work
   questions, or does that feel too intrusive?
3. Is the living knowledge base a feature people want, or is it too much
   maintenance burden to be credible?
