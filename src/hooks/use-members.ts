"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import { getWorkspaceMembers } from "@/lib/queries"
import { inviteMember, removeMember } from "@/lib/mutations"
import type { WorkspaceMemberRow } from "@/lib/queries"
import type { WorkspaceRole } from "@/lib/constants"
import { toast } from "sonner"

export function useWorkspaceMembers(workspaceId: string): UseQueryResult<WorkspaceMemberRow[]> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () => getWorkspaceMembers(supabase, workspaceId),
    enabled: typeof workspaceId === "string" && /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(workspaceId),
  })
}

export function useInviteMember(): UseMutationResult<
  void,
  Error,
  { workspaceId: string; email: string; role: WorkspaceRole }
> {
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
      toast.success("Member invited")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to invite member")
    },
  })
}

export function useRemoveMember(): UseMutationResult<
  void,
  Error,
  { workspaceId: string; userId: string }
> {
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
      toast.success("Member removed")
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to remove member")
    },
  })
}
