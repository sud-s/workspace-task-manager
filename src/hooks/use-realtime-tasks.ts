"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"

export function useRealtimeTasks(projectId: string) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!projectId) return

    const handleChange = () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
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
