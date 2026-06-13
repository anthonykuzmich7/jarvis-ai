# Features (Nastassia)

Jarvis is a context engine wrapped in an agent. The features below either
**build context** (collect it, structure it, keep it current), **act on it**
(do real things on your behalf), or **deliver it** (the interface you actually
touch). Onboarding is the first surface; daily work is where it sticks.

## 1. The interface: minimalist overlay + Slackbot + a desktop app with value

The way you talk to Jarvis has to be as frictionless as Wispr Flow.

- **Overlay.** One keystroke summons a minimalist overlay on top of whatever app
  you're in. Voice-first — talking to him is faster than searching or DMing.
- **Slackbot.** A bot you can message directly inside Slack, where work already
  happens.
- **Desktop app — not just a log.** It stores your conversation history *and*
  adds standalone value: your important action points, your personal analytics,
  and your tasks (open vs. closed). A place worth opening on its own.

## 2. Multi-level context — collected and structured

This is the core. Jarvis collects context and forms it into clean, separated
layers.

- **Sources:** Docs, Slack, Jira, plus presence on **team calls** (weekly
  strategy, engineering dailies). One-on-ones are opt-in, with Jarvis
  proactively offering to join.
- **Layers:** **Company** (vision, goals, direction — from founders / C-level),
  **Team** (priorities, who owns which direction), **Personal** (the employee's
  own accumulating work context).
- **Personalized and isolated.** A person's team context is shaped by the Slack
  channels they're in and the calls they attend — and sensitive context stays
  isolated across teams (an engineer doesn't see marketing ROAS, and vice versa).

## 3. Agentic actions — he does it, not just describes it

Jarvis performs real actions, especially during onboarding. The signature
example:

> A new hire needs engineering-tool access. Jarvis creates a Slack chat with the
> new hire and the two people who own that access, writes the intro himself —
> "meet these two, here's what we need" — sees a slot all three have free, and
> proposes the call.

Opening chats, drafting intros, finding calendar slots, scheduling stakeholder
calls — Jarvis behaves like an operator, not a search box.

## 4. Phased proactivity — loud at first, then surgical

Proactivity is tuned to where the person is.

- **During onboarding (≈ first two weeks):** maximally proactive. Guides you in,
  connects you to the right people, books your stakeholder calls, gets your
  accesses moving — while explaining the capabilities you'll lean on later.
- **After onboarding:** proactivity is deliberately pruned to a few pointed
  triggers — action points after calls, a short morning sync on the day's plan —
  so he never becomes an annoying, always-pinging presence.

## 5. Personal context layer — the daily-usage driver

Jarvis carries *your* context, not just the company's, and it accumulates as you
work. Crucially, you can **plug that context into your own AI tools** (for
example Claude Code over MCP) so they already know what you're working on. This
is the layer that turns Jarvis from an onboarding tool into something you use
every day.

## 6. Self-serve access — route now, grant later

- **MVP:** Jarvis helps you understand who owns an access and how to get it, and
  *agentically* sets it up — creating the chat, looping in the owner, booking the
  call.
- **Post-MVP:** Jarvis grants access himself. This is a heavier, security-
  sensitive integration that needs a real technical and security review before we
  commit (see [open-questions.md](./open-questions.md)).

## 7. No hallucinations — honest routing by design

Trust is preventive, not patched. Jarvis does not invent. When the information
isn't there, he doesn't guess — he connects with the responsible person and asks
the question on your behalf. A confident wrong answer is worse than "let me find
out from the person who knows."

## 8. Role-agnostic by design, role-adapted by prompt

Jarvis isn't built for one role. He targets **any newcomer** to the company and
adapts to the role internally (via prompting) — a developer, a marketer, a
C-level hire each get a different first day from the same agent. An MVP could
narrow to a single role to start, but the vision is: any member of any team.

---

## Integration roadmap

**MVP (exact scope to be decided with the team):**
- The interface: minimalist overlay (voice-first) + Slackbot + desktop app
- Core context sources: Docs / Slack + calendar + presence on team calls
- Agentic onboarding actions (chats, intros, scheduling)
- Access: route and set up (not yet auto-grant)

**Near-term:**
- Jira / Linear and wider source coverage for richer team context
- Personal-context layer exposed to the user's AI tools (MCP / Claude Code)
- First version of post-onboarding proactive triggers
- Eventually: automated access provisioning, once the security model is sound
