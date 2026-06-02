# Contributing to Gize

Thanks for your interest in contributing! Here's how you can help.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in Supabase credentials
4. Start the dev server: `npm run dev`

## Code Style

- TypeScript strict mode
- ESLint + Prettier formatting
- No `any` types
- No commented-out code
- No `useEffect` for data fetching (use TanStack Query)
- Follow existing patterns for components, hooks, and pages

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user settings page
fix: resolve workspace redirect loop
docs: update API reference
refactor: extract task list into component
chore: bump dependencies
```

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure the build passes: `npm run build`
4. Ensure lint passes: `npm run lint`
5. Open a PR against `main`
6. Wait for CI checks to pass

## Need Help?

Open a [discussion](https://github.com/sud-s/workspace-task-manager/discussions) or ask in the PR.
