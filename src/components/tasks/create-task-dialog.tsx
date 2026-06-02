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
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="border-zinc-800 bg-zinc-950">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Create Task</DialogTitle>
            <DialogDescription className="text-zinc-500">Add a new task to this project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-task-title" className="text-xs font-medium text-zinc-400">Title</Label>
              <Input
                id="create-task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-task-description" className="text-xs font-medium text-zinc-400">Description</Label>
              <Textarea
                id="create-task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                rows={3}
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20 resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-medium text-zinc-400">Assignee</Label>
              <TaskAssigneeSelect
                workspaceId={workspaceId}
                value={assigneeId}
                onChange={setAssigneeId}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-task-due-date" className="text-xs font-medium text-zinc-400">Due Date</Label>
              <Input
                id="create-task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border-zinc-800 bg-zinc-900/50 text-zinc-100 focus:border-emerald-500/30 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-200">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || createTask.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {createTask.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
