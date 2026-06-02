"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectCardProps {
  id: string
  workspaceId: string
  name: string
  taskCounts: {
    todo: number
    in_progress: number
    done: number
  }
}

export function ProjectCard({ id, workspaceId, name, taskCounts }: ProjectCardProps) {
  const totalTasks = taskCounts.todo + taskCounts.in_progress + taskCounts.done

  return (
    <Link href={`/${workspaceId}/projects/${id}`}>
      <Card className="group transition-colors hover:bg-accent/50 cursor-pointer h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{name}</CardTitle>
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {taskCounts.todo > 0 && (
              <Badge variant="todo" className="text-xs">
                {taskCounts.todo} todo
              </Badge>
            )}
            {taskCounts.in_progress > 0 && (
              <Badge variant="in_progress" className="text-xs">
                {taskCounts.in_progress} in progress
              </Badge>
            )}
            {taskCounts.done > 0 && (
              <Badge variant="done" className="text-xs">
                {taskCounts.done} done
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ProjectCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-1/3 mb-3" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </CardContent>
    </Card>
  )
}
