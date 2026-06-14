# Features

Jarvis is a context engine wrapped in an agent. The features below either
**build context** (collect it, structure it, keep it current), **act on it** (do
real things on your behalf), or **deliver it** (the interface you actually touch).
Onboarding is the first surface; daily work is where it sticks.

## 1. The interface: minimalist overlay + Slackbot + a desktop app with value

The way you talk to Jarvis has to be as frictionless as Wispr Flow.

- **Overlay.** One keystroke summons a minimalist, voice-first overlay on top of
  whatever app you're in. Talking to him is faster than searching or DMing — and
  the moment it's slower than guessing, people stop using it, so speed is the
  product.
- **Slackbot.** A bot you can message directly inside Slack, where work already
  happens.
- **Desktop app — not just a log.** It stores your conversation history *and* adds
  standalone value: your important action points, your personal analytics, and
  your tasks (open vs. closed). A place worth opening on its own.

The visual base is **clean minimalism with a light, warm character** — a small
friendly avatar and a human tone, not a full mascot. Present when it's guiding
you, out of the way when it's not.

## 2. Multi-level context — collected and structured

This is the core. Jarvis collects context and forms it into clean, separated
layers.

- **Sources:** Docs (Confluence / Notion), Slack, Calendar + org chart, Jira, plus
  presence on **team calls** (weekly strategy, engineering dailies). One-on-ones
  are opt-in, with Jarvis proactively offering to join.
- **Layers:** **Company** (vision, goals, direction — from founders / C-level),
  **Team** (priorities, who owns which direction), **Personal** (the employee's own
  accumulating work context).
- **Personalized and isolated.** A person's team context is shaped by the Slack
  channels they're in and the calls they attend — and sensitive context stays
  isolated across teams (an engineer doesn't see marketing ROAS, and vice versa).

## 3. Role-aware onboarding — a different first day for each role

Jarvis is role-agnostic by design and role-adapted by prompt: a developer, a
marketer, a designer, and a C-level hire each get a completely different first day
from the same agent. The information often already exists in the company — the
filtering and sequencing is the product.

- **Developer, day one:** environment setup specific to this stack, the deploy
  pipeline and who owns it, code review and PR conventions, which services you'll
  touch, how the architecture fits together.
- **Marketer, day one:** the brand knowledge — formats the team has run, concepts
  that actually worked, who owns which format — and the current campaigns.
- **Designer, day one:** design system location and last update, what's live vs.
  exploration in Figma, how design reviews work, who the PM is and what's in the
  sprint.
- **Business / C-level, day one:** company vision, current OKRs and the reasoning,
  pending decisions that need new-hire context, and the right stakeholders to meet.

An MVP could narrow to a single role to start, but the vision is: any member of
any team.

## 4. The signature onboarding moment: a guide on your screen

During setup Jarvis sees your screen and **points** — highlighting exactly where
to go on the real interface, step by step, reacting to where you actually are
rather than running a fixed script.

- **He highlights and indicates** where to click ("Install Chrome — here," "this
  is where you track your hours," "create your profile"). In the first version he
  **does not drive your cursor for you** — driving is a deliberate later evolution
  once trust and the technical/privacy model are proven.
- **He walks the real boring-but-mandatory steps** with you instead of leaving you
  to read them alone.

The mental model is a person next to you saying "click here, yes, now this" —
except it scales to every new hire and never runs out of patience.

## 5. Agentic actions — he does it, not just describes it

Jarvis performs real actions, especially during onboarding. The signature example:

> A new hire needs engineering-tool access. Jarvis creates a Slack chat with the
> new hire and the two people who own that access, writes the intro himself —
> "meet these two, here's what we need" — sees a slot all three have free, and
> proposes the call.

Opening chats, drafting intros, finding calendar slots, scheduling stakeholder
calls, introducing you to your teammates ("want me to draft the hello?") — Jarvis
behaves like an operator, not a search box.

## 6. Self-serve access — route and set up now, grant later

- **MVP:** Jarvis helps you understand who owns an access and how to get it, and
  *agentically* sets it up — creating the chat, looping in the owner, booking the
  call. He routes; he does not grant.
- **Post-MVP:** Jarvis grants access himself. This is a heavier, security-sensitive
  integration (identity and permission systems — Okta, Google Workspace, GitHub,
  cloud IAM) that needs a real technical and security review before we commit. See
  [open-questions.md](./open-questions.md).

## 7. Phased proactivity — loud at first, then surgical

Proactivity is tuned to where the person is, so Jarvis helps actively without
becoming Clippy.

- **During onboarding (≈ first two weeks):** maximally proactive. Guides you in,
  connects you to the right people, books your stakeholder calls, gets your
  accesses moving — while explaining the capabilities you'll lean on later.
- **After onboarding:** proactivity is deliberately pruned to a few pointed
  triggers — action points after calls, a short morning sync on the day's plan —
  so he never becomes an always-pinging presence.

## 8. Personal context layer — the daily-usage driver

Jarvis carries *your* context, not just the company's, and it accumulates as you
work. Crucially, you can **plug that context into your own AI tools** (for example
Claude Code over MCP) so they already know what you're working on. Today you hunt
through Slack, docs, and past meetings to gather context and paste it into a chat;
Jarvis already has it. This is the layer that turns Jarvis from an onboarding tool
into something you use every day.

## 9. No hallucinations — honest routing by design

Trust is preventive, not patched. Jarvis does not invent. When the information
isn't there, he doesn't guess — he says so and connects you with the responsible
person, with the reason ("this person likely knows, they opened a ticket about
exactly this"). A confident wrong answer is worse than "let me find out from the
person who knows."

---

## Integration roadmap

**MVP (exact scope to be decided with the team):**
- The interface: minimalist voice-first overlay + Slackbot + desktop app
- Core context sources: Docs (Confluence / Notion) + Slack + Calendar + org chart,
  plus presence on team calls
- Role-aware onboarding (start with one or two roles, e.g. developer + one other)
- Screen-guided setup: highlight / point (not drive)
- Agentic onboarding actions (chats, intros, scheduling)
- Access: route and set up (not yet auto-grant)

**Near-term:**
- Jira / Linear and wider source coverage for richer team context
- Personal-context layer exposed to the user's AI tools (MCP / Claude Code)
- First version of post-onboarding proactive triggers
- Better "who probably knows this" routing from ticket / message history
- Eventually: screen-guided **driving** (not just pointing) and automated access
  provisioning, once trust and the security model are sound
