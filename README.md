<div align="center">
  <h1>ጊዜ <span style="font-weight:300">/</span> Gize</h1>
  <p><strong>Multi-Workspace Task Manager</strong></p>
  <p>
    <em>Gize means "time" in Amharic — time management, made collaborative.</em>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=fff" alt="Next.js 16">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript">
    <img src="https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=fff" alt="Supabase">
    <img src="https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff" alt="Vercel">
    <img src="https://img.shields.io/badge/ESLint-4B32C3?logo=eslint&logoColor=fff" alt="ESLint">
  </p>

  <p>
    <a href="#-overview">Overview</a> •
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-architecture">Architecture</a>
  </p>
</div>

---

## 📋 Overview

**Gize** is a full-stack task management application built for the Fullstack Engineer take-home assignment. It supports **multi-workspace collaboration** with real-time updates, granular Row-Level Security, and a polished inline-editing experience.

### ✨ What Makes It Different

| | |
|---|---|
| **Workspace Isolation** | Every query respects RLS — no cross-workspace leaks |
| **Real-Time Collaboration** | Changes sync instantly via Supabase Realtime channels |
| **Optimistic UI** | Status updates feel instant; rollback with feedback on failure |
| **URL-Persisted Filters** | Share a URL → someone else sees the exact same filtered view |
| **Slide-Out Editing** | Edit any task field without leaving the list or reloading the page |

---

## 🚀 Features

### Screens

```
┌─────────────────┐  ┌──────────────────┐  ┌───────────────────┐
│  Auth           │  │  Workspace       │  │  Project View     │
│  ┌───────────┐  │  │  Dashboard       │  │                   │
│  │ Email     │  │  │  ┌─ Project ──┐  │  │  ┌─ Filters ────┐ │
│  │ Password  │  │  │  │ Todo   3   │  │  │  │ Status ☑     │ │
│  │ Sign In   │  │  │  │ In Prog 2 │  │  │  │ Assignee ▼  │ │
│  └───────────┘  │  │  │ Done   5   │  │  │  └──────────────┘ │
│                 │  │  └────────────┘  │  │  ┌─ Task List ──┐ │
│  + Sign Up      │  │  ┌─ Project ──┐  │  │  │ ☐ Design    │ │
│  + Passwordless │  │  │ Todo   1   │  │  │  │ ▶ API       │ │
└─────────────────┘  │  ...          │  │  │  │ ✓ Deploy    │ │
                     │  └────────────┘  │  │  └──────────────┘ │
                     └──────────────────┘  └───────────────────┘
```

### Requirement Checklist

| Req | Description | Status |
|-----|------------|--------|
| **R1** | Schema + RLS on all 4 ops, workspace isolation | ✅ |
| **R2** | Generated Supabase types, zero `any` | ✅ |
| **R3** | Realtime task updates via Supabase channels | ✅ |
| **R4** | URL-synced filters (status + assignee) | ✅ |
| **R5** | Inline editing with save/cancel affordance | ✅ |
| **R6** | Loading/empty/error states on every view | ✅ |
| **R7** | Optimistic UI with rollback on failure | ✅ |
| **R8** | Edge Function for overdue tasks + RLS | ✅ |

---

## 🛠 Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | Next.js 16 (App Router) | SSR, Server Components, latest React |
| **Language** | TypeScript (strict) | Zero `any`, full type safety |
| **Database** | Supabase (PostgreSQL) | Built-in RLS, Realtime, Auth |
| **Auth** | Supabase Auth | Email/password, PKCE, SSR cookies |
| **State** | React Query + Zustand | Server cache + client state, no bloat |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first, themed, responsive |
| **Realtime** | Supabase Realtime | WebSocket-based, channel subscriptions |
| **Edge** | Supabase Edge Functions (Deno) | For overdue tasks endpoint |
| **Deploy** | Vercel | Zero-config, edge-ready |

```
next.js 16  ───  react query  ───  supabase  ───  postgres (rls)
    │                │                  │
   app              hooks           realtime
  router        (optimistic)      (websocket)
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install
cp .env.example .env.local   # fill in your Supabase credentials
npm run dev
```

**Detailed setup** → see [docs/SETUP.md](docs/SETUP.md)

