"use client"

import { useWorkspaceMembers } from "@/hooks/use-members"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TaskAssigneeSelectProps = {
  workspaceId: string
  value: string | null
  onChange: (assigneeId: string | null) => void
}

export function TaskAssigneeSelect({ workspaceId, value, onChange }: TaskAssigneeSelectProps) {
  const { data: members, isLoading } = useWorkspaceMembers(workspaceId)

  return (
    <Select
      value={value ?? "unassigned"}
      onValueChange={(v) => onChange(v === "unassigned" ? null : v)}
    >
      <SelectTrigger className="w-full border-border bg-card/50 text-card-foreground">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent className="border-border bg-card text-card-foreground">
        <SelectItem value="unassigned" className="focus:bg-accent focus:text-accent-foreground">Unassigned</SelectItem>
        {isLoading && (
          <SelectItem value="loading" disabled className="text-muted-foreground">
            Loading members...
          </SelectItem>
        )}
        {members?.map((member) => (
          <SelectItem key={member.user_id} value={member.user_id} className="focus:bg-accent focus:text-accent-foreground">
            {member.user_id.slice(0, 8)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
