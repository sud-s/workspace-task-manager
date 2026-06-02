"use client"

import { useState, type ReactNode } from "react"
import { useCreateProject } from "@/hooks/use-projects"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type CreateProjectDialogProps = {
  workspaceId: string
  children?: ReactNode
}

export function CreateProjectDialog({ workspaceId, children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const createProject = useCreateProject()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !workspaceId) return

    try {
      await createProject.mutateAsync({ workspaceId, name: name.trim() })
      setName("")
      setOpen(false)
    } catch {
      // error handled by mutation
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50">
            + New Project
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="border-zinc-800 bg-zinc-950">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Create Project</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Add a new project to this workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-xs font-medium text-zinc-400">Name</Label>
            <Input
              id="project-name"
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            disabled={!name.trim() || createProject.isPending || !workspaceId}
          >
            {createProject.isPending ? "Creating..." : "Create Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
