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
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">U</AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
