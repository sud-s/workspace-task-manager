"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { useTasks } from "@/hooks/use-tasks"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { useUpdateTaskStatus } from "@/hooks/use-tasks"
import { TaskDetailPanel } from "./task-detail-panel"
import { Skeleton } from "@/components/ui/skeleton"
import { TASK_STATUS_LABELS } from "@/lib/constants"
import type { TaskFilters as TaskFiltersType } from "@/lib/queries"
import type { TaskRow } from "@/lib/queries"
import type { TaskStatus } from "@/lib/constants"

const COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"]

function KanbanCard({ task, isDragging }: { task: TaskRow; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`rounded-lg border bg-card px-3 py-2.5 text-sm cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging
          ? "shadow-xl border-emerald-500/50 opacity-90 z-50"
          : "border-border hover:border-zinc-600 shadow-sm"
      }`}
      style={style}
    >
      <p className="font-medium text-card-foreground truncate">{task.title}</p>
      {task.due_date && (
        <p className="mt-1 text-xs text-muted-foreground">
          {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

function Column({
  status,
  tasks,
  onTaskClick,
}: {
  status: TaskStatus
  tasks: TaskRow[]
  onTaskClick: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border bg-card/50 p-3 transition-colors ${
        isOver ? "border-emerald-500/50 bg-emerald-500/5" : "border-border"
      }`}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {TASK_STATUS_LABELS[status]}
        </h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-[200px]">
        {tasks.map((task) => (
          <div key={task.id} onClick={() => onTaskClick(task.id)}>
            <KanbanCard task={task} />
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground py-8">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}

type TaskBoardProps = {
  projectId: string
  workspaceId: string
  filters?: TaskFiltersType
}

export function TaskBoard({ projectId, workspaceId, filters }: TaskBoardProps) {
  const { data: tasks, isLoading, error } = useTasks(projectId, filters)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [activeTask, setActiveTask] = useState<TaskRow | null>(null)
  const updateStatus = useUpdateTaskStatus()

  useRealtimeTasks(projectId)

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {COLUMNS.map((status) => (
          <div key={status} className="space-y-3">
            <Skeleton className="h-5 w-24 bg-zinc-800/50" />
            <Skeleton className="h-24 w-full bg-zinc-800/50" />
            <Skeleton className="h-24 w-full bg-zinc-800/50" />
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

  const tasksByStatus: Record<TaskStatus, TaskRow[]> = {
    todo: [],
    in_progress: [],
    done: [],
  }
  for (const task of tasks ?? []) {
    tasksByStatus[task.status].push(task)
  }

  function handleDragStart(event: DragStartEvent) {
    const task = event.active.data.current?.task as TaskRow | undefined
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const task = active.data.current?.task as TaskRow | undefined
    if (!task) return

    const newStatus = over.id as TaskStatus
    if (newStatus === task.status) return
    if (!COLUMNS.includes(newStatus)) return

    updateStatus.mutate({ taskId: task.id, status: newStatus, projectId })
  }

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto pb-2 lg:pb-0 snap-x snap-mandatory">
          {COLUMNS.map((status) => (
            <div key={status} className="min-w-[280px] lg:min-w-0 snap-start">
              <Column
                status={status}
                tasks={tasksByStatus[status]}
                onTaskClick={setSelectedTaskId}
              />
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      <TaskDetailPanel
        taskId={selectedTaskId}
        workspaceId={workspaceId}
        projectId={projectId}
        onClose={() => setSelectedTaskId(null)}
      />
    </>
  )
}
