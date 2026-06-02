import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2"
import type { Database } from "../../../src/lib/supabase/types.ts"

Deno.serve(async (req: Request) => {
  try {
    const { project_id } = await req.json()

    if (!project_id || typeof project_id !== "string") {
      return new Response(JSON.stringify({ error: "project_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    const today = new Date().toISOString().split("T")[0]

    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        due_date,
        assignee:assignee_id (user_metadata)
      `)
      .eq("project_id", project_id)
      .eq("status", "todo")
      .not("due_date", "is", null)
      .lt("due_date", today)
      .order("due_date", { ascending: true })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const overdue = (tasks ?? []).map((task) => ({
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      assignee_name:
        (task.assignee as { user_metadata?: { full_name?: string } } | null)
          ?.user_metadata?.full_name ?? null,
    }))

    return new Response(JSON.stringify({ tasks: overdue }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
})