### Prerequisites
- [Node.js](https://nodejs.org) 20+
- [Supabase](https://supabase.com) project (free tier)
- [Vercel](https://vercel.com) account (for deployment)

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────┐
│                   Browser                         │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ Auth     │  │ Dashboard│  │ Project View   │  │
│  │ Pages    │  │ Layout   │  │ + Task Panel   │  │
│  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       │              │                │            │
│  ┌────┴──────────────┴────────────────┴────────┐   │
│  │           React Query Cache                  │   │
│  └────────────────────┬─────────────────────────┘   │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│                Next.js 16 App Router                 │
│  ┌──────────────┐     │     ┌───────────────────┐   │
│  │ Server       │─────┼─────│ Client Components │   │
│  │ Components   │     │     │ (Hooks, Context)  │   │
│  └──────┬───────┘     │     └────────┬──────────┘   │
│         │             │              │               │
│  ┌──────┴────────────────────────────┴──────────┐    │
│  │         Supabase SSR Client                   │    │
│  └────────────────────┬─────────────────────────┘    │
└───────────────────────┼─────────────────────────────┘
                        │
┌───────────────────────┼─────────────────────────────┐
│                  Supabase                             │
│  ┌──────────────┐     │     ┌───────────────────┐   │
│  │ PostgreSQL   │─────┼─────│ Realtime          │   │
│  │ + RLS        │     │     │ (WebSocket)       │   │
│  └──────────────┘     │     └───────────────────┘   │
│  ┌──────────────┐     │     ┌───────────────────┐   │
│  │ Auth         │     │     │ Edge Functions    │   │
│  └──────────────┘     │     └───────────────────┘   │
└───────────────────────┼─────────────────────────────┘
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for a deeper dive.

---

## 🗂 Project Structure

```
.
├── proxy.ts                        # Next.js 16 proxy (route protection)
├── schema.sql                      # Database schema + RLS (source of truth)
├── supabase/
│   ├── seed.sql                    # Test data (2 workspaces, 18 tasks)
│   └── functions/
│       └── overdue-tasks/          # Edge Function
├── src/
│   ├── app/
│   │   ├── (auth)/                 # Login & signup pages
│   │   ├── (dashboard)/            # Workspace + project pages
│   │   ├── auth/callback/          # PKCE auth callback
│   │   └── api/overdue/            # Edge Function proxy route
│   ├── components/
│   │   ├── ui/                     # shadcn components (18 primitives)
│   │   ├── layout/                 # Sidebar, nav, workspace switcher
│   │   ├── workspaces/             # Create workspace dialog
│   │   ├── projects/               # Project card, create dialog
│   │   └── tasks/                  # Task list, detail panel, filters
│   ├── hooks/                      # React Query hooks (7 hooks)
│   ├── lib/
│   │   ├── queries.ts              # Typed query functions
│   │   ├── mutations.ts            # Typed mutation functions
│   │   ├── actions.ts              # Server Actions (auth)
│   │   └── supabase/               # Client, server, admin clients
│   ├── providers/                  # React Query + Supabase providers
│   └── stores/                     # Zustand store (workspace state)
├── docs/
│   ├── SETUP.md                    # Full setup guide
│   └── ARCHITECTURE.md             # Architecture deep dive
└── .github/workflows/ci.yml        # CI pipeline
```

---

## 🔒 RLS Security Model

Every table has policies for **all 4 operations** — SELECT, INSERT, UPDATE, DELETE.

```
workspaces
├── SELECT → any workspace member
├── INSERT → any authenticated user (auto-owner via trigger)
├── UPDATE → workspace owner only
└── DELETE → workspace owner only

workspace_members
├── SELECT → workspace members
├── INSERT → workspace owner (or self on creation)
├── UPDATE → workspace owner
└── DELETE → workspace owner

projects
├── SELECT → workspace members
├── INSERT → workspace members
├── UPDATE → workspace members
└── DELETE → workspace owner

tasks
├── SELECT → workspace members (via project lookup)
├── INSERT → workspace members
├── UPDATE → workspace members
└── DELETE → workspace members
```

The key helper function `is_workspace_member()` checks `workspace_members` table — no user can access data outside their workspaces.

---

## 🧠 Design Decisions

### What I'd Defend
- **React Query over raw Supabase hooks**: Cache invalidation, optimistic updates, deduplication
- **Server Components first**: Auth checks and initial data fetch on server → smaller client bundle
- **Zustand for global state**: Minimal boilerplate, works outside React tree
- **CSS variables for theming**: shadcn-compatible, no config changes needed

### What I'd Change With More Time
- **Edge Function types**: A shared types package for Deno compatibility
- **Testing**: Vitest for hooks/mutations, Playwright for E2E
- **Virtual scrolling**: `@tanstack/react-virtual` for large task lists

---

## 🐛 Known Issues

| Issue | Workaround |
|-------|-----------|
| `user_profiles` table not in schema | App works fine without it — auth paths use `auth.users()` metadata. To add: `CREATE TABLE user_profiles (id UUID PRIMARY KEY REFERENCES auth.users(id), email TEXT, name TEXT);` |
| Edge Function type assertion for `assignee` join | Scoped to Edge Function only, doesn't affect Next.js app |
| Seed data needs real user UUIDs | Create a user via signup first, then replace placeholder UUIDs in `seed.sql` |

---

## 📄 License

Built for the Fullstack Engineer take-home assignment.

---

<div align="center">
  <small>Made with ጊዜ by <a href="https://github.com/sud-s">sud-s</a></small>
</div>
