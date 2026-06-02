"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getTasks, getTask } from "@/lib/queries"
import { createTask, updateTask, deleteTask, updateTaskStatus } from "@/lib/mutations"
import type { TaskFilters, TaskRow } from "@/lib/queries"
import type { CreateTaskData, UpdateTaskData } from "@/lib/mutations"
import type { TaskStatus } from "@/lib/constants"
import { toast } from "sonner"

export function useTasks(projectId: string, filters?: TaskFilters): UseQueryResult<TaskRow[]> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: () => getTasks(supabase, projectId, filters),
    enabled: !!projectId,
  })
}

export function useTask(taskId: string): UseQueryResult<TaskRow | null> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(supabase, taskId),
    enabled: !!taskId,
  })
}

export function useCreateTask(): UseMutationResult<
  TaskRow,
  Error,
  { projectId: string; data: CreateTaskData }
> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string
      data: CreateTaskData
    }) => createTask(supabase, projectId, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.project_id] })
      toast.success("Task created")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create task")
    },
  })
}

export function useUpdateTask(): UseMutationResult<
  TaskRow,
  Error,
  { taskId: string; data: UpdateTaskData }
> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
      updateTask(supabase, taskId, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.project_id] })
      queryClient.invalidateQueries({ queryKey: ["task", task.id] })
      toast.success("Task updated")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update task")
    },
  })
}

export function useDeleteTask(): UseMutationResult<
  { pid: string },
  Error,
  { taskId: string; projectId: string }
> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      projectId: pid,
    }: {
      taskId: string
      projectId: string
    }) => deleteTask(supabase, taskId).then(() => ({ pid })),
    onSuccess: ({ pid }) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", pid] })
      toast.success("Task deleted")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete task")
    },
  })
}

export function useUpdateTaskStatus(): UseMutationResult<
  TaskRow,
  Error,
  { taskId: string; status: TaskStatus; projectId: string },
  { previousTasks: TaskRow[] | undefined }
> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string
      status: TaskStatus
      projectId: string
    }) => updateTaskStatus(supabase, taskId, status),

    onMutate: async ({ taskId, status, projectId }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] })

      const previousTasks = queryClient.getQueryData<TaskRow[]>(["tasks", projectId])

      queryClient.setQueryData<TaskRow[]>(["tasks", projectId], (old) =>
        old?.map((task) => (task.id === taskId ? { ...task, status } : task)),
      )

      return { previousTasks }
    },

    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", variables.projectId],
          context.previousTasks,
        )
      }
      toast.error("Failed to update task status")
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] })
    },
  })
}
