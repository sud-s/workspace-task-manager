"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getWorkspaces, getWorkspace } from "@/lib/queries"
import { createWorkspace, updateWorkspace, deleteWorkspace } from "@/lib/mutations"
import { toast } from "sonner"

export function useWorkspaces() {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => getWorkspaces(supabase),
  })
}

export function useWorkspace(id: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspace", id],
    queryFn: () => getWorkspace(supabase, id),
    enabled: !!id,
  })
}

export function useCreateWorkspace() {
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

export function useUpdateWorkspace() {
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

export function useDeleteWorkspace() {
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
