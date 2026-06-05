# Gize System Quiz

## Section 1: Architecture Overview

**1.1** What is Gize?
- A) A monolith task manager
- B) A multi-workspace task manager with real-time sync
- C) A single-user todo app
- D) A project management API

**1.2** Which framework does the frontend use?
- A) React 18 with Create React App
- B) Next.js 16 with App Router
- C) Next.js 14 with Pages Router
- D) Remix

**1.3** What is the primary state management library for server data?
- A) Redux
- B) Zustand
- C) TanStack Query (React Query)
- D) Context API

**1.4** Which database system powers the backend?
- A) MongoDB
- B) Firebase Firestore
- C) Supabase PostgreSQL
- D) MySQL

**1.5** Where is the frontend deployed?
- A) Netlify
- B) Vercel
- C) AWS S3
- D) Render

**1.6** What runs on Render?
- A) The Next.js app
- B) A Dockerized Express health endpoint
- C) The database
- D) A Redis cache

---

## Section 2: Database & RLS

**2.1** How many database tables does Gize use?
- A) 2
- B) 3
- C) 4
- D) 5

**2.2** What is the primary key of `workspace_members`?
- A) `id` uuid
- B) `(workspace_id, user_id)` composite
- C) `member_id` serial
- D) `user_id` uuid

**2.3** What does the helper function `is_workspace_member()` return?
- A) A list of member IDs
- B) A boolean indicating if the current user is a member
- C) The number of workspace members
- D) The role of the current user

**2.4** Which RLS policy is applied to the `workspaces` table for INSERT?
- A) `is_workspace_member(id)`
- B) `CHECK(true)` for anon + authenticated
- C) Only authenticated users can insert
- D) Service role only

**2.5** How are workspace members prevented from accessing other workspaces' data?
- A) Application-level filtering
- B) RLS policies using `is_workspace_member()`
- C) Separate databases per workspace
- D) API key per workspace

**2.6** Which column type is NOT used in the schema?
- A) `uuid`
- B) `text`
- C) `jsonb`
- D) `timestamptz`

---

## Section 3: Authentication & Security

**3.1** What authentication method does Gize use?
- A) JWT with Supabase SSR Auth
- B) OAuth 2.0 only
- C) Session cookies with Express
- D) API keys

**3.2** What happens in the Next.js middleware?
- A) Rate limiting
- B) Session refresh via Supabase
- C) Static page generation
- D) Database backup

**3.3** Which server action handles password reset?
- A) `signInAction`
- B) `resetPasswordAction`
- C) `updatePasswordAction`
- D) `forgotPasswordAction`

**3.4** Where is the admin Supabase client (with service_role key) used?
- A) In all server-side queries
- B) Only in the overdue-tasks Edge Function
- C) In the middleware
- D) In client components

**3.5** What type of Supabase client is used in browser components?
- A) `createServerSupabase`
- B) `createAdminSupabase`
- C) `createBrowserClient` from `@supabase/ssr`
- D) Raw `@supabase/supabase-js` with anon key

---

## Section 4: Data Flow & Real-time

**4.1** How does real-time data sync work?
- A) WebSocket connection via Socket.io
- B) Supabase Realtime broadcast channel
- C) Polling every 5 seconds
- D) Server-Sent Events

**4.2** How does the app handle real-time task updates on the client?
- A) Refetches all tasks every 3 seconds
- B) Directly manipulates the React Query cache (`queryClient.setQueryData`)
- C) Re-renders the entire component tree
- D) Uses Zustand actions

**4.3** What is the purpose of optimistic updates?
- A) To reduce server load
- B) To show immediate UI changes before the server confirms
- C) To batch multiple requests
- D) To compress response data

**4.4** What happens if an optimistic update fails?
- A) The UI stays in the optimistic state
- B) The mutation is retried automatically
- C) The previous cache state is restored (rollback)
- D) A full page refresh occurs

**4.5** Which hook provides the real-time task subscription?
- A) `useTasks`
- B) `useRealtimeTasks`
- C) `useSupabaseSubscription`
- D) `useLiveQuery`

---

## Section 5: Component Architecture

**5.1** Where does the sidebar derive the current workspace ID from?
- A) Zustand persisted store
- B) URL parameters
- C) React Context
- D) Local storage

**5.2** Why was the Zustand persisted store rejected for workspace ID?
- A) Too much boilerplate
- B) Stale workspace ID from previous sessions caused issues
- C) Performance problems
- D) TypeScript incompatibility

**5.3** What UI library provides the base components (button, dialog, input)?
- A) Material UI
- B) Ant Design
- C) shadcn/ui
- D) Chakra UI

**5.4** Which library powers the Kanban drag-and-drop?
- A) react-beautiful-dnd
- B) @dnd-kit
- C) react-dnd
- D) dragula

**5.5** What is the root provider nesting order?
- A) SupabaseProvider → QueryProvider → ThemeProvider → ToastProvider
- B) QueryProvider → SupabaseProvider → ThemeProvider → ToastProvider
- C) ThemeProvider → QueryProvider → SupabaseProvider → ToastProvider
- D) ToastProvider → QueryProvider → SupabaseProvider → ThemeProvider

