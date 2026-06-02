"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getWorkspaceMembers } from "@/lib/queries"
import { inviteMember, removeMember } from "@/lib/mutations"
import type { WorkspaceRole } from "@/lib/constants"
export function useWorkspaceMembers(workspaceId: string) {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers(supabase, workspaceId),
    enabled: !!workspaceId,
  })
}

export function useInviteMember() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      email,
      role,
    }: {
      workspaceId: string
      email: string
      role: WorkspaceRole
    }) => inviteMember(supabase, workspaceId, email, role),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      })
    },
  })
}

export function useRemoveMember() {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      workspaceId,
      userId,
    }: {
      workspaceId: string
      userId: string
    }) => removeMember(supabase, workspaceId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace-members", variables.workspaceId],
      })
    },
  })
}
