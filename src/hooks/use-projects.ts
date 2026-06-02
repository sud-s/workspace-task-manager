"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getProjects, getProject } from "@/lib/queries"
import { createProject } from "@/lib/mutations"

export function useProjects(workspaceId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(supabase, workspaceId),
    enabled: !!workspaceId,
  })
}

export function useProject(id: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(supabase, id),
    enabled: !!id,
  })
}

export function useCreateProject() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      name,
    }: {
      workspaceId: string
      name: string
    }) => createProject(supabase, workspaceId, name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.workspace_id] })
    },
  })
}
