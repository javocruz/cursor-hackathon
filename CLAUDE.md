# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SOCRA** — a Socratic AI Tutoring Agent built for the Cursor Hackathon 2025 at IE University.

SOCRA is an agentic tutoring system powered by a curriculum dependency graph. It automatically extracts concepts and prerequisite relationships from uploaded course materials, guides students through Socratic questioning (never just giving the answer), and monitors all students in real time with teacher alerts. It is **not** a chat wrapper — it's a stateful tool-calling agent with persistent mastery modeling.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, `src/` directory) |
| Styling | Tailwind CSS v3 + shadcn/ui (classic pattern with `@radix-ui/react-slot`) |
| Graph Visualisation | React Flow |
| Auth | Supabase Auth (magic link, role-based: teacher/student) |
| Database | Supabase Postgres |
| File Storage | Supabase Storage |
| Backend / API | Next.js API Routes (Vercel serverless) |
| Chat Streaming | Vercel AI SDK (`ai` package) + `@ai-sdk/openai` |
| LLM Provider | OpenAI GPT-4o (swappable via `LLM_PROVIDER` env var — Claude-ready) |
| Deployment | Vercel (via GitHub Actions on push to `main`) |

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Auth route group: /login, /callback
│   ├── (teacher)/        # Teacher route group: /dashboard
│   ├── (student)/        # Student route group: /learn
│   ├── api/
│   │   ├── agent/        # POST /api/agent/chat, /quiz, /evaluate
│   │   ├── dashboard/    # GET /api/dashboard/teacher, /student
│   │   └── ingest/       # POST /api/ingest (document upload pipeline)
│   ├── layout.tsx        # Root layout (Geist fonts)
│   ├── page.tsx          # Landing page
│   └── globals.css       # Tailwind + shadcn CSS variables
├── components/ui/        # shadcn/ui components (button, card, badge)
├── lib/
│   ├── supabase/         # Supabase clients: client.ts (browser), server.ts (RSC), middleware.ts
│   ├── types.ts          # TypeScript types matching Supabase schema
│   └── utils.ts          # cn() helper
└── middleware.ts          # Supabase auth session refresh
supabase/
└── schema.sql             # Full database schema (run in Supabase SQL Editor)
.github/workflows/
└── deploy.yml             # GitHub Actions: lint → build → deploy to Vercel
```

## Architecture

### Agent Loop (not a chatbot)

Every student interaction triggers a tool-calling loop:
1. **Context Load** — fetch mastery profile, current concept node, session history, teacher mode
2. **Tool Selection** — agent decides which tools to call (get_weak_concepts, generate_quiz, evaluate_response, flag_student, etc.)
3. **Tool Execution** — Next.js API route executes against Supabase or LLM
4. **Streamed Response** — Vercel AI SDK streams tokens before post-response tools finish
5. **State Write** — mastery scores, session events, reasoning traces written back via `waitUntil()`

### Assignment Modes

Teachers set a mode per assignment; the agent adapts within it:
- **Explore** — generous hints, proactive explanations
- **Guided** — Socratic questioning, hints after struggle
- **Challenge** — withholds hints, probing follow-ups
- **Assess** — silent, records responses for clean mastery snapshot

### Data Model

See `supabase/schema.sql` for the full schema. Key tables: `users`, `courses`, `concepts`, `concept_edges`, `mastery_scores`, `sessions`, `session_events`, `teacher_alerts`, `assignments`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` — from Supabase dashboard
- `LLM_PROVIDER` — `openai` or `anthropic`
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for GitHub Actions deployment

## Conventions for Team Consistency

- **shadcn/ui components** use the classic pattern (Tailwind v3, `@radix-ui/react-slot`, `cva`, `cn()`). When adding new shadcn components, use `npx shadcn@latest add <component>` but verify the output is Tailwind v3 compatible — if it imports `@base-ui/react`, rewrite it to use the classic Radix Slot pattern.
- **Supabase client**: use `createClient()` from `@/lib/supabase/server` in Server Components and API routes; use `@/lib/supabase/client` in Client Components.
- **API routes**: all LLM calls and agent logic live in `src/app/api/` as Next.js Route Handlers. No separate backend server.
- **Types**: keep `src/lib/types.ts` in sync with `supabase/schema.sql`.
- **LLM provider**: abstracted behind `LLM_PROVIDER` env var. Do not hardcode provider-specific logic.
