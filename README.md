<p align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/sud-s/workspace-task-manager/main/assets/logo-dark.svg">
    <img alt="Gize" src="https://raw.githubusercontent.com/sud-s/workspace-task-manager/main/assets/logo-light.svg" width="600">
  </picture>
  <br />
  <em>Multi-workspace task manager with real-time sync</em>
  <br /><br />
  <a href="https://gize-pi.vercel.app"><strong>Live Demo</strong></a>
  ·
  <a href="https://github.com/sud-s/workspace-task-manager/issues/new?labels=bug">Report Bug</a>
  ·
  <a href="https://github.com/sud-s/workspace-task-manager/issues/new?labels=enhancement">Feature Request</a>
</p>

<br />

<p align="center">
  <a href="https://github.com/sud-s/workspace-task-manager/actions/workflows/ci.yml"><img src="https://github.com/sud-s/workspace-task-manager/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://gize-pi.vercel.app"><img src="https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel" alt="Vercel"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/powered%20by-Supabase-3FCF8E?logo=supabase" alt="Supabase"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js%2016-000?logo=next.js" alt="Next.js"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>
</p>

---

<details>
<summary><b>Submission</b></summary>

| | |
|---|---|
| **Candidate** | Sud (sud-s) |
| **Start** | 2026-06-01 09:00 EAT |
| **End** | 2026-06-02 17:30 EAT |
| **Live URL** | [https://gize-pi.vercel.app](https://gize-pi.vercel.app) |
| **Repository** | [sud-s/workspace-task-manager](https://github.com/sud-s/workspace-task-manager) |
| **Stack** | Next.js 16 + Supabase (PostgreSQL, RLS, Realtime, Auth) |

### Architectural Decisions

- **TanStack Query** for all data fetching — cache invalidation, optimistic updates, deduplication
- **Zustand** for global state (current workspace ID)
- **Supabase Realtime** for live task sync — direct React Query cache updates on INSERT/UPDATE/DELETE
- **Edge Function** for overdue tasks — deployed to Supabase, uses `SUPABASE_SERVICE_ROLE_KEY` for assignee enrichment
- **RLS on all operations** — 4 policies per table, all via `is_workspace_member()`
- **Dark-first theme** — CSS variables compatible with shadcn/ui
- **Route allowlist** — `isPublicRoute()` in proxy rather than UUID-regex protected matches

### What's Missing

- Email notifications
- File attachments on tasks
- Webhook integrations

</details>

---

<details>
<summary><b>Quickstart</b></summary>

**Prerequisites:** Node.js 22+, a Supabase project

```bash
# Clone and install
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install

# Configure environment
cp .env.example .env.local
# Fill in your Supabase URL and keys

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

</details>

---

<details>
<summary><b>Features</b></summary>

<table>
<tr>
<td width="50%">

### Workspaces
- Isolated environments for teams or projects
- Quick switcher with create/delete
- Role-based access (owner / member)

### Projects
- Create projects within workspaces
- Visual progress tracking with task counts
- Real-time project cards

### Tasks
- Full CRUD with optimistic UI updates
- Status workflow: todo → in progress → done
- Assignee selection from workspace members
- Due dates with overdue detection
- Drag-and-drop Kanban board
- Calendar view with day-by-day breakdown

</td>
<td width="50%">

### Views
- **List** — traditional task list with filters
- **Board** — Kanban with drag-and-drop between columns
- **Calendar** — month grid with task dots, day detail

### Real-time Sync
- Powered by Supabase Realtime
- Changes propagate instantly across clients
- No manual refresh needed

### Auth & Access Control
- Email/password authentication
- RLS policies enforce data isolation at row level
- Route protection via proxy

### UI / UX
- Dark & light theme toggle with persistent preference
- Full theme-aware design — all components use semantic tokens, no hardcoded colors
- Responsive mobile layout with hamburger sidebar drawer and overlay backdrop
- Kanban board scrolls horizontally with snap points on mobile
- Calendar view with responsive grid and dot indicators
- Glass/emerald design with 3D card tilt effects
- Toast notifications for all mutations
- Loading skeletons and error boundaries

</td>
</tr>
</table>

</details>

<details>
<summary><b>Architecture</b></summary>

```
  Vercel (Frontend)                  Supabase (Backend)
  ┌──────────────────────┐          ┌──────────────────┐
  │  Next.js 16          │          │  PostgreSQL + RLS │
  │  App Router          │◄────────►│  Realtime         │
  │                      │  queries │  Auth             │
  │  TanStack Query      │          │  Edge Functions   │
  │  Zustand             │          └──────────────────┘
  │  Supabase SSR Auth   │
  └──────────────────────┘
```

</details>

<details>
<summary><b>Tech Stack</b></summary>

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui |
| State | [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs) |
| Database | [Supabase](https://supabase.com) PostgreSQL + RLS |
| Auth | [Supabase SSR Auth](https://supabase.com/docs/guides/auth) |
| Real-time | [Supabase Realtime](https://supabase.com/realtime) |
| Deployment | [Vercel](https://vercel.com) (frontend) |

</details>

<details>
<summary><b>Demo</b></summary>

Try the live app at **[https://gize-pi.vercel.app](https://gize-pi.vercel.app)**

| Email | Password |
|-------|----------|
| `demo@gize.app` | `Demo123!` |

Pre-seeded with workspaces, projects, and tasks.

</details>

<details>
<summary><b>Project Status</b></summary>

- [x] Auth (login, signup, password reset)
- [x] Multi-workspace with RLS
- [x] Project CRUD with progress tracking
- [x] Task CRUD with filters, assignee, due dates
- [x] Real-time sync (broadcast INSERT/UPDATE/DELETE)
- [x] Kanban board (drag-and-drop between columns)
- [x] Calendar view (month grid with task dots)
- [x] Dark / light theme toggle
- [x] Overdue task detection (Edge Function)
- [x] Member management (invite by email, remove)
- [x] Workspace settings (rename, delete)
- [x] Profile page & user dropdown
- [x] Route protection & auth proxy
- [x] Optimistic updates with rollback
- [x] Toast notifications, loading states, error boundaries
- [x] SEO (sitemap, robots, metadata)
- [x] CI pipeline (lint, type-check, build)

</details>

<details>
<summary><b>License</b></summary>

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

</details>

---

<p align="center">
  <sub>Built with Next.js, Supabase, and TypeScript</sub>
  <br />
  <sub>Gize &mdash; Time is everything.</sub>
</p>
