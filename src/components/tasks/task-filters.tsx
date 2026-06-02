"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useWorkspaceMembers } from "@/hooks/use-members"
import { TASK_STATUS_LABELS } from "@/lib/constants"
import type { TaskStatus } from "@/lib/constants"
import { ListFilter, X } from "lucide-react"

type TaskFiltersProps = {
  workspaceId: string
}

const statusStyles: Record<TaskStatus, { active: string; inactive: string }> = {
  todo: {
    active: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    inactive: "bg-accent/50 text-muted-foreground border-border/50 hover:border-border/50 hover:text-card-foreground",
  },
  in_progress: {
    active: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    inactive: "bg-accent/50 text-muted-foreground border-border/50 hover:border-border/50 hover:text-card-foreground",
  },
  done: {
    active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    inactive: "bg-accent/50 text-muted-foreground border-border/50 hover:border-border/50 hover:text-card-foreground",
  },
}

export function TaskFilters({ workspaceId }: TaskFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: members } = useWorkspaceMembers(workspaceId)

  const currentStatus = searchParams.get("status")?.split(",").filter(Boolean) ?? []
  const currentAssignee = searchParams.get("assignee") ?? ""

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function toggleStatus(status: TaskStatus) {
    const next = currentStatus.includes(status)
      ? currentStatus.filter((s) => s !== status)
      : [...currentStatus, status]
    setFilter("status", next.join(","))
  }

  const hasFilters = currentStatus.length > 0 || currentAssignee !== ""

  function clearFilters() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <ListFilter className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
      {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
        ([status, label]) => {
          const isActive = currentStatus.includes(status)
          const styles = statusStyles[status]
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isActive ? styles.active : styles.inactive
              }`}
            >
              <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                status === "todo" ? "bg-amber-400" : status === "in_progress" ? "bg-blue-400" : "bg-emerald-400"
              }`} />
              {label}
            </button>
          )
        },
      )}

      <select
        value={currentAssignee}
        onChange={(e) => setFilter("assignee", e.target.value)}
        className="h-7 rounded-lg border border-border/50 bg-accent/50 px-2 text-xs text-muted-foreground shadow-sm focus:outline-none focus:border-border/50 hover:border-border/50 transition-colors"
      >
        <option value="">All Assignees</option>
        {members?.map((member) => (
          <option key={member.user_id} value={member.user_id}>
            {member.user_id.slice(0, 8)}
          </option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-card-foreground transition-colors"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  )
}
