"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getTasks, getTask } from "@/lib/queries"
import { createTask, updateTask, deleteTask, updateTaskStatus } from "@/lib/mutations"
import type { TaskFilters, TaskRow } from "@/lib/queries"
import type { CreateTaskData, UpdateTaskData } from "@/lib/mutations"
import type { TaskStatus } from "@/lib/constants"
export function useTasks(projectId: string, filters?: TaskFilters) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["tasks", projectId, filters],
    queryFn: () => getTasks(supabase, projectId, filters),
    enabled: !!projectId,
  })
}

export function useTask(taskId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(supabase, taskId),
    enabled: !!taskId,
  })
}

export function useCreateTask() {
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
    },
  })
}

export function useUpdateTask() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskData }) =>
      updateTask(supabase, taskId, data),
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", task.project_id] })
      queryClient.invalidateQueries({ queryKey: ["task", task.id] })
    },
  })
}

export function useDeleteTask() {
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
    },
  })
}

export function useUpdateTaskStatus() {
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

    onError: (_err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["tasks", variables.projectId],
          context.previousTasks,
        )
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.projectId] })
    },
  })
}
