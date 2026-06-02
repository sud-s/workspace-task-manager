"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getProjects, getProject } from "@/lib/queries"
import { createProject } from "@/lib/mutations"
import type { ProjectWithCounts, ProjectRow } from "@/lib/queries"
import { toast } from "sonner"

export function useProjects(workspaceId: string): UseQueryResult<ProjectWithCounts[]> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => getProjects(supabase, workspaceId),
    enabled: !!workspaceId,
  })
}

export function useProject(id: string): UseQueryResult<ProjectRow | null> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProject(supabase, id),
    enabled: !!id,
  })
}

export function useCreateProject(): UseMutationResult<
  ProjectRow,
  Error,
  { workspaceId: string; name: string }
> {
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
      toast.success("Project created")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create project")
    },
  })
}
