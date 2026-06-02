"use client"

import { useState } from "react"
import { useUser } from "@/hooks/use-user"
import { updateProfileAction, updatePasswordAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Calendar, KeyRound, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const { data: user, isLoading } = useUser()
  const [name, setName] = useState("")
  const [profileState, setProfileState] = useState<{
    submitting: boolean
    message: string | null
    error: string | null
  }>({ submitting: false, message: null, error: null })
  const [password, setPassword] = useState("")
  const [passwordState, setPasswordState] = useState<{
    submitting: boolean
    message: string | null
    error: string | null
  }>({ submitting: false, message: null, error: null })

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48 bg-accent" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 bg-accent rounded-xl" />
          <Skeleton className="h-64 bg-accent rounded-xl" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted-foreground">Could not load user profile.</p>
      </div>
    )
  }

  const displayName = (user.user_metadata?.name as string) ?? ""
  const email = user.email ?? ""
  const createdAt = user.created_at ?? ""

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setProfileState({ submitting: true, message: null, error: null })

    const formData = new FormData()
    formData.set("name", name.trim())

    const result = await updateProfileAction(formData)

    if (result.error) {
      setProfileState({ submitting: false, error: result.error, message: null })
    } else {
      setProfileState({ submitting: false, message: "Profile updated", error: null })
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password || password.length < 6) return

    setPasswordState({ submitting: true, message: null, error: null })

    const formData = new FormData()
    formData.set("password", password)

    const { error } = await updatePasswordAction(formData)

    if (error) {
      setPasswordState({ submitting: false, error, message: null })
    } else {
      setPasswordState({ submitting: false, message: "Password updated", error: null })
      setPassword("")
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-card/40 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-card-foreground">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-email" className="text-xs font-medium text-muted-foreground">Email</Label>
              <div className="flex h-10 w-full items-center rounded-lg border border-border bg-card/50 px-3 text-sm text-muted-foreground">
                <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground/60" />
                {email}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-name" className="text-xs font-medium text-muted-foreground">Display Name</Label>
              <Input
                id="profile-name"
                defaultValue={displayName}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Member since</Label>
              <div className="flex h-10 w-full items-center rounded-lg border border-border bg-card/50 px-3 text-sm text-muted-foreground">
                <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground/60" />
                {createdAt ? formatDate(createdAt) : "Unknown"}
              </div>
            </div>

            {profileState.message && (
              <p className="text-xs text-emerald-400">{profileState.message}</p>
            )}
            {profileState.error && (
              <p className="text-xs text-red-400">{profileState.error}</p>
            )}

            <Button
              type="submit"
              disabled={profileState.submitting || !name.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {profileState.submitting ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </form>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/40 p-6">
          <div className="flex items-center gap-2 mb-5">
            <KeyRound className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-card-foreground">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-password" className="text-xs font-medium text-muted-foreground">
                New Password
              </Label>
              <Input
                id="profile-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="border-border bg-card/50 text-card-foreground placeholder:text-muted-foreground focus:border-emerald-500/30 focus:ring-emerald-500/20"
              />
            </div>

            {passwordState.message && (
              <p className="text-xs text-emerald-400">{passwordState.message}</p>
            )}
            {passwordState.error && (
              <p className="text-xs text-red-400">{passwordState.error}</p>
            )}

            <Button
              type="submit"
              disabled={passwordState.submitting || password.length < 6}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {passwordState.submitting ? (
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              ) : null}
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
