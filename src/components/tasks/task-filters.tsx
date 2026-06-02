"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useWorkspaceMembers } from "@/hooks/use-members"
import { TASK_STATUS_LABELS } from "@/lib/constants"
import type { TaskStatus } from "@/lib/constants"

type TaskFiltersProps = {
  workspaceId: string
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
      {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
        ([status, label]) => {
          const isActive = currentStatus.includes(status)
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? status === "todo"
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                    : status === "in_progress"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {label}
            </button>
          )
        },
      )}

      <select
        value={currentAssignee}
        onChange={(e) => setFilter("assignee", e.target.value)}
        className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
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
          className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
