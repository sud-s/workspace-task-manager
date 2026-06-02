"use client"

import { useRef } from "react"
import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
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
  const cardRef = useRef<HTMLDivElement>(null)
  const totalTasks = taskCounts.todo + taskCounts.in_progress + taskCounts.done
  const donePercent = totalTasks > 0 ? Math.round((taskCounts.done / totalTasks) * 100) : 0

  function handleMouseMove(e: React.MouseEvent) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)"
  }

  return (
    <Link href={`/${workspaceId}/projects/${id}`}>
      <Card
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full cursor-pointer overflow-hidden border-zinc-800/60 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 transition-all duration-200 hover:border-zinc-700/80"
        style={{ transformStyle: "preserve-3d", transition: "transform 0.1s ease-out" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute -inset-px rounded-xl bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 opacity-0 transition-all duration-300 group-hover:from-emerald-500/10 group-hover:via-emerald-500/5 group-hover:to-transparent group-hover:opacity-100" />
        <CardHeader className="pb-3 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 ring-1 ring-emerald-500/20 group-hover:ring-emerald-500/30 transition-all">
                <Layers className="h-4 w-4 text-emerald-400" />
              </div>
              <CardTitle className="text-sm font-semibold text-zinc-100">
                {name}
              </CardTitle>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-600 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-emerald-400 group-hover:translate-x-0.5" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
            </span>
            <span className="text-xs text-zinc-600">{donePercent}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800/80">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out"
              style={{ width: `${donePercent}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {taskCounts.todo > 0 && (
              <Badge variant="todo" className="text-[10px] px-2 py-0.5 font-medium">
                {taskCounts.todo} todo
              </Badge>
            )}
            {taskCounts.in_progress > 0 && (
              <Badge variant="in_progress" className="text-[10px] px-2 py-0.5 font-medium">
                {taskCounts.in_progress} in-progress
              </Badge>
            )}
            {taskCounts.done > 0 && (
              <Badge variant="done" className="text-[10px] px-2 py-0.5 font-medium">
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
