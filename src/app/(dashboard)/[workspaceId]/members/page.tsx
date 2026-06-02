"use client"

import { use, useState, useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useWorkspaceMembers } from "@/hooks/use-members"
import { useRemoveMember } from "@/hooks/use-members"
import { useSupabase } from "@/providers/supabase-provider"
import { inviteMemberByEmailAction, getUsersByIdsAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Trash2, UserPlus, Shield, User } from "lucide-react"
import { toast } from "sonner"

type PageProps = {
  params: Promise<{ workspaceId: string }>
}

export default function MembersPage({ params }: PageProps) {
  const { workspaceId } = use(params)
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId)
  const removeMember = useRemoveMember()
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviting, setInviting] = useState(false)
  const [userEmails, setUserEmails] = useState<Record<string, string>>({})
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null)
    })
  }, [supabase])

  useEffect(() => {
    if (members && members.length > 0) {
      const userIds = members.map((m) => m.user_id)
      getUsersByIdsAction(userIds).then((users) => {
        const map: Record<string, string> = {}
        for (const u of users) {
          map[u.id] = u.email
        }
        setUserEmails(map)
      })
    }
  }, [members])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteError(null)
    if (!inviteEmail.trim()) return

    setInviting(true)
    const result = await inviteMemberByEmailAction(workspaceId, inviteEmail.trim(), "member")
    setInviting(false)

    if (result.error) {
      setInviteError(result.error)
    } else {
      setInviteEmail("")
      toast.success("Member invited")
      queryClient.invalidateQueries({ queryKey: ["workspace-members", workspaceId] })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Members</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
          Manage who has access to this workspace
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />

      <div className="rounded-xl border border-border/60 bg-card/30 p-4 sm:p-6 backdrop-blur-sm">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-4">
          <UserPlus className="h-4 w-4 text-emerald-400" />
          Invite Member
        </h3>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            className="w-full sm:max-w-sm border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
          <Button
            type="submit"
            disabled={inviting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {inviting ? "Inviting..." : "Invite"}
          </Button>
        </form>
        {inviteError && (
          <p className="mt-2 text-sm text-red-400">{inviteError}</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full bg-accent rounded-xl" />
          <Skeleton className="h-16 w-full bg-accent rounded-xl" />
        </div>
      ) : members && members.length > 0 ? (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.user_id}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-card/30 px-5 py-4 backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/50 ring-1 ring-border/50">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {userEmails[member.user_id] ?? member.user_id.slice(0, 8) + "..."}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {member.role === "owner" ? (
                        <Shield className="h-3 w-3 text-amber-400" />
                      ) : (
                        <Shield className="h-3 w-3 text-muted-foreground" />
                      )}
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>
              {member.role !== "owner" && currentUserId !== member.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeMember.mutate({
                      workspaceId,
                      userId: member.user_id,
                    })
                  }
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/50 ring-1 ring-border/50 mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">No members</h3>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Invite members to collaborate on this workspace.
          </p>
        </div>
      )}
    </div>
  )
}
