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
      <SelectTrigger className="w-full border-zinc-800 bg-zinc-900/50 text-zinc-100">
        <SelectValue placeholder="Assign to..." />
      </SelectTrigger>
      <SelectContent className="border-zinc-800 bg-zinc-900 text-zinc-100">
        <SelectItem value="unassigned" className="focus:bg-zinc-800 focus:text-white">Unassigned</SelectItem>
        {isLoading && (
          <SelectItem value="loading" disabled className="text-zinc-500">
            Loading members...
          </SelectItem>
        )}
        {members?.map((member) => (
          <SelectItem key={member.user_id} value={member.user_id} className="focus:bg-zinc-800 focus:text-white">
            {member.user_id.slice(0, 8)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
