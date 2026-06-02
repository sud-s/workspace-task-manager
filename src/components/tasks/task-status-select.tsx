"use client"

import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TaskStatusSelectProps = {
  value: TaskStatus
  onChange: (status: TaskStatus) => void
}

const statusStyles: Record<TaskStatus, { color: string; dot: string }> = {
  todo: { color: "text-amber-400", dot: "bg-amber-400" },
  in_progress: { color: "text-blue-400", dot: "bg-blue-400" },
  done: { color: "text-emerald-400", dot: "bg-emerald-400" },
}

export function TaskStatusSelect({ value, onChange }: TaskStatusSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger className={`w-36 border-zinc-800 bg-zinc-900/50 ${statusStyles[value].color}`}>
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[value].dot}`} />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="border-zinc-800 bg-zinc-900">
        {(Object.entries(TASK_STATUS_LABELS) as [TaskStatus, string][]).map(
          ([status, label]) => (
            <SelectItem key={status} value={status} className={`${statusStyles[status].color} focus:bg-zinc-800 focus:text-white`}>
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${statusStyles[status].dot}`} />
                {label}
              </div>
            </SelectItem>
          ),
        )}
      </SelectContent>
    </Select>
  )
}
