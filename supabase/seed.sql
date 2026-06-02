-- Gize Seed Data
-- Run this in the Supabase SQL editor after schema is applied.
-- Replace placeholder user UUIDs with real auth.users IDs before running.

-- === PLACEHOLDER USER IDs (REPLACE WITH REAL USER IDs) ===
-- These are deterministic UUIDs for development. In production, get user IDs
-- from auth.users after signing up real users.
--
-- User Alpha:  'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa'
-- User Beta:   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb'

-- Temporarily disable the auto-owner trigger so we can insert members manually
ALTER TABLE workspaces DISABLE TRIGGER on_workspace_created;

-- ============================================================
-- WORKSPACES
-- ============================================================
INSERT INTO workspaces (id, name, created_at) VALUES
  ('00000001-0000-4000-8000-000000000001', 'Design Team',       '2025-11-01T08:00:00Z'),
  ('00000001-0000-4000-8000-000000000002', 'Engineering',       '2025-11-15T10:00:00Z');

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
INSERT INTO workspace_members (workspace_id, user_id, role, created_at) VALUES
  -- Design Team: Alpha is owner, Beta is member
  ('00000001-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'owner',  '2025-11-01T08:00:00Z'),
  ('00000001-0000-4000-8000-000000000001', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 'member', '2025-11-02T09:00:00Z'),
  -- Engineering: Alpha is member, Beta is owner
  ('00000001-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', 'member', '2025-11-15T10:00:00Z'),
  ('00000001-0000-4000-8000-000000000002', 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', 'owner',  '2025-11-15T10:00:00Z');

-- ============================================================
-- PROJECTS
-- ============================================================
INSERT INTO projects (id, workspace_id, name, created_at) VALUES
  -- Design Team projects
  ('00000002-0000-4000-8000-000000000001', '00000001-0000-4000-8000-000000000001', 'Brand Refresh',       '2025-11-05T08:00:00Z'),
  ('00000002-0000-4000-8000-000000000002', '00000001-0000-4000-8000-000000000001', 'Mobile App Redesign', '2025-11-10T09:00:00Z'),
  -- Engineering projects
  ('00000002-0000-4000-8000-000000000003', '00000001-0000-4000-8000-000000000002', 'API V2',              '2025-11-20T08:00:00Z'),
  ('00000002-0000-4000-8000-000000000004', '00000001-0000-4000-8000-000000000002', 'Performance Tuning',  '2025-12-01T10:00:00Z');

-- ============================================================
-- TASKS (18 total across statuses)
-- ============================================================
INSERT INTO tasks (id, project_id, title, description, status, assignee_id, due_date, created_at) VALUES

  -- === Brand Refresh (5 tasks) ===
  ('00000003-0000-4000-8000-000000000001', '00000002-0000-4000-8000-000000000001',
   'Design new logo', 'Create 3 logo concepts for the brand refresh initiative.', 'done',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2025-12-01', '2025-11-06T08:00:00Z'),

  ('00000003-0000-4000-8000-000000000002', '00000002-0000-4000-8000-000000000001',
   'Define color palette', 'Finalize primary, secondary, and accent colors.', 'done',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2025-12-05', '2025-11-08T09:00:00Z'),

  ('00000003-0000-4000-8000-000000000003', '00000002-0000-4000-8000-000000000001',
   'Update typography guidelines', 'Document font families, sizes, and usage rules for web and print.', 'in_progress',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2026-01-15', '2025-11-12T10:00:00Z'),

  ('00000003-0000-4000-8000-000000000004', '00000002-0000-4000-8000-000000000001',
   'Create brand style guide', 'Compile all brand assets into a single PDF guide.', 'in_progress',
   NULL, '2026-02-01', '2025-11-15T08:00:00Z'),

  ('00000003-0000-4000-8000-000000000005', '00000002-0000-4000-8000-000000000001',
   'Social media kit', 'Design templates for Instagram, LinkedIn, and Twitter.', 'todo',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2026-03-01', '2025-11-20T09:00:00Z'),

  -- === Mobile App Redesign (4 tasks) ===
  ('00000003-0000-4000-8000-000000000006', '00000002-0000-4000-8000-000000000002',
   'User research summary', 'Compile findings from 20 user interviews into actionable insights.', 'done',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2025-12-10', '2025-11-11T08:00:00Z'),

  ('00000003-0000-4000-8000-000000000007', '00000002-0000-4000-8000-000000000002',
   'Wireframe key screens', 'Create low-fidelity wireframes for the 8 main screens.', 'in_progress',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2026-01-10', '2025-11-18T09:00:00Z'),

  ('00000003-0000-4000-8000-000000000008', '00000002-0000-4000-8000-000000000002',
   'High-fidelity mockups', 'Convert approved wireframes into pixel-perfect mockups in Figma.', 'todo',
   NULL, '2026-02-15', '2025-11-25T10:00:00Z'),

  ('00000003-0000-4000-8000-000000000009', '00000002-0000-4000-8000-000000000002',
   'Prototype interactions', 'Build an interactive prototype for user testing.', 'todo',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2026-03-01', '2025-12-01T08:00:00Z'),

  -- === API V2 (5 tasks) ===
  ('00000003-0000-4000-8000-00000000000a', '00000002-0000-4000-8000-000000000003',
   'Design API schema', 'Define all new endpoints, request/response shapes, and error codes.', 'done',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2025-12-15', '2025-11-21T08:00:00Z'),

  ('00000003-0000-4000-8000-00000000000b', '00000002-0000-4000-8000-000000000003',
   'Implement auth middleware', 'Build JWT verification and rate-limiting middleware for all routes.', 'in_progress',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2026-01-20', '2025-11-28T09:00:00Z'),

  ('00000003-0000-4000-8000-00000000000c', '00000002-0000-4000-8000-000000000003',
   'Write integration tests', 'Achieve 90% coverage on all new API endpoints.', 'in_progress',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2026-02-10', '2025-12-05T10:00:00Z'),

  ('00000003-0000-4000-8000-00000000000d', '00000002-0000-4000-8000-000000000003',
   'Deploy staging environment', 'Set up CI/CD pipeline and deploy API V2 to staging.', 'todo',
   NULL, '2026-02-28', '2025-12-10T08:00:00Z'),

  ('00000003-0000-4000-8000-00000000000e', '00000002-0000-4000-8000-000000000003',
   'API documentation', 'Generate OpenAPI spec and publish developer docs.', 'todo',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2026-03-15', '2025-12-15T09:00:00Z'),

  -- === Performance Tuning (4 tasks) ===
  ('00000003-0000-4000-8000-00000000000f', '00000002-0000-4000-8000-000000000004',
   'Database query audit', 'Identify slow queries using pg_stat_statements and recommend indexes.', 'in_progress',
   'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', '2026-01-10', '2025-12-02T08:00:00Z'),

  ('00000003-0000-4000-8000-000000000010', '00000002-0000-4000-8000-000000000004',
   'Optimize image delivery', 'Implement CDN caching and WebP conversion for all user-uploaded images.', 'todo',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2026-02-01', '2025-12-05T09:00:00Z'),

  ('00000003-0000-4000-8000-000000000011', '00000002-0000-4000-8000-000000000004',
   'Reduce bundle size', 'Analyze and trim unused dependencies; implement code splitting.', 'todo',
   NULL, '2026-02-20', '2025-12-08T10:00:00Z'),

  ('00000003-0000-4000-8000-000000000012', '00000002-0000-4000-8000-000000000004',
   'Load testing report', 'Run k6 tests simulating 10k concurrent users and document bottlenecks.', 'todo',
   'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', '2026-03-10', '2025-12-12T08:00:00Z');

-- Re-enable the auto-owner trigger
ALTER TABLE workspaces ENABLE TRIGGER on_workspace_created;
