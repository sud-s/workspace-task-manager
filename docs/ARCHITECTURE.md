# Gize Architecture

## Overview

Gize is a multi-workspace task manager. Users create isolated workspaces, invite members, and manage projects/tasks with real-time sync across clients.

**Live:** https://gize-pi.vercel.app  
**Demo:** `demo@gize.app` / `Demo123!`

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router, Turbopack) | SSR, RSC, API routes, file-based routing |
| Language | TypeScript 5 | Type safety across frontend and backend |
| Styling | Tailwind CSS v4 + shadcn/ui | Utility-first styling, component primitives |
| State | TanStack Query (React Query) | Server state caching, optimistic updates |
| Global State | Zustand | Client-side UI state (theme, misc) |
| Database | Supabase PostgreSQL | Relational data, RLS, Realtime |
| Auth | Supabase SSR Auth | Row-level security via JWT |
| Real-time | Supabase Realtime (broadcast) | Instant cross-client sync |
| Edge Functions | Supabase Edge Functions | Overdue task detection |
| CI | GitHub Actions | Lint, type-check, build |
| Frontend Hosting | Vercel | Auto-deployed from GitHub main |
| Backend | Render (Docker) | Express health endpoint |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth pages (forgot-password, login, signup)
│   ├── (dashboard)/              # Dashboard pages (moved to components)
│   ├── auth/callback/            # OAuth callback handler
│   ├── api/overdue/              # Edge Function trigger endpoint
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page (redirects to profile or workspace)
│   └── proxy.ts                  # Next.js proxy for auth redirects
├── components/
│   ├── ui/                       # shadcn/ui primitives (button, input, dialog, etc.)
│   ├── layout/                   # Sidebar, UserNav, header
│   ├── projects/                 # Create-project dialog, project cards
│   ├── tasks/                    # Task list, Kanban board, calendar
│   ├── workspaces/               # Workspace switcher, create dialog, welcome page
│   └── theme-toggle.tsx          # Dark/light mode toggle
├── hooks/                        # TanStack Query hooks
│   ├── use-auth.ts              # Auth state
│   ├── use-workspaces.ts        # Workspace CRUD
│   ├── use-projects.ts          # Project CRUD
│   ├── use-tasks.ts             # Task CRUD
│   ├── use-workspace-members.ts # Member management
│   ├── use-realtime-tasks.ts    # Real-time task subscription
│   └── use-realtime-projects.ts # Real-time project subscription
├── lib/
│   ├── mutations.ts             # Bare mutation functions (createWorkspace, etc.)
│   ├── queries.ts               # Data fetching functions with return types
│   ├── actions.ts               # Server Actions (signIn, signUp, resetPassword, etc.)
│   ├── constants.ts             # Status enums, static data
│   ├── supabase/
│   │   ├── client.ts            # Browser-side Supabase client
│   │   ├── server.ts            # SSR Supabase client + admin client
│   │   ├── middleware.ts        # Next.js middleware for auth refresh
│   │   └── types.ts            # Generated DB types
│   └── utils.ts                 # cn() helper, UUID validation
├── providers/
│   ├── query-provider.tsx       # TanStack Query provider
│   └── supabase-provider.tsx    # Supabase context provider (browser client)
├── proxy.ts                      # Auth proxy convention
└── middleware.ts                 # Next.js edge middleware
```

---

## Database Schema

### Tables

**workspaces**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, default gen_random_uuid() |
| name | text | NOT NULL |
| created_at | timestamptz | default now() |

**workspace_members**
| Column | Type | Notes |
|--------|------|-------|
| workspace_id | uuid | FK → workspaces.id |
| user_id | uuid | FK → auth.users.id |
| role | workspace_role | enum: 'owner' \| 'member' |
| joined_at | timestamptz | default now() |
| PK | | (workspace_id, user_id) |

**projects**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| workspace_id | uuid | FK → workspaces.id |
| name | text | NOT NULL |
| created_at | timestamptz | default now() |

**tasks**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| project_id | uuid | FK → projects.id |
| title | text | NOT NULL |
| description | text | nullable |
| status | task_status | enum: 'todo' \| 'in_progress' \| 'done', default 'todo' |
| assignee_id | uuid | nullable, FK → auth.users.id |
| due_date | date | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | auto-updated |

### RLS Strategy

Every table uses the helper function `is_workspace_member(workspace_id uuid)`:

```sql
CREATE FUNCTION public.is_workspace_member(ws_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = ws_id AND user_id = auth.uid()
  );
