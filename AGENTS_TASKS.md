# Gize — 20-Agent Task Breakdown

## Overview
**Gize** (ጊዜ — "time" in Amharic) — multi-workspace task manager.
Next.js 16 App Router + TypeScript + Supabase + Vercel.

**24-hour assignment.** 20 AI agents working in parallel.

---

## Communication Rules

1. **Post progress** after every file you write
2. **Ask for help** if blocked
3. **Surface bugs** immediately
4. **Coordinate interfaces** — if you change a signature, announce it
5. **Read existing files** before writing — don't overwrite someone else's work

---

## Agent Assignments

### Agent 1: Database Schema
**Files:** `schema.sql`
- Write the complete schema: enums (`task_status`, `workspace_role`), tables (`workspaces`, `workspace_members`, `projects`, `tasks`), relationships, indexes
- No RLS in this file — that's Agent 2's job
- **Announce:** "AGENT 1 TAKES: Database Schema"

### Agent 2: RLS Policies
**Files:** `schema.sql` (appends to Agent 1's work)
- `is_workspace_member()` helper function
- RLS policies: SELECT, INSERT, UPDATE, DELETE on every table
- Workspace isolation via `workspace_members`
- Trigger: auto-add creator as owner
- **Announce:** "AGENT 2 TAKES: RLS Policies"

### Agent 3: Seed Data
**Files:** `supabase/seed.sql`
- 2 workspaces, 4 projects, 15+ tasks across statuses
- Fixed UUIDs with comment: replace with real user IDs
- **Announce:** "AGENT 3 TAKES: Seed Data"

### Agent 4: Supabase Clients
**Files:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/admin.ts`
- Browser client with `@supabase/ssr`
- Server client with `cookies()` from `next/headers`
- Admin client with service role (server-only)
- **Announce:** "AGENT 4 TAKES: Supabase Clients"

### Agent 5: Types, Constants & Env
**Files:** `src/lib/supabase/types.ts`, `src/lib/constants.ts`, `.env.example`
- Placeholder Database types matching schema
- TaskStatus, WorkspaceRole constants
- All env vars documented
- **Announce:** "AGENT 5 TAKES: Types & Constants"

### Agent 6: Auth - Login Page
**Files:** `src/app/(auth)/login/page.tsx`
- Login form: email + password
- Calls `supabase.auth.signInWithPassword()`
- Error states, loading state
- Redirect to `/` on success
- **Announce:** "AGENT 6 TAKES: Login Page"

### Agent 7: Auth - Signup Page
**Files:** `src/app/(auth)/signup/page.tsx`
- Signup form: email + password + name
- Calls `supabase.auth.signUp()`
- Error states, loading state
- **Announce:** "AGENT 7 TAKES: Signup Page"

### Agent 8: Auth - Callback & Proxy
**Files:** `src/app/auth/callback/route.ts`, `proxy.ts`
- Auth callback for PKCE flow
- Proxy (Next.js 16 middleware replacement): protect routes, redirect unauthenticated
- **Announce:** "AGENT 8 TAKES: Auth Callback & Proxy"

### Agent 9: Queries - Workspaces & Projects
**Files:** `src/lib/queries.ts`
- `getWorkspaces(userId)`, `getWorkspace(id)`
- `getProjects(workspaceId)` with task counts by status
- `getProject(id)`
- Must use generated types, no `any`
- **Announce:** "AGENT 9 TAKES: Workspace/Project Queries"

### Agent 10: Queries - Tasks & Members
**Files:** `src/lib/queries.ts` (appends to Agent 9)
- `getTasks(projectId, filters?)` with status[] and assignee filters
- `getTask(id)`
- `getWorkspaceMembers(workspaceId)` with user data
- **Announce:** "AGENT 10 TAKES: Task/Member Queries"

### Agent 11: Mutations
**Files:** `src/lib/mutations.ts`
- `createWorkspace(name)`, `createProject(workspaceId, name)`
- `createTask(projectId, data)`, `updateTask(id, data)`, `deleteTask(id)`
- `updateTaskStatus(id, status)`, `inviteMember()`, `removeMember()`
- Must use generated types, no `any`
- **Announce:** "AGENT 11 TAKES: Mutations"

### Agent 12: Server Actions
**Files:** `src/lib/actions.ts`
- `signInAction(formData)` — server action for sign in
- `signUpAction(formData)` — server action for sign up
- `signOutAction()` — server action for sign out
- **Announce:** "AGENT 12 TAKES: Server Actions"

### Agent 13: React Query Hooks - Workspaces & Projects
**Files:** `src/hooks/use-workspaces.ts`, `src/hooks/use-projects.ts`, `src/providers/query-provider.tsx`, `src/providers/supabase-provider.tsx`
- QueryClientProvider
- Supabase context provider
- `useWorkspaces()`, `useWorkspace(id)`, `useCreateWorkspace()`
- `useProjects(workspaceId)`, `useProject(id)`, `useCreateProject()`
- Explicit return type annotations
- **Announce:** "AGENT 13 TAKES: Workspace/Project Hooks"

### Agent 14: React Query Hooks - Tasks & Members
**Files:** `src/hooks/use-tasks.ts`, `src/hooks/use-members.ts`
- `useTasks(projectId, filters?)`, `useTask(id)`, `useCreateTask()`, `useUpdateTask()`, `useDeleteTask()`
- **`useUpdateTaskStatus()`** with optimistic updates (R7)
- `useWorkspaceMembers(workspaceId)`, `useInviteMember()`
- Optimistic: update cache instantly, rollback on error with feedback
- Explicit return type annotations
- **Announce:** "AGENT 14 TAKES: Task/Member Hooks"

### Agent 15: Realtime Subscriptions
**Files:** `src/hooks/use-realtime-tasks.ts`
- Subscribe to `tasks` channel via Supabase Realtime
- Filter by project_id
- On INSERT/UPDATE/DELETE: invalidate React Query cache
- Cleanup subscription on unmount
- **Announce:** "AGENT 15 TAKES: Realtime Subscriptions"

### Agent 16: Edge Function
**Files:** `supabase/functions/overdue-tasks/index.ts`, `src/hooks/use-overdue-tasks.ts`
- Edge Function: accepts `project_id`, returns overdue tasks with assignee name
- RLS enforced via `auth.uid()`
- Hook: calls Edge Function, returns data/loading/error
- **Announce:** "AGENT 16 TAKES: Edge Function"

### Agent 17: shadcn UI Components Part 1
**Files:** `src/components/ui/button.tsx`, `src/components/ui/input.tsx`, `src/components/ui/label.tsx`, `src/components/ui/card.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/skeleton.tsx`, `src/components/ui/separator.tsx`
- Use `cn()` utility and CSS variables
- Badge with status color variants: todo→amber, in_progress→blue, done→green
- **Announce:** "AGENT 17 TAKES: UI Components Part 1"

### Agent 18: shadcn UI Components Part 2
**Files:** `src/components/ui/select.tsx`, `src/components/ui/dialog.tsx`, `src/components/ui/sheet.tsx`, `src/components/ui/popover.tsx`, `src/components/ui/dropdown-menu.tsx`, `src/components/ui/avatar.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/toast.tsx`
- All accessible, styled with CSS variables
- Toast for notifications/feedback
- Sheet for slide-in panels
- **Announce:** "AGENT 18 TAKES: UI Components Part 2"

### Agent 19: Layout, Navigation & Providers
**Files:** `src/app/layout.tsx`, `src/app/(auth)/layout.tsx`, `src/app/(dashboard)/layout.tsx`, `src/app/page.tsx`, `src/app/(dashboard)/page.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/user-nav.tsx`, `src/components/layout/workspace-switcher.tsx`, `src/stores/workspace-store.ts`, `src/components/workspaces/create-workspace-dialog.tsx`, `src/components/projects/create-project-dialog.tsx`, `src/components/projects/project-card.tsx`, `src/app/(dashboard)/[workspaceId]/page.tsx`
- Root layout with providers
- Auth layout (centered, branding)
- Dashboard layout (sidebar + top bar + content)
- Sidebar with workspace switcher + nav
- Workspace Dashboard page with project cards + task counts
- Create workspace/project dialogs
- Loading/empty/error states everywhere
- Responsive at 375px and 1280px
- Zustand store for current workspace
- **Announce:** "AGENT 19 TAKES: Layout & Navigation"

### Agent 20: Task Feature UI
**Files:** `src/app/(dashboard)/[workspaceId]/projects/[projectId]/page.tsx`, `src/components/tasks/task-list.tsx`, `src/components/tasks/task-item.tsx`, `src/components/tasks/task-detail-panel.tsx`, `src/components/tasks/task-filters.tsx`, `src/components/tasks/task-status-select.tsx`, `src/components/tasks/task-assignee-select.tsx`, `src/components/tasks/create-task-dialog.tsx`, `src/components/tasks/overdue-tasks-button.tsx`
- Project view page with full task list
- Task list with loading/empty/error states
- Task item with status badge, assignee, due date
- **Task detail panel** (sheet): all fields editable inline with save/cancel (R5)
- **URL-synced filters** (R4): `?status=todo,in_progress&assignee=uuid`
- Task status select with colors
- Task assignee select with member avatars
- Create task dialog
- Overdue tasks button → triggers Edge Function
- **Announce:** "AGENT 20 TAKES: Task Feature UI"

---

## Dependency Map

```
A1(Schema)──A2(RLS)──A3(Seed)
    │
    └──A4(Clients)──A5(Types)
         │
         ├──A6(Login)──A8(Callback/Proxy)
         ├──A7(Signup)─┘
         │
         ├──A9(WS/Proj Queries)──A13(WS/Proj Hooks)
         ├──A10(Task/Member Queries)─┐
         ├──A11(Mutations)───────────┤──A14(Task Hooks)
         ├──A12(Server Actions)──────┘
         │
         ├──A15(Realtime)
         ├──A16(Edge Function)
         │
         ├──A17(UI Part 1)──A19(Layout/Pages)
         ├──A18(UI Part 2)──┘
         │
         └──A20(Task UI) ← depends on A14, A15, A16 hooks
```

- A6, A7, A8 can work in parallel
- A9, A10, A11, A12 can work in parallel
- A13 depends on A9, A10
- A14 depends on A10, A11
- A15, A16 can work in parallel with A13, A14
- A17, A18 can work in parallel immediately
- A19 depends on A17, A18
- A20 depends on A14, A15, A16 + A17, A18

---

## Zero-Tolerance Rules
- No `any` types — we grep for it
- No commented-out code
- No `useEffect` for data fetching (use React Query)
- No prop drilling beyond 2 levels
- No hardcoded secrets
- Run `npm run lint` before declaring done

## Everyone Must
1. **Announce your role** by returning: "AGENT X TAKES: [Role Name]"
2. **Read existing files** before writing
3. **Post progress** after every file
4. **Coordinate** if you see overlap with another agent
