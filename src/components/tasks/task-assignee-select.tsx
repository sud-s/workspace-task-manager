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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {isLoading && (
          <SelectItem value="loading" disabled>
            Loading members...
          </SelectItem>
        )}
        {members?.map((member) => (
          <SelectItem key={member.user_id} value={member.user_id}>
            {member.user_id.slice(0, 8)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
