"use client"

import { useState, type FormEvent } from "react"
import { useCreateTask } from "@/hooks/use-tasks"
import { useWorkspaceMembers } from "@/hooks/use-members"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { TaskAssigneeSelect } from "./task-assignee-select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

type CreateTaskDialogProps = {
  projectId: string
  workspaceId: string
}

export function CreateTaskDialog({ projectId, workspaceId }: CreateTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assigneeId, setAssigneeId] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState("")

  const createTask = useCreateTask()

  useWorkspaceMembers(workspaceId)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim()) return

    createTask.mutate(
      {
        projectId,
        data: {
          title: title.trim(),
          description,
          assignee_id: assigneeId,
          due_date: dueDate || null,
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          setTitle("")
          setDescription("")
          setAssigneeId(null)
          setDueDate("")
        },
        onError: () => {
          // error handled by React Query
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Add a new task to this project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-task-title">Title</Label>
              <Input
                id="create-task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-task-description">Description</Label>
              <Textarea
                id="create-task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Assignee</Label>
              <TaskAssigneeSelect
                workspaceId={workspaceId}
                value={assigneeId}
                onChange={setAssigneeId}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-task-due-date">Due Date</Label>
              <Input
                id="create-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || createTask.isPending}>
              {createTask.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
