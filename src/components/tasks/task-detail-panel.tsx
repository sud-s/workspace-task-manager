"use client"

import { useState } from "react"
import { useTask, useUpdateTask } from "@/hooks/use-tasks"
import { useWorkspaceMembers } from "@/hooks/use-members"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaskStatusSelect } from "./task-status-select"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/utils"
import type { TaskStatus } from "@/lib/constants"

type TaskDetailPanelProps = {
  taskId: string | null
  workspaceId: string
  onClose: () => void
}

export function TaskDetailPanel({ taskId, workspaceId, onClose }: TaskDetailPanelProps) {
  const { data: task, isLoading, error } = useTask(taskId ?? "")
  const { data: members } = useWorkspaceMembers(workspaceId)

  return (
    <Sheet open={!!taskId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent key={taskId ?? "closed"} className="overflow-y-auto">
        {isLoading && (
          <div className="space-y-4 pt-6">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 pt-6 text-center">
            <p className="text-sm text-destructive">Failed to load task</p>
            <p className="text-xs text-muted-foreground">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && !task && taskId && (
          <div className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Task not found</p>
          </div>
        )}

        {task && (
          <TaskDetailForm
            task={task}
            members={members}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

type TaskDetailFormProps = {
  task: {
    id: string
    project_id: string
    title: string
    description: string
    status: TaskStatus
    assignee_id: string | null
    due_date: string | null
    created_at: string
  }
  members?: Array<{ user_id: string; role: string }>
}

function TaskDetailForm({ task, members }: TaskDetailFormProps) {
  const updateTask = useUpdateTask()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? "")
  const [status, setStatus] = useState<TaskStatus>(task.status)
  const [assigneeId, setAssigneeId] = useState<string | null>(task.assignee_id)
  const [dueDate, setDueDate] = useState(task.due_date ?? "")

  const hasChanges =
    title !== task.title ||
    description !== (task.description ?? "") ||
    status !== task.status ||
    assigneeId !== task.assignee_id ||
    dueDate !== (task.due_date ?? "")

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim()) return

    updateTask.mutate({
      taskId: task.id,
      data: {
        title: title.trim(),
        description,
        status,
        assignee_id: assigneeId,
        due_date: dueDate || null,
      },
    })
  }

  function handleCancel() {
    setTitle(task.title)
    setDescription(task.description ?? "")
    setStatus(task.status)
    setAssigneeId(task.assignee_id)
    setDueDate(task.due_date ?? "")
  }

  return (
    <form onSubmit={handleSave}>
      <SheetHeader>
        <SheetTitle>Task Details</SheetTitle>
        <SheetDescription>
          Created {formatDate(task.created_at)}
        </SheetDescription>
      </SheetHeader>

      <div className="grid gap-4 py-6">
        <div className="grid gap-2">
          <Label htmlFor="detail-title">Title</Label>
          <Input
            id="detail-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="detail-description">Description</Label>
          <Textarea
            id="detail-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="grid gap-2">
          <Label>Status</Label>
          <TaskStatusSelect
            value={status}
            onChange={(s) => setStatus(s)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="detail-assignee">Assignee</Label>
          <select
            id="detail-assignee"
            value={assigneeId ?? ""}
            onChange={(e) => setAssigneeId(e.target.value || null)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Unassigned</option>
            {members?.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.user_id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="detail-due-date">Due Date</Label>
          <Input
            id="detail-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <SheetFooter>
        {hasChanges && (
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!hasChanges || updateTask.isPending || !title.trim()}>
          {updateTask.isPending ? "Saving..." : "Save"}
        </Button>
      </SheetFooter>
    </form>
  )
}
