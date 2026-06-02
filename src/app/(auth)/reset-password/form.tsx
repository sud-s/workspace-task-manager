"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updatePasswordAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData()
    formData.set("password", password)
    const result = await updatePasswordAction(formData)

    setLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      router.push("/login?reset=success")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-medium text-zinc-400">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          autoFocus
          className="border-zinc-800 bg-zinc-900/50 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500/30 focus:ring-emerald-500/20"
        />
        <p className="text-xs text-zinc-600">At least 6 characters</p>
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
      <Button
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  )
}
