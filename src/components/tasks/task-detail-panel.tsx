"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
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
import type { TaskRow } from "@/lib/queries"
import type { TaskStatus } from "@/lib/constants"

type TaskDetailPanelProps = {
  taskId: string | null
  workspaceId: string
  projectId: string
  onClose: () => void
}

export function TaskDetailPanel({ taskId, workspaceId, projectId, onClose }: TaskDetailPanelProps) {
  const queryClient = useQueryClient()

  const cachedTask = taskId
    ? queryClient.getQueryData<TaskRow[]>(["tasks", projectId])?.find((t) => t.id === taskId) ?? null
    : null

  const { data: fetchedTask, isLoading, error } = useTask(taskId ?? "")

  const task = cachedTask ?? fetchedTask ?? null
  const { data: members } = useWorkspaceMembers(workspaceId)

  return (
    <Sheet open={!!taskId} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent key={taskId ?? "closed"} className="overflow-y-auto border-l border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl">
        {isLoading && !cachedTask && (
          <div className="space-y-4 pt-6">
            <Skeleton className="h-7 w-3/4 bg-zinc-800/50" />
            <Skeleton className="h-24 w-full bg-zinc-800/50" />
            <Skeleton className="h-10 w-full bg-zinc-800/50" />
            <Skeleton className="h-10 w-full bg-zinc-800/50" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 pt-6 text-center">
            <p className="text-sm text-destructive">Failed to load task</p>
            <p className="text-xs text-zinc-500">{error.message}</p>
          </div>
        )}

        {!isLoading && !error && !task && taskId && (
          <div className="pt-6 text-center">
            <p className="text-sm text-zinc-500">Task not found</p>
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
  task: TaskRow
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
    <form onSubmit={handleSave} className="flex flex-col min-h-full">
      <SheetHeader className="pb-6 border-b border-zinc-800/50">
        <SheetTitle className="text-lg text-zinc-100">Edit Task</SheetTitle>
        <SheetDescription className="text-xs text-zinc-500">
          Created {formatDate(task.created_at)}
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-5 py-6">
        <div className="space-y-2">
          <Label htmlFor="detail-title" className="text-xs font-medium text-zinc-400">Title</Label>
          <Input
            id="detail-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail-description" className="text-xs font-medium text-zinc-400">Description</Label>
          <Textarea
            id="detail-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20 resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-zinc-400">Status</Label>
          <TaskStatusSelect
            value={status}
            onChange={(s) => setStatus(s)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail-assignee" className="text-xs font-medium text-zinc-400">Assignee</Label>
          <select
            id="detail-assignee"
            value={assigneeId ?? ""}
            onChange={(e) => setAssigneeId(e.target.value || null)}
            className="flex h-10 w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-100 shadow-sm transition-colors focus:outline-none focus:border-emerald-500/30 focus:ring-1 focus:ring-emerald-500/20"
          >
            <option value="">Unassigned</option>
            {members?.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.user_id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="detail-due-date" className="text-xs font-medium text-zinc-400">Due Date</Label>
          <Input
            id="detail-due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border-zinc-800 bg-zinc-900/50 text-zinc-100 focus:border-emerald-500/30 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <SheetFooter className="border-t border-zinc-800/50 pt-4">
        {hasChanges && (
          <Button type="button" variant="ghost" onClick={handleCancel} className="text-zinc-400 hover:text-zinc-200">
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={!hasChanges || updateTask.isPending || !title.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          {updateTask.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </SheetFooter>
    </form>
  )
}
