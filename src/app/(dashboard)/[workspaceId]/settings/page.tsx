"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspace } from "@/hooks/use-workspaces"
import { useUpdateWorkspace } from "@/hooks/use-workspaces"
import { useDeleteWorkspace } from "@/hooks/use-workspaces"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings, Trash2, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

type PageProps = {
  params: Promise<{ workspaceId: string }>
}

export default function SettingsPage({ params }: PageProps) {
  const { workspaceId } = use(params)
  const router = useRouter()
  const { data: workspace, isLoading } = useWorkspace(workspaceId)
  const updateWorkspace = useUpdateWorkspace()
  const deleteWorkspace = useDeleteWorkspace()
  const [name, setName] = useState("")
  const [initialized, setInitialized] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!initialized && workspace) {
    setName(workspace.name)
    setInitialized(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    await updateWorkspace.mutateAsync({ id: workspaceId, name: name.trim() })
  }

  async function handleDelete() {
    setDeleting(true)
    await deleteWorkspace.mutateAsync(workspaceId)
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-accent" />
        <Skeleton className="h-40 w-full bg-accent rounded-xl" />
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20 mb-4">
          <Settings className="h-6 w-6 text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Workspace not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This workspace doesn&apos;t exist, was deleted, or you don&apos;t have access.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          href={`/${workspaceId}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-accent/50 transition-all shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
            Manage workspace settings
          </p>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />

      <div className="rounded-xl border border-border/60 bg-card/30 p-4 sm:p-6 backdrop-blur-sm max-w-lg">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Workspace Name</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
            />
          </div>
          <Button
            type="submit"
            disabled={updateWorkspace.isPending || !name.trim() || name === workspace.name}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-1.5" />
            {updateWorkspace.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <div className="rounded-xl border border-red-900/30 bg-red-950/20 p-6 backdrop-blur-sm max-w-lg">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-2">
          <Trash2 className="h-4 w-4" />
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Once you delete this workspace, there is no going back. All projects and tasks will be permanently removed.
        </p>
        <Button
          onClick={handleDelete}
          disabled={deleting}
          variant="ghost"
          className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20 disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete Workspace"}
        </Button>
      </div>
    </div>
  )
}
