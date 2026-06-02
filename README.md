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
  <a href="https://gize-backend.onrender.com"><img src="https://img.shields.io/badge/deployed%20on-Render-46E3B7?logo=render" alt="Render"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/powered%20by-Supabase-3FCF8E?logo=supabase" alt="Supabase"></a>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js%2016-000?logo=next.js" alt="Next.js"></a>
  <a href="https://typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff" alt="Tailwind CSS"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT"></a>
  <a href="https://github.com/sud-s/workspace-task-manager/blob/main/CONTRIBUTING.md"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

---

## Submission

| | |
|---|---|
| **Candidate** | Sud (sud-s) |
| **Start** | 2026-06-01 09:00 EAT |
| **End** | 2026-06-02 17:30 EAT |
| **Live URL** | [https://gize-pi.vercel.app](https://gize-pi.vercel.app) |
| **Repository** | [sud-s/workspace-task-manager](https://github.com/sud-s/workspace-task-manager) |
| **Stack** | Next.js 16 (App Router) + Supabase (PostgreSQL, RLS, Realtime, Auth) + Express backend (Render) |

### Architectural Decisions

- **TanStack Query** for all data fetching (not `useEffect`) — cache invalidation, optimistic updates, deduplication
- **Zustand** for global state (current workspace ID) — minimal boilerplate vs Redux/Context
- **Supabase Realtime** for live task sync — direct React Query cache updates on INSERT/UPDATE/DELETE (no refetch)
- **Edge Function over Express** for overdue tasks — deployed to Supabase, avoids Render roundtrip, uses `SUPABASE_SERVICE_ROLE_KEY` for assignee name enrichment
- **RLS on all operations** — 4 policies per table (SELECT/INSERT/UPDATE/DELETE), all via `is_workspace_member()`
- **Dark-first theme** — CSS variables compatible with shadcn/ui; no separate light mode
- **Route allowlist** — `isPublicRoute()` in middleware rather than UUID-regex protected matches; covers arbitrary paths

### Known Issues / What's Not Working

- No dark/light theme toggle (known issue)
- No drag-and-drop Kanban board (known issue)
- No calendar view (known issue)
- No email notifications (known issue)
- Supabase CLI unavailable on Windows (`win32-x64` binary missing) — Edge Function deployed via Management API (Python)
- Domain `gize.vercel.app` owned by another Vercel team — using `gize-pi.vercel.app`

---

<details>
<summary>Quickstart</summary>

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

To run the optional overdue-tasks backend:

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

</details>

---

<details>
<summary>Features</summary>

<table>
<tr>
<td width="50%">

### Workspaces
- Isolated environments for teams, clients, or personal projects
- Quick workspace switcher with create/delete
- Unlimited workspaces per account

### Projects
- Create projects within workspaces
- Visual progress tracking with task counts
- Real-time project cards with status breakdown

### Tasks
- Full CRUD with optimistic UI updates
- Status workflow (todo / in progress / done)
- Assignee selection from workspace members
- Due dates with overdue detection
- Inline status changes without page reload

</td>
<td width="50%">

### Real-time Sync
- Powered by Supabase Realtime
- Changes propagate instantly across clients
- No manual refresh needed

### Auth and Access Control
- Email/password authentication
- Role-based workspace access (owner, member)
- RLS policies enforce data isolation at row level
- Route protection via middleware

### Modern UI
- Dark glass/emerald theme with consistent design
- 3D card effects and subtle animations
- Responsive sidebar navigation layout
- Toast notifications for all mutations
- Loading skeletons and error boundaries

</td>
</tr>
</table>

</details>

<details>
<summary>Next Steps</summary>

### In Progress
- Dark/light theme toggle

### Planned
- Task detail view with activity log and comments
- Drag-and-drop task board (Kanban-style)
- Calendar view for tasks with due dates
- Email notifications for task assignments and overdue items
- File attachments on tasks
- Webhook integrations for external tools
- Mobile-responsive improvements for the task board
- Performance optimization with virtual scrolling for large task lists
- User notification preferences
- Workspace-level analytics dashboard

</details>

<details>
<summary>Architecture</summary>

```
  Vercel (Frontend)                     Supabase                    Render (Backend)
  ┌──────────────────────┐             ┌──────────────┐           ┌──────────────────┐
  │  Next.js 16          │             │  PostgreSQL   │           │  Express Server   │
  │  App Router          │◄───────────►│  + RLS        │           │                   │
  │                      │   queries   │  + Realtime   │           │  GET  /health     │
  │  TanStack Query      │             │  + Auth       │           │  POST /overdue    │
  │  Zustand             │             └──────────────┘           └──────────────────┘
  │  Supabase SSR Auth   │
  └──────────────────────┘
```

</details>

<details>
<summary>Tech Stack</summary>

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui |
| State Management | [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + RLS) |
| Authentication | [Supabase SSR Auth](https://supabase.com/docs/guides/auth) |
| Real-time | [Supabase Realtime](https://supabase.com/realtime) |
| Backend API | [Express](https://expressjs.com) on [Render](https://render.com) |
| Deployment | [Vercel](https://vercel.com) (frontend) + [Render](https://render.com) (backend) |

</details>

<details>
<summary>Demo</summary>

Try the live app at **[https://gize-pi.vercel.app](https://gize-pi.vercel.app)**

| Email | Password |
|-------|----------|
| `demo@gize.app` | `Demo123!` |

The demo account includes pre-seeded workspaces, projects, and tasks so you can explore all features immediately.

</details>

<details>
<summary>Project Status</summary>

- [x] Authentication (email/password, password reset)
- [x] Multi-workspace architecture with RLS
- [x] Project CRUD with progress tracking
- [x] Task CRUD with filters, status, assignee, due dates
- [x] Real-time task sync via Supabase Realtime
- [x] Overdue task detection (backend service)
- [x] Workspace member management (invite/remove)
- [x] Workspace settings (rename/delete)
- [x] Route protection and auth middleware
- [x] Toast notifications for all mutations
- [x] Error boundaries and loading states
- [x] User profile page with account settings
- [x] Profile dropdown in navigation
- [x] SEO (sitemap, robots, metadata, favicon)
- [x] Responsive landing page with dark theme
- [x] CI pipeline (lint, type-check, build)
- [x] Dockerized backend on Render

</details>


<details>
<summary>License</summary>

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

</details>

---

<p align="center">
  <sub>Built with Next.js, Supabase, and TypeScript</sub>
  <br />
  <sub>Gize &mdash; Time is everything.</sub>
</p>
