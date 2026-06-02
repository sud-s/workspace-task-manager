"use client"

import { useRouter } from "next/navigation"
import { useSupabase } from "@/providers/supabase-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function UserNav() {
  const supabase = useSupabase()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8 ring-2 ring-zinc-800 ring-offset-2 ring-offset-background">
        <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold">
          U
        </AvatarFallback>
      </Avatar>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSignOut}
        title="Sign out"
        className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
