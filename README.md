<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/sud-s/workspace-task-manager/main/assets/logo-dark.svg">
    <img alt="Gize" src="https://raw.githubusercontent.com/sud-s/workspace-task-manager/main/assets/logo-light.svg" width="600">
  </picture>
  <br />
  <h3 align="center">Multi-workspace task manager with real-time sync</h3>
  <p align="center">
    Organize projects across workspaces, track tasks in real-time, and keep your team aligned.
  </p>
  <p align="center">
    <a href="https://gize-pi.vercel.app"><strong>Live Demo →</strong></a>
    ·
    <a href="https://github.com/sud-s/workspace-task-manager/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/sud-s/workspace-task-manager/issues/new?labels=enhancement">Feature Request</a>
  </p>
  <br />

[![CI](https://github.com/sud-s/workspace-task-manager/actions/workflows/ci.yml/badge.svg)](https://github.com/sud-s/workspace-task-manager/actions/workflows/ci.yml)
[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000?logo=vercel)](https://gize-pi.vercel.app)
[![Render](https://img.shields.io/badge/deployed%20on-Render-46E3B7?logo=render)](https://gize-backend.onrender.com)
[![Supabase](https://img.shields.io/badge/powered%20by-Supabase-3FCF8E?logo=supabase)](https://supabase.com)
[![Next.js](https://img.shields.io/badge/Next.js%2016-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/sud-s/workspace-task-manager/blob/main/CONTRIBUTING.md)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📋 Workspaces
- Isolated environments for teams, clients, or personal projects
- Quick workspace switcher
- Create unlimited workspaces

### 🗂️ Projects
- Create projects within workspaces
- Visual progress tracking with task counts
- Real-time project cards

### ✅ Tasks
- Full CRUD with optimistic updates
- Status tracking (todo → in_progress → done)
- Assignee selection from workspace members
- Due dates with overdue detection
- Inline status changes

</td>
<td width="50%">

### 🔄 Real-time Sync
- Powered by Supabase Realtime
- Changes propagate instantly across clients
- No manual refresh needed

### 🔐 Auth & Access Control
- Email/password authentication
- Role-based workspace access (owner/member)
- RLS policies enforce data isolation
- Route protection via middleware

### 🎨 Modern UI
- Dark glass/emerald theme
- 3D card effects and animations
- Responsive sidebar layout
- Toast notifications
- Loading skeletons & error boundaries

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  Vercel (Frontend)               │
│  ┌───────────────────────────────────────────┐  │
│  │   Next.js 16 (App Router)                 │  │
│  │   ├── Landing page       (/)              │  │
│  │   ├── Auth pages       (/login, /signup)  │  │
│  │   ├── Dashboard       (/{workspaceId})    │  │
│  │   ├── Project view    (/{ws}/projects/*)  │  │
│  │   ├── Members         (/{ws}/members)     │  │
│  │   └── Settings        (/{ws}/settings)    │  │
│  │                                            │  │
│  │   ◈ TanStack Query (caching & mutations)   │  │
│  │   ◈ Zustand (global state)                 │  │
│  │   ◈ Supabase SSR Auth                      │  │
│  └───────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────┐     ┌─────────────────────────┐
│   Supabase       │     │   Render (Backend)       │
│   ┌───────────┐  │     │   ┌─────────────────┐    │
│   │ PostgreSQL│  │     │   │ Express Server   │    │
│   │ + RLS     │  │     │   │ ├ GET  /health   │    │
│   │ + Realtime│  │     │   │ └ POST /overdue  │    │
│   │ + Auth    │  │     │   └─────────────────┘    │
│   └───────────┘  │     └─────────────────────────┘
└─────────────────┘
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript](https://typescriptlang.org) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) + shadcn/ui |
| **State** | [TanStack Query](https://tanstack.com/query) + [Zustand](https://zustand-demo.pmnd.rs) |
| **Database** | [Supabase](https://supabase.com) (PostgreSQL + RLS) |
| **Auth** | [Supabase SSR Auth](https://supabase.com/docs/guides/auth) |
| **Realtime** | [Supabase Realtime](https://supabase.com/realtime) |
| **Backend** | [Express](https://expressjs.com) on [Render](https://render.com) |
| **Deploy** | [Vercel](https://vercel.com) (frontend) + [Render](https://render.com) (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+
- A Supabase project (or use the demo credentials below)

### 1. Clone & install
```bash
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install
```

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the database migrations
Apply the schema and RLS policies from `supabase/seed.sql` to your Supabase project.

### 4. Start developing
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run the backend (optional)
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

---

## 🔍 Demo

You can try the live app at **[https://gize-pi.vercel.app](https://gize-pi.vercel.app)** with these credentials:

| Email | Password |
|-------|----------|
| `demo@gize.app` | `Demo123!` |

The demo account has pre-seeded workspaces, projects, and tasks so you can explore all features immediately.

---

## 📊 Project Status

- [x] Authentication (email/password, password reset)
- [x] Multi-workspace architecture with RLS
- [x] Project CRUD with progress tracking
- [x] Task CRUD with filters, status, assignee, due dates
- [x] Real-time task sync via Supabase Realtime
- [x] Overdue task detection (backend service)
- [x] Workspace member management (invite/remove)
- [x] Workspace settings (rename/delete)
- [x] Route protection & auth middleware
- [x] Toast notifications for all mutations
- [x] Error boundaries & loading states
- [x] SEO (sitemap, robots, metadata, favicon)
- [x] Responsive landing page with dark theme
- [x] CI pipeline (lint, type-check, build)
- [x] Dockerized backend on Render

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Supabase, and TypeScript</sub>
  <br />
  <sub>Gize — <em>Time is everything.</em></sub>
</div>
