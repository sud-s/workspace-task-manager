import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./supabase/types"
import type { TaskStatus } from "./constants"

export type QueryClient = SupabaseClient<Database>

export type TaskFilters = { status?: TaskStatus[]; assignee?: string } | undefined

export interface WorkspaceRow {
  id: string
  name: string
  created_at: string
}

export interface ProjectRow {
  id: string
  workspace_id: string
  name: string
  created_at: string
}

export interface ProjectWithCounts extends ProjectRow {
  task_counts: {
    todo: number
    in_progress: number
    done: number
  }
}

export interface TaskRow {
  id: string
  project_id: string
  title: string
  description: string
  status: TaskStatus
  assignee_id: string | null
  due_date: string | null
  created_at: string
}

export interface WorkspaceMemberRow {
  workspace_id: string
  user_id: string
  role: "owner" | "member"
  created_at: string
}

export interface WorkspaceMemberWithUser extends WorkspaceMemberRow {
  user: {
    id: string
    email: string
    name: string
  } | null
}

export async function getWorkspaces(
  client: QueryClient,
): Promise<WorkspaceRow[]> {
  const { data, error } = await client
    .from("workspaces")
    .select("id, name, created_at")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getWorkspace(
  client: QueryClient,
  workspaceId: string,
): Promise<WorkspaceRow | null> {
  const { data, error } = await client
    .from("workspaces")
    .select("id, name, created_at")
    .eq("id", workspaceId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return data
}

export async function getProjects(
  client: QueryClient,
  workspaceId: string,
): Promise<ProjectWithCounts[]> {
  const { data: projects, error } = await client
    .from("projects")
    .select("id, workspace_id, name, created_at")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)

  const projectsWithCounts: ProjectWithCounts[] = await Promise.all(
    (projects ?? []).map(async (project) => {
      const { count: todoCount } = await client
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id)
        .eq("status", "todo")

      const { count: inProgressCount } = await client
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id)
        .eq("status", "in_progress")

      const { count: doneCount } = await client
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("project_id", project.id)
        .eq("status", "done")

      return {
        ...project,
        task_counts: {
          todo: todoCount ?? 0,
          in_progress: inProgressCount ?? 0,
          done: doneCount ?? 0,
        },
      }
    }),
  )

  return projectsWithCounts
}

export async function getProject(
  client: QueryClient,
  projectId: string,
): Promise<ProjectRow | null> {
  const { data, error } = await client
    .from("projects")
    .select("id, workspace_id, name, created_at")
    .eq("id", projectId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getTasks(
  client: QueryClient,
  projectId: string,
  filters?: TaskFilters,
): Promise<TaskRow[]> {
  let query = client
    .from("tasks")
    .select("id, project_id, title, description, status, assignee_id, due_date, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (filters?.status && filters.status.length > 0) {
    query = query.in("status", filters.status)
  }

  if (filters?.assignee) {
    query = query.eq("assignee_id", filters.assignee)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message)
  return data ?? []
}

export async function getTask(
  client: QueryClient,
  taskId: string,
): Promise<TaskRow | null> {
  const { data, error } = await client
    .from("tasks")
    .select("id, project_id, title, description, status, assignee_id, due_date, created_at")
    .eq("id", taskId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function getWorkspaceMembers(
  client: QueryClient,
  workspaceId: string,
): Promise<WorkspaceMemberRow[]> {
  const { data, error } = await client
    .from("workspace_members")
    .select("workspace_id, user_id, role, created_at")
    .eq("workspace_id", workspaceId)

  if (error) throw new Error(error.message)
  return data ?? []
}


