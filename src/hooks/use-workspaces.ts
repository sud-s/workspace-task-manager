"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getWorkspaces, getWorkspace } from "@/lib/queries"
import { createWorkspace, updateWorkspace, deleteWorkspace } from "@/lib/mutations"
import type { WorkspaceRow } from "@/lib/queries"
import { toast } from "sonner"

export function useWorkspaces(): UseQueryResult<WorkspaceRow[]> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(supabase),
  })
}

export function useWorkspace(id: string): UseQueryResult<WorkspaceRow | null> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => getWorkspace(supabase, id),
    enabled: typeof id === "string" && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id),
  })
}

export function useCreateWorkspace(): UseMutationResult<WorkspaceRow, Error, string> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createWorkspace(supabase, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace created")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create workspace")
    },
  })
}

export function useUpdateWorkspace(): UseMutationResult<
  WorkspaceRow,
  Error,
  { id: string; name: string }
> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateWorkspace(supabase, id, name),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.id] })
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace updated")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update workspace")
    },
  })
}

export function useDeleteWorkspace(): UseMutationResult<void, Error, string> {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteWorkspace(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
      toast.success("Workspace deleted")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete workspace")
    },
  })
}
