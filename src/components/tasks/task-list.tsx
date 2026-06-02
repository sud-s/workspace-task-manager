"use client"

import { useTasks } from "@/hooks/use-tasks"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { TaskItem } from "./task-item"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskFilters as TaskFiltersType } from "@/lib/queries"

type TaskListProps = {
  projectId: string
  workspaceId: string
  filters?: TaskFiltersType
  onTaskClick: (taskId: string) => void
}

export function TaskList({ projectId, filters, onTaskClick }: TaskListProps) {
  const { data: tasks, isLoading, error } = useTasks(projectId, filters)

  useRealtimeTasks(projectId)

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-8 text-center">
        <p className="text-sm text-destructive">Failed to load tasks</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-lg border border-dashed px-4 py-12 text-center">
        <p className="text-sm font-medium text-muted-foreground">No tasks yet</p>
        <p className="text-xs text-muted-foreground">
          Create a task to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id)}
        />
      ))}
    </div>
  )
}
