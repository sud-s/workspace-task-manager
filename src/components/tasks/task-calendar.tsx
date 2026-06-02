"use client"

import { useState, useMemo } from "react"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTasks } from "@/hooks/use-tasks"
import { useRealtimeTasks } from "@/hooks/use-realtime-tasks"
import { TaskDetailPanel } from "./task-detail-panel"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { TaskFilters as TaskFiltersType } from "@/lib/queries"
import type { TaskRow } from "@/lib/queries"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type TaskCalendarProps = {
  projectId: string
  workspaceId: string
  filters?: TaskFiltersType
}

export function TaskCalendar({ projectId, workspaceId, filters }: TaskCalendarProps) {
  const { data: tasks, isLoading, error } = useTasks(projectId, filters)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)

  useRealtimeTasks(projectId)

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart)
    const calEnd = endOfWeek(monthEnd)
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  const tasksByDate = useMemo(() => {
    const map = new Map<string, TaskRow[]>()
    for (const task of tasks ?? []) {
      if (!task.due_date) continue
      const key = format(new Date(task.due_date), "yyyy-MM-dd")
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(task)
    }
    return map
  }, [tasks])

  const selectedDateTasks = selectedDate
    ? tasks?.filter(
        (t) => t.due_date && isSameDay(new Date(t.due_date), selectedDate),
      ) ?? []
    : []

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-48 bg-zinc-800/50" />
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full bg-zinc-800/50" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 px-4 py-8 text-center">
        <p className="text-sm text-destructive">Failed to load tasks</p>
        <p className="text-xs text-muted-foreground">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-card-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
              )
            }
            className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs text-muted-foreground hover:text-card-foreground h-8 px-2"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setCurrentMonth(
                (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
              )
            }
            className="h-8 w-8 text-muted-foreground hover:text-card-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 min-w-[600px] sm:min-w-0">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd")
            const dayTasks = tasksByDate.get(key) ?? []
            const inMonth = isSameMonth(day, currentMonth)
            const today = isToday(day)
            const isSelected = selectedDate && isSameDay(day, selectedDate)

            return (
              <button
                key={key}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`min-h-[60px] sm:min-h-[80px] p-1 text-left transition-colors border-b border-border hover:bg-accent/30 ${
                  !inMonth ? "opacity-30" : ""
                } ${isSelected ? "bg-accent/40 ring-1 ring-inset ring-emerald-500/30" : ""}`}
              >
                <span
                  className={`inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full text-[10px] sm:text-xs ${
                    today
                      ? "bg-emerald-500 text-white font-bold"
                      : "text-card-foreground"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <div className="mt-0.5 sm:mt-1 space-y-0.5 hidden sm:block">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className="truncate rounded bg-emerald-500/10 px-0.5 sm:px-1 py-0.5 text-[8px] sm:text-[10px] leading-tight text-emerald-400"
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-[8px] sm:text-[10px] text-muted-foreground px-1">
                        +{dayTasks.length - 2}
                      </div>
                    )}
                  </div>
                )}
                {dayTasks.length > 0 && (
                  <div className="sm:hidden flex justify-center mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && selectedDateTasks.length > 0 && (
        <div className="border-t border-border p-4 space-y-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            {format(selectedDate, "EEEE, MMMM d")}
          </h3>
          <div className="space-y-1">
            {selectedDateTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="w-full flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-accent/30 transition-colors"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="flex-1 truncate text-card-foreground">
                  {task.title}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {task.status.replace("_", " ")}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <TaskDetailPanel
        taskId={selectedTaskId}
        workspaceId={workspaceId}
        projectId={projectId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  )
}