$$;
```

**Policy pattern per operation:**

| Operation | workspaces | workspace_members | projects | tasks |
|-----------|-----------|-------------------|----------|-------|
| SELECT | is_workspace_member(id) | is_workspace_member(workspace_id) | is_workspace_member(workspace_id) | is_workspace_member( project → workspace_id ) |
| INSERT | CHECK(true) [anon+auth] | owner creation or owner invite | is_workspace_member(workspace_id) | is_workspace_member( project → workspace_id ) |
| UPDATE | is_workspace_member(id) + owner role | — | is_workspace_member(workspace_id) | is_workspace_member( project → workspace_id ) |
| DELETE | is_workspace_member(id) + owner role | owner only | is_workspace_member(workspace_id) | is_workspace_member( project → workspace_id ) |

### Key Triggers & Functions

**create_workspace RPC (SECURITY DEFINER)**
The primary method for workspace creation. The `create_workspace(workspace_name text)` function:
1. Reads `auth.uid()` inside a SECURITY DEFINER context
2. Inserts the workspace
3. Inserts the owner member
4. Returns the workspace row

This avoids the chicken-and-egg problem where RLS on workspace_members requires checking for existing members, but no member exists yet for a new workspace.

**handle_new_workspace trigger (removed)**
Previously fired AFTER INSERT on workspaces. Dropped because `auth.uid()` returned NULL in trigger context (JWT claims GUC not propagated properly through SECURITY DEFINER with SET search_path = '').

---

## Authentication Flow

```
Browser                         Next.js                          Supabase
  │                                │                                │
  │  POST /login                   │                                │
  │  ─────────────────────────►    │                                │
  │                                │  POST /auth/v1/token           │
  │                                │  ─────────────────────────►    │
  │                                │  ◄─────────────────────────    │
  │                                │     { access_token, user }     │
  │                                │                                │
  │  Set session cookie            │                                │
  │  ◄─────────────────────────    │                                │
  │                                │                                │
  │  GET /profile                  │                                │
  │  ─────────────────────────►    │                                │
  │                                │  middleware: refresh session   │
  │                                │  ─────────────────────────►    │
  │                                │  ◄─────────────────────────    │
  │                                │                                │
  │  Render profile page           │                                │
  │  ◄─────────────────────────    │                                │
```

- **Login**: Form submission → `signInAction` server action → Supabase auth API → session cookie set
- **Signup**: Similar flow with auto-login after email confirmation (disabled in dev)
- **Password Reset**: Forgot password → `resetPasswordAction` → Supabase sends email → callback handler updates password
- **Session**: Next.js middleware refreshes the session on every request; `createServerSupabase()` reads cookies server-side
- **Client Auth**: `useSupabase()` hook from SupabaseProvider reads the browser client for real-time subscriptions

---

## Data Flow Patterns

### Read Pattern (TanStack Query)

```
Component
  │
  ├─ useQuery({ queryKey, queryFn, ... })
  │     │
  │     └─ queryFn (from lib/queries.ts)
  │           │
  │           └─ supabase.from("table").select("*").eq(...)
  │                 │
  │                 └─ PostgREST → RLS → PostgreSQL
  │
  └─ Renders data (loading → success / error)
