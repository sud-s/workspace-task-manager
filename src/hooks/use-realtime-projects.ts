"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"

export function useRealtimeProjects(workspaceId: string) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!workspaceId) return

    const handleTaskChange = () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] })
    }

    const handleProjectChange = () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] })
    }

    const taskChannel = supabase
      .channel(`project-tasks-ws-${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        handleTaskChange,
      )
      .subscribe()

    const projectChannel = supabase
      .channel(`projects-ws-${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        handleProjectChange,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(taskChannel)
      supabase.removeChannel(projectChannel)
    }
  }, [workspaceId, supabase, queryClient])
}
