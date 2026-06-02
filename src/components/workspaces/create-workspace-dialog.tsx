"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateWorkspace } from "@/hooks/use-workspaces"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface CreateWorkspaceDialogProps {
  children?: ReactNode
}

export function CreateWorkspaceDialog({ children }: CreateWorkspaceDialogProps) {
  const router = useRouter()
  const createWorkspace = useCreateWorkspace()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const workspace = await createWorkspace.mutateAsync(name.trim())
      setName("")
      setOpen(false)
      router.push(`/${workspace.id}`)
    } catch {
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="border-border bg-card">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Create workspace</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Create a new workspace to organize your projects and tasks.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name-ws" className="text-xs font-medium text-muted-foreground">Name</Label>
              <Input
                id="name-ws"
                placeholder="My Workspace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={createWorkspace.isPending}
                autoFocus
                className="border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={createWorkspace.isPending}
              className="text-muted-foreground hover:text-card-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || createWorkspace.isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {createWorkspace.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
