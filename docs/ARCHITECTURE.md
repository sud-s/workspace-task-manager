# Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Auth      │  │ Dashboard│  │ Project  │   │
│  │ Pages     │  │ Layout   │  │ View     │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │              │          │
│  ┌────┴──────────────┴──────────────┴─────┐   │
│  │        React Query Cache Layer          │   │
│  └────────────────┬───────────────────────┘   │
└───────────────────┼───────────────────────────┘
                    │
┌───────────────────┼───────────────────────────┐
│           Next.js 16 (App Router)             │
│  ┌──────────────┐ │ ┌─────────────────────┐   │
│  │ Server       │─┼─│  Client Components  │   │
│  │ Components   │ │ │  (Hooks, Context)   │   │
│  └──────┬───────┘ │ └──────────┬──────────┘   │
│         │         │            │               │
│  ┌──────┴──────────────────────┴──────────┐    │
│  │         Supabase SSR Client             │    │
│  └────────────────┬───────────────────────┘    │
└───────────────────┼───────────────────────────┘
                    │
┌───────────────────┼───────────────────────────┐
│              Supabase                          │
│  ┌──────────────┐ │ ┌─────────────────────┐   │
│  │ PostgreSQL   │─┼─│  Realtime           │   │
│  │ + RLS        │ │ │  (WebSockets)       │   │
│  └──────────────┘ │ └─────────────────────┘   │
│  ┌──────────────┐ │ ┌─────────────────────┐   │
│  │ Auth         │ │ │  Edge Functions     │   │
│  └──────────────┘ │ └─────────────────────┘   │
└───────────────────┼───────────────────────────┘
```

## Key Decisions

### Server Components vs Client Components
- **Server Components** for initial data fetch, auth checks, metadata
- **Client Components** for interactivity (filters, inline editing, realtime)
- No `useEffect` for data fetching — React Query handles that

### State Management
- **React Query** — server state (tasks, projects, workspaces)
- **Zustand** — client state (current workspace, UI toggles)
- **URL params** — filter state (status, assignee)

### RLS Strategy
Every database query goes through Supabase's RLS. The server never bypasses RLS — even server components use the anon key client. Only admin-level operations (like inviting users by email lookup) use the service role key.
