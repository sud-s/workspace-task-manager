"use client"

import type { TaskRow } from "@/lib/queries"
import { TaskStatusSelect } from "./task-status-select"
import { useUpdateTaskStatus } from "@/hooks/use-tasks"
import { formatDate } from "@/lib/utils"
import { Calendar, MessageSquareText } from "lucide-react"

type TaskItemProps = {
  task: TaskRow
  onClick: () => void
}

const statusConfig = {
  todo: { dot: "bg-amber-400", border: "border-l-amber-500/40" },
  in_progress: { dot: "bg-blue-400", border: "border-l-blue-500/40" },
  done: { dot: "bg-emerald-400", border: "border-l-emerald-500/40" },
}

export function TaskItem({ task, onClick }: TaskItemProps) {
  const updateStatus = useUpdateTaskStatus()
  const cfg = statusConfig[task.status]

  function handleStatusChange(status: "todo" | "in_progress" | "done") {
    updateStatus.mutate({
      taskId: task.id,
      status,
      projectId: task.project_id,
    })
  }

  return (
    <div
      className={`group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-4 py-3 transition-all duration-200 hover:bg-accent/40 hover:border-border/60 cursor-pointer border-l-2 ${cfg.border}`}
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
          <p className={`text-sm font-medium truncate ${
            task.status === "done" ? "text-muted-foreground line-through" : "text-card-foreground"
          }`}>
            {task.title}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-3 pl-3.5">
          {task.due_date && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </span>
          )}
          {task.description && (
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
              <MessageSquareText className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <TaskStatusSelect value={task.status} onChange={handleStatusChange} />
      </div>

      {task.assignee_id && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 ring-1 ring-emerald-500/20 text-[10px] font-semibold text-emerald-300 transition-all group-hover:ring-emerald-500/30">
          {task.assignee_id.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  )
}
