"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getWorkspaces, getWorkspace } from "@/lib/queries"
import { createWorkspace } from "@/lib/mutations"
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