---

## Section 6: Problems Solved

**6.1** What was the "self-comparison bug" in RLS policies?
- A) A typo in column names
- B) PostgreSQL resolved both sides of `workspace_id = workspace_members.workspace_id` to the same inner alias
- C) Missing WHERE clause in SELECT policies
- D) Incorrect foreign key reference

**6.2** What was the consequence of the self-comparison bug?
- A) All queries returned empty results
- B) Only the first workspace creation ever succeeded; subsequent ones got 403
- C) Members could see other workspaces' data
- D) The database crashed on insert

**6.3** How was the self-comparison bug fixed?
- A) Removed the NOT EXISTS clause
- B) Used explicit aliases (`owner.workspace_id = workspace_members.workspace_id`)
- C) Switched to a different RLS strategy
- D) Disabled RLS on workspace_members

**6.4** Why did the `handle_new_workspace` trigger fail to insert the owner member?
- A) The table had a NOT NULL constraint on `user_id`
- B) `auth.uid()` returned NULL in the SECURITY DEFINER trigger context
- C) The trigger had a syntax error
- D) The workspace_members table didn't exist

**6.5** How was the trigger problem solved?
- A) Removed the IF guard from the trigger
- B) Replaced the trigger with a `create_workspace` RPC function
- C) Changed the trigger to run as the authenticated user
- D) Added a default value for `user_id`

**6.6** How does the `create_workspace` RPC function avoid the chicken-and-egg problem?
- A) It uses SECURITY DEFINER to bypass RLS
- B) It captures `auth.uid()` into a local variable before inserting
- C) It inserts the workspace and member in a single transaction
- D) All of the above

**6.7** Why was the workspace creation switched from REST insert to RPC?
- A) REST inserts are slower
- B) The trigger couldn't access `auth.uid()` and the REST insert's SELECT policy failed when no member existed
- C) RPC functions are easier to test
- D) REST inserts have size limits

**6.8** What does `// @ts-expect-error` above the `client.rpc("create_workspace")` call indicate?
- A) The code has a bug
- B) The generated Supabase types don't include RPC function signatures
- C) The function is deprecated
- D) TypeScript is disabled for that file

---

## Section 7: CI & Deployment

**7.1** How many jobs are in the CI pipeline?
- A) 1
- B) 2
- C) 3
- D) 4

**7.2** Which CI job was failing before the fix?
- A) Lint & Type Check
- B) Build
- C) Backend Health Check
- D) Deploy

**7.3** What caused the Build job to fail?
- A) TypeScript errors
- B) Missing Supabase environment variables during static prerender
- C) ESLint warnings
- D) Network timeout

**7.4** How was the Build job fixed?
- A) Removed the build step from CI
- B) Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as GitHub repo variables
- C) Installed missing dependencies
- D) Disabled static generation

**7.5** Which page specifically failed during static prerendering?
- A) `/login`
- B) `/forgot-password`
- C) `/signup`
- D) `/profile`

---

## Section 8: Comparison & Trade-offs

**8.1** Why TanStack Query over raw Supabase JS client hooks?
- A) Better TypeScript support
- B) Cache invalidation, optimistic updates, deduplication
- C) Smaller bundle size
- D) Simpler API

**8.2** Why was Zustand used for workspace ID (briefly) and then abandoned?
- A) Too complex for a single value
- B) Persisted store caused stale workspace ID from previous sessions
- C) Not compatible with Next.js App Router
- D) Couldn't share state between client and server

**8.3** Why use `npm install` instead of `npm ci` in the CI workflow?
- A) `npm ci` is slower
- B) The lockfile generated on Windows lacks Linux-specific optional dependencies
- C) `npm install` is more secure
- D) `npm ci` isn't supported in GitHub Actions

**8.4** Why `.maybeSingle()` over `.single()` for workspace queries?
- A) Returns `null` instead of throwing on not-found
- B) Better performance
- C) Required by TypeScript
- D) Avoids the `PGRST116` error when no row matches

**8.5** Why `window.location.href` for post-auth redirect instead of Next.js router?
- A) Router push was broken
- B) Ensures a fresh session cookie is loaded
- C) Faster navigation
- D) Required by Supabase SSR Auth

---

## Answer Key

**Section 1:** 1-B, 2-B, 3-C, 4-C, 5-B, 6-B  
**Section 2:** 1-C, 2-B, 3-B, 4-B, 5-B, 6-C  
**Section 3:** 1-A, 2-B, 3-B, 4-B, 5-C  
**Section 4:** 1-B, 2-B, 3-B, 4-C, 5-B  
**Section 5:** 1-B, 2-B, 3-C, 4-B, 5-B  
**Section 6:** 1-B, 2-B, 3-B, 4-B, 5-B, 6-D, 7-B, 8-B  
**Section 7:** 1-C, 2-B, 3-B, 4-B, 5-B  
**Section 8:** 1-B, 2-B, 3-B, 4-D, 5-B
