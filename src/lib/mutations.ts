import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "./supabase/types"
import type { TaskStatus } from "./constants"
import type { WorkspaceRow, ProjectRow, TaskRow } from "./queries"

export interface CreateTaskData {
  title: string
  description?: string
  assignee_id?: string | null
  due_date?: string | null
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  assignee_id?: string | null
  due_date?: string | null
}

type QueryClient = SupabaseClient<Database>

export async function createWorkspace(
  client: QueryClient,
  name: string,
): Promise<WorkspaceRow> {
  const { data, error } = await client
    .from("workspaces")
    .insert({ name })
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Failed to create workspace")

  return data
}

export async function createProject(
  client: QueryClient,
  workspaceId: string,
  name: string,
): Promise<ProjectRow> {
  const { data, error } = await client
    .from("projects")
    .insert({ workspace_id: workspaceId, name })
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Failed to create project")
  return data
}

export async function createTask(
  client: QueryClient,
  projectId: string,
  data: CreateTaskData,
): Promise<TaskRow> {
  const { data: task, error } = await client
    .from("tasks")
    .insert({
      project_id: projectId,
      title: data.title,
      description: data.description ?? "",
      assignee_id: data.assignee_id ?? null,
      due_date: data.due_date ?? null,
    })
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!task) throw new Error("Failed to create task")
  return task
}

export async function updateTask(
  client: QueryClient,
  taskId: string,
  data: UpdateTaskData,
): Promise<TaskRow> {
  const payload: Database["public"]["Tables"]["tasks"]["Update"] = {}

  if (data.title !== undefined) payload.title = data.title
  if (data.description !== undefined) payload.description = data.description
  if (data.status !== undefined) payload.status = data.status
  if (data.assignee_id !== undefined) payload.assignee_id = data.assignee_id
  if (data.due_date !== undefined) payload.due_date = data.due_date

  const { data: task, error } = await client
    .from("tasks")
    .update(payload)
    .eq("id", taskId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!task) throw new Error("Failed to update task")
  return task
}

export async function deleteTask(
  client: QueryClient,
  taskId: string,
): Promise<void> {
  const { error } = await client
    .from("tasks")
    .delete()
    .eq("id", taskId)

  if (error) throw new Error(error.message)
}

export async function updateTaskStatus(
  client: QueryClient,
  taskId: string,
  status: TaskStatus,
): Promise<TaskRow> {
  const { data: task, error } = await client
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!task) throw new Error("Failed to update task status")
  return task
}

export async function updateWorkspace(
  client: QueryClient,
  workspaceId: string,
  name: string,
): Promise<WorkspaceRow> {
  const { data, error } = await client
    .from("workspaces")
    .update({ name })
    .eq("id", workspaceId)
    .select("*")
    .single()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("Failed to update workspace")
  return data
}

export async function deleteWorkspace(
  client: QueryClient,
  workspaceId: string,
): Promise<void> {
  const { error } = await client
    .from("workspaces")
    .delete()
    .eq("id", workspaceId)

  if (error) throw new Error(error.message)
}

export async function inviteMember(
  client: QueryClient,
  workspaceId: string,
  userId: string,
  role: Database["public"]["Enums"]["workspace_role"],
): Promise<void> {
  const { error } = await client
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role,
    })

  if (error) throw new Error(error.message)
}

export async function removeMember(
  client: QueryClient,
  workspaceId: string,
  userId: string,
): Promise<void> {
  const { error } = await client
    .from("workspace_members")
    .delete()
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)

  if (error) throw new Error(error.message)
}
