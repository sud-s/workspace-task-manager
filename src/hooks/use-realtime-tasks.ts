"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import type { TaskRow } from "@/lib/queries"
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export function useRealtimeTasks(projectId: string) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId) return

    const handleChange = (
      payload: RealtimePostgresChangesPayload<{ [key: string]: unknown }>,
    ) => {
      const event = payload.eventType
      const queryKey = ["tasks", projectId]

      if (event === "INSERT" && payload.new) {
        const newTask = payload.new as unknown as TaskRow
        if (newTask.project_id === projectId) {
          queryClient.setQueryData<TaskRow[]>(queryKey, (old) => {
            if (!old) return [newTask]
            if (old.some((t) => t.id === newTask.id)) return old
            return [newTask, ...old]
          })
        }
      } else if (event === "UPDATE" && payload.new) {
        const updatedTask = payload.new as unknown as TaskRow
        queryClient.setQueryData<TaskRow[]>(queryKey, (old) =>
          old?.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
        )
        queryClient.setQueryData(["task", updatedTask.id], updatedTask)
      } else if (event === "DELETE" && payload.old) {
        const deletedTask = payload.old as unknown as TaskRow
        queryClient.setQueryData<TaskRow[]>(queryKey, (old) =>
          old?.filter((t) => t.id !== deletedTask.id),
        )
        queryClient.removeQueries({ queryKey: ["task", deletedTask.id] })
      }

      queryClient.invalidateQueries({
        queryKey: queryKey,
        refetchType: "none",
      })
    }

    const channel = supabase
      .channel(`tasks-project-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `project_id=eq.${projectId}`,
        },
        handleChange,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase, queryClient])
}
