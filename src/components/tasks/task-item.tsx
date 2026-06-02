"use client"

import type { TaskRow } from "@/lib/queries"
import { TaskStatusSelect } from "./task-status-select"
import { useUpdateTaskStatus } from "@/hooks/use-tasks"
import { formatDate } from "@/lib/utils"

type TaskItemProps = {
  task: TaskRow
  onClick: () => void
}

export function TaskItem({ task, onClick }: TaskItemProps) {
  const updateStatus = useUpdateTaskStatus()

  function handleStatusChange(status: "todo" | "in_progress" | "done") {
    updateStatus.mutate({
      taskId: task.id,
      status,
      projectId: task.project_id,
    })
  }

  return (
    <div
      className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-accent/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
        {task.due_date && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Due {formatDate(task.due_date)}
          </p>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <TaskStatusSelect value={task.status} onChange={handleStatusChange} />
      </div>

      {task.assignee_id && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {task.assignee_id.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}
