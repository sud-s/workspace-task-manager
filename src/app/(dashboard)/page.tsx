"use client"

import { useWorkspaces } from "@/hooks/use-workspaces"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"

export default function DashboardPage() {
  const router = useRouter()
  const { data: workspaces, isLoading } = useWorkspaces()

  useEffect(() => {
    if (workspaces && workspaces.length > 0) {
      router.push(`/${workspaces[0].id}`)
    }
  }, [workspaces, router])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h2 className="text-2xl font-semibold tracking-tight">Welcome to Gize</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Get started by creating your first workspace.
      </p>
      <div className="mt-6">
        <CreateWorkspaceDialog />
      </div>
    </div>
  )
}
