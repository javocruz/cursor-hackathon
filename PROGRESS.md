# SOCRA — Progress & Checklist

## Prerequisites

### Required Software
- **Node.js** >= 18 (recommended: 20 LTS)
- **npm** (comes with Node.js)
- **Git**

### Setup Steps (for new teammates)

```bash
# 1. Clone the repo
git clone <REPO_URL>
cd Alt-F4-cursor-hackathon

# 2. Install dependencies
npm install

# 3. Create your local env file
cp .env.example .env.local
# Then fill in your Supabase and OpenAI keys (see below)

# 4. Run the dev server
npm run dev
# Open http://localhost:3000
```

### Environment Variables You Need

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API |
| `LLM_PROVIDER` | Set to `openai` (or `anthropic`) |
| `OPENAI_API_KEY` | OpenAI dashboard → API Keys |
| `VERCEL_TOKEN` | Vercel dashboard → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel dashboard → Settings → General |
| `VERCEL_PROJECT_ID` | Vercel project → Settings → General |

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Paste and run the contents of `supabase/schema.sql`
4. Copy the URL and anon key into `.env.local`

### GitHub Actions (Vercel Deployment)

Add these as GitHub repository secrets (Settings → Secrets → Actions):
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Pushes to `main` will auto-deploy to production. PRs get preview deployments.

---

## What's Been Done

- [x] **Next.js 14 scaffolding** — App Router, TypeScript, Tailwind CSS v3, `src/` directory
- [x] **shadcn/ui** — initialized with classic pattern (Radix Slot, cva), button/card/badge components
- [x] **Supabase client setup** — browser client, server client, middleware for session refresh
- [x] **Auth middleware** — `src/middleware.ts` refreshes Supabase auth on every request
- [x] **Landing page** — hero section with feature cards at `/`
- [x] **Route structure** — auth (`/login`, `/callback`), teacher (`/dashboard`), student (`/learn`)
- [x] **API route stubs** — all 6 endpoints from the Project Bible with TODO comments
- [x] **Database schema** — `supabase/schema.sql` with all 11 tables, RLS enabled
- [x] **TypeScript types** — `src/lib/types.ts` matching the schema
- [x] **GitHub Actions** — `.github/workflows/deploy.yml` for auto-deploy on push to main
- [x] **Environment config** — `.env.example` with all required variables documented
- [x] **CLAUDE.md** — comprehensive guidance for Claude Code / AI-assisted development
- [x] **Build verified** — `npm run build` passes cleanly

---

## What's Next (Build Plan from Project Bible)

### CORE — Must Ship

- [ ] **Supabase schema seeding** — demo data (sample teacher, students, course, concepts)
- [ ] **Auth flow** — magic link login, role detection (teacher vs student), redirect to correct dashboard
- [ ] **Teacher upload** — drag-and-drop document upload → async ingest pipeline → concept graph written to Supabase
- [ ] **Concept graph** — React Flow visualisation on teacher dashboard (nodes = concepts, edges = prerequisites)
- [ ] **Student chat** — streaming agent chat with full tool-calling loop (Vercel AI SDK `useChat()`)
- [ ] **Generate quiz** — student triggers → agent targets weak concepts → inline answer UI → mastery update
- [ ] **Teacher alert feed** — real-time agent-generated flags with student + concept context
- [ ] **Student concept map** — visual mastery state per concept, locked/unlocked logic

### EXTENSION — If Time Allows

- [ ] Teacher can click an alert and message the student directly
- [ ] Session summary page with full reasoning trace
- [ ] Mastery timeline chart (student progress over time)
- [ ] Auto-generated remedial micro-lesson when a student is flagged
- [ ] Teacher can manually edit concept graph edges before publishing

---

## Useful Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build (run before pushing to verify)
npm run lint     # ESLint check
```
