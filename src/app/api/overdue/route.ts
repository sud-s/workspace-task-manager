import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { project_id } = await request.json()

    if (!project_id || typeof project_id !== "string") {
      return NextResponse.json(
        { error: "project_id is required" },
        { status: 400 },
      )
    }

    const today = new Date().toISOString().split("T")[0]

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        due_date,
        assignee:assignee_id (id, email, user_metadata)
      `)
      .eq("project_id", project_id)
      .eq("status", "todo")
      .not("due_date", "is", null)
      .lt("due_date", today)
      .order("due_date", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const overdue = (tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      assignee_name:
        (task.assignee as { user_metadata?: { full_name?: string } } | null)
          ?.user_metadata?.full_name ?? null,
    }))

    return NextResponse.json({ tasks: overdue })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    )
  }
}
