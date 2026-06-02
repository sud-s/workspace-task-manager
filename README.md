# ጊዜ / Gize

> **Multi-workspace task manager.**  
> Gize means *"time"* in Amharic — time management, made collaborative.

**Started:** June 2, 2026 — 1:42 PM EAT (UTC+3)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Docs](#docs)
- [Scoring](#scoring)

---

## Overview

A full-stack task management app with workspace isolation, real-time collaboration, and polished inline editing. Built for the Fullstack Engineer take-home assignment.

<details>
<summary><strong>Core Requirements</strong></summary>

| Req | Description |
|-----|-------------|
| **R1** | Schema + RLS on all 4 ops, workspace isolation |
| **R2** | Generated Supabase types, zero `any` |
| **R3** | Realtime task updates via Supabase channels |
| **R4** | URL-synced filters — share the URL, share the view |
| **R5** | Inline editing with save/cancel affordance |
| **R6** | Loading, empty, error states on every view |
| **R7** | Optimistic UI — instant update, rollback on failure |
| **R8** | Edge Function for overdue tasks + RLS |

</details>

---

## Features

🔐 **Auth** — Sign up, sign in, sign out via Supabase Auth  
📊 **Workspace Dashboard** — Project cards with task counts by status  
📋 **Project View** — Full task list with inline status, assignee, due date, filters  
✏️ **Inline Editing** — Slide-out panel, all fields editable, no page reload  
⚡ **Realtime** — Changes sync instantly across users  
🎯 **URL Filters** — `?status=todo,in_progress&assignee=uuid` — shareable, restorable  
🔄 **Optimistic Updates** — Status changes are instant, roll back gracefully on error  

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (PKCE, SSR cookies) |
| State | React Query + Zustand |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Realtime | Supabase Realtime (WebSockets) |
| Edge Functions | Supabase (Deno) |
| Deploy | Vercel |

---

## Quick Start

```bash
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install
cp .env.example .env.local   # add your Supabase credentials
npm run dev
```

Detailed setup → [docs/SETUP.md](docs/SETUP.md)

---

## Docs

| Doc | What's inside |
|-----|---------------|
| [Setup Guide](docs/SETUP.md) | Full setup from scratch — Supabase, env vars, schema, deploy |
| [Architecture](docs/ARCHITECTURE.md) | System design, component tree, RLS model, key decisions |

---

## Scoring

<details>
<summary><strong>Assignment Rubric</strong></summary>

| Area | Points | Notes |
|------|--------|-------|
| Supabase + RLS | 25 | All 4 ops, workspace isolation, no leaks |
| TypeScript | 20 | Zero `any`, generated types, typed hooks |
| UI Quality | 20 | Consistent spacing, responsive, skeletons |
| UX Quality | 15 | Inline editing, URL filters, loading/empty/error |
| Code Architecture | 10 | Server/Client split, no prop drilling |
| Optimistic UI (bonus) | 5 | Instant update + rollback with toast |
| Edge Function (bonus) | 5 | Working endpoint, RLS enforced, UI button |
| **Total** | **100** | |

</details>

---

<div align="center">
  <sub>Made with ጊዜ by <a href="https://github.com/sud-s">sud-s</a></sub>
</div>