```

Every hook has explicit `UseQueryResult<T>` return type. UUID validation in hooks prevents DB errors from non-UUID route params.

### Write Pattern (Mutation)

```
Component
  │
  ├─ useMutation({ mutationFn, onSuccess: invalidateQueries })
  │     │
  │     └─ mutationFn (from lib/mutations.ts)
  │           │
  │           ├─ supabase.from("table").insert(...).select("*")
  │           │     └─ or: supabase.rpc("create_workspace", ...)
  │           │
  │           └─ On error → throw → toast.error()
  │
  └─ On success → toast.success() + query invalidation
```

Optimistic updates for task mutations: `onMutate` saves current cache, `onError` rolls back.

### Real-time Pattern

```
Supabase Realtime (broadcast)
  │
  ├─ INSERT on tasks → channel broadcasts new row
  ├─ UPDATE on tasks → channel broadcasts updated row
  └─ DELETE on tasks → channel broadcasts deleted id
        │
        └─ useRealtimeTasks()
              │
              └─ queryClient.setQueryData() / setQueriesData()
                    └─ All open windows update instantly
```

React Query cache is directly manipulated on real-time events — no manual refetch needed.

---

## Component Architecture

### Providers (Root Layout Order)

```
QueryProvider (TanStack Query)
└── SupabaseProvider (auth context + browser client)
    └── ThemeProvider (dark/light)
        └── ToastProvider (sonner)
            └── pages
```

### Sidebar Layout

```
Sidebar (server component shell)
├── WorkspaceSwitcher (combobox dropdown)
├── NavLinks (Dashboard, Members, Settings)
├── ProjectList (per-workspace, hidden when no workspace)
└── NewWorkspaceButton

Workspace ID is derived from URL only — no Zustand persistence for current workspace
to avoid stale state from previous sessions.
```

### Views

| View | File | Features |
|------|------|----------|
| List | `components/tasks/task-list.tsx` | Filterable task list, inline status updates |
| Board | `components/tasks/kanban-board.tsx` | @dnd-kit, 3 columns, DragOverlay |
| Calendar | `components/tasks/calendar-view.tsx` | date-fns, month grid, dot indicators |

---

## Deployment

### Frontend (Vercel)

- Auto-deploys from `main` branch via GitHub integration
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Build: `next build` → static + SSR output

### Backend (Render)

- Express server in `backend/` directory
- Dockerfile for containerized deployment
- Health check endpoint: `GET /health`

### Supabase Edge Function

- `supabase/functions/overdue-tasks/` — deployed via Management API
- Reads tasks with `due_date < now()` and `status != 'done'`
- Uses admin client (service_role key) for assignee name enrichment

---

## CI Pipeline (GitHub Actions)

| Job | Steps | Purpose |
|-----|-------|---------|
| Lint & Type Check | npm install → lint → tsc --noEmit | Enforce code quality |
| Build | npm install → npm run build | Verify production build |
| Backend Health Check | npm install → tsc --noEmit | Verify backend compiles |

---

## RLS Bug History

### Self-comparison Bug
The `workspace_members` INSERT policies originally used ambiguous `workspace_id = workspace_members.workspace_id`. PostgreSQL resolved both sides to the same inner alias (`workspace_members_1`), making the condition always true. This meant `NOT EXISTS` always evaluated to false after the first member row existed anywhere in the table — blocking all subsequent workspace creations.

**Fix:** Use explicit aliases (`owner.workspace_id = workspace_members.workspace_id`).

### auth.uid() in Trigger
The `handle_new_workspace` trigger (SECURITY DEFINER + SET search_path = '') ran `IF auth.uid() IS NOT NULL` but `auth.uid()` returned NULL in that context. The member insert was skipped, leaving workspaces with no owner, causing SELECT RLS to fail (403).

**Fix:** Replaced trigger with `create_workspace` RPC function that captures `auth.uid()` into a local variable before the INSERT, avoiding the JWT GUC propagation issue.
