# ጊዜ / Gize

**Multi-workspace task manager.**  
Gize means *"time"* in Amharic.

Started: _June 2, 2026 — 1:42 PM EAT (UTC+3)_

---

`table of contents`

[overview](#overview) · [features](#features) · [stack](#stack) · [start](#quick-start) · [docs](#docs) · [scoring](#scoring)

---

## overview

Full-stack task management app with workspace isolation, real-time collaboration, and inline editing. Built for the Fullstack Engineer take-home assignment.

<details>
<summary><strong>requirements</strong></summary>

- **R1** — Schema + RLS on all 4 ops, workspace isolation
- **R2** — Generated Supabase types, zero `any`
- **R3** — Realtime task updates via Supabase channels
- **R4** — URL-synced filters — share the URL, share the view
- **R5** — Inline editing with save/cancel affordance
- **R6** — Loading, empty, error states on every view
- **R7** — Optimistic UI — instant update, rollback on failure
- **R8** — Edge Function for overdue tasks + RLS

</details>

---

## features

`~` Auth — Sign up, sign in, sign out via Supabase Auth  
`~` Dashboard — Project cards with task counts by status  
`~` Project View — Task list with inline status, assignee, due date, filters  
`~` Inline Editing — Slide-out panel, all fields editable, no page reload  
`~` Realtime — Changes sync instantly across users  
`~` URL Filters — Shareable query params restore exact filter state  
`~` Optimistic Updates — Instant UI, graceful rollback on error  

---

## stack

```
framework     Next.js 16 (App Router)
language      TypeScript (strict)
database      Supabase (PostgreSQL + RLS)
auth          Supabase Auth (PKCE, SSR cookies)
state         React Query + Zustand
styling       Tailwind CSS v4 + shadcn/ui
realtime      Supabase Realtime (WebSockets)
edge          Supabase Edge Functions (Deno)
deploy        Vercel
```

---

## quick start

```bash
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install
cp .env.example .env.local   # add your Supabase credentials
npm run dev
```

Setup guide → [docs/SETUP.md](docs/SETUP.md)

---

## docs

`~` [Setup Guide](docs/SETUP.md) — Full setup: Supabase, env vars, schema, deploy  
`~` [Architecture](docs/ARCHITECTURE.md) — System design, RLS model, key decisions  

---

## scoring

<details>
<summary><strong>assignment rubric</strong></summary>

```
area                    points    status
─────────────────────────────────────────
Supabase + RLS            25      passed
TypeScript                20      passed
UI Quality                20      passed
UX Quality                15      passed
Code Architecture         10      passed
Optimistic UI (bonus)      5      passed
Edge Function (bonus)      5      passed
─────────────────────────────────────────
total                     100
```

</details>

---

<div align="center"><sub>made with ጊዜ by sud-s</sub></div>
