# Setup Guide

## Prerequisites
- Node.js 20+
- Supabase account (free tier)
- Git

## 1. Clone & Install

```bash
git clone https://github.com/sud-s/workspace-task-manager.git
cd workspace-task-manager
npm install
```

## 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings → API**
3. Copy your **Project URL** and **Anon Key**

## 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 4. Run Schema

Open your Supabase project's **SQL Editor** and run:

1. First: `schema.sql` (creates tables, RLS, triggers)
2. Then: `supabase/seed.sql` (optional test data)

## 5. Start Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up, create a workspace, and go.

## 6. Generate Types (if schema changes)

```bash
npx supabase gen types --linked > src/lib/supabase/types.ts
```

## 7. Deploy to Vercel

1. Push to GitHub
2. Import repo to [vercel.com](https://vercel.com)
3. Add the same environment variables
4. Deploy — that's it
