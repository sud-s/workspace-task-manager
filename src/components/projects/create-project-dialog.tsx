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
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children ? (
        <DialogTrigger asChild>{children}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="w-full border-border bg-card/50 text-muted-foreground hover:text-card-foreground hover:bg-accent/50">
            + New Project
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Create Project</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new project to this workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-xs font-medium text-muted-foreground">Name</Label>
            <Input
              id="project-name"
              placeholder="My Project"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
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
