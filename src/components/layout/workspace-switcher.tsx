"use client"

import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Layers, Plus } from "lucide-react"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { useState } from "react"

export function WorkspaceSwitcher() {
  const { data: workspaces, isLoading } = useWorkspaces()
  const currentWorkspaceId = useWorkspaceStore((s) => s.currentWorkspaceId)
  const setCurrentWorkspaceId = useWorkspaceStore((s) => s.setCurrentWorkspaceId)
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState(false)

  const activeWorkspace = workspaces?.find(
    (w) => w.id === (currentWorkspaceId ?? params.workspaceId),
  )

  function handleSelect(workspaceId: string) {
    setCurrentWorkspaceId(workspaceId)
    setOpen(false)
    router.push(`/${workspaceId}`)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/50 hover:text-zinc-100"
          >
            <div className="flex items-center gap-2 truncate">
              <Layers className="h-4 w-4 shrink-0 text-emerald-400" />
              <span className="truncate text-zinc-300">
                {isLoading
                  ? "Loading..."
                  : activeWorkspace?.name ?? "Select workspace"}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 text-zinc-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2 border-zinc-800 bg-zinc-900" align="start">
          <div className="space-y-1">
            <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Workspaces
            </p>
            {workspaces?.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleSelect(workspace.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  activeWorkspace?.id === workspace.id
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    activeWorkspace?.id === workspace.id
                      ? "opacity-100 text-emerald-400"
                      : "opacity-0",
                  )}
                />
                <span className="truncate">{workspace.name}</span>
              </button>
            ))}
            <div className="border-t border-zinc-800 pt-2 mt-2">
              <CreateWorkspaceDialog>
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200">
                  <Plus className="h-4 w-4" />
                  New Workspace
                </button>
              </CreateWorkspaceDialog>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
