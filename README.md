# Jarvis AI

> Working title — the name is not final.

Jarvis is an AI teammate that IT companies can "hire" — a digital coworker that
lives inside your company's tools and helps people get onboarded, get their
accesses, and get context, without waiting on an IT specialist.

He shows up where people already work: as a Slack user, as a real user account in
your systems, or connected through MCP so tools like Claude Code can talk to him.

## Why

Joining a company can take ~2 weeks just to get all your accesses, and you often
don't even know who to ask. Jarvis grants the access, knows the company's
processes, and carries the context of your work — so new hires are productive on
day one or two, and IT stops being the bottleneck.

## Status

Earliest stage. We're documenting the vision and building a **landing page to
validate the problem** before building the product.

## Documentation

The thinking behind the project lives in [`docs/`](./docs):

- [vision.md](./docs/vision.md) — what Jarvis is and the big picture
- [problem.md](./docs/problem.md) — the pain we're solving
- [features.md](./docs/features.md) — what Jarvis does
- [customers.md](./docs/customers.md) — who we sell to and why
- [landing-page.md](./docs/landing-page.md) — the validation plan
- [open-questions.md](./docs/open-questions.md) — what we still need to decide

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · deployed on
Vercel. Pushing to `main` triggers a production deploy.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
