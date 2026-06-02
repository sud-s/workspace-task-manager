"use client"

import { useParams, useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Layers } from "lucide-react"
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
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2 truncate">
              <Layers className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {isLoading
                  ? "Loading..."
                  : activeWorkspace?.name ?? "Select workspace"}
              </span>
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          <div className="space-y-1">
            <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              Workspaces
            </p>
            {workspaces?.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleSelect(workspace.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                  activeWorkspace?.id === workspace.id && "bg-accent",
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    activeWorkspace?.id === workspace.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {workspace.name}
              </button>
            ))}
            <div className="border-t pt-1 mt-1">
              <CreateWorkspaceDialog />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
