"use client"

import { useQuery } from "@tanstack/react-query"
import type { UseQueryResult } from "@tanstack/react-query"
import { useSupabase } from "@/providers/supabase-provider"
import type { User } from "@supabase/supabase-js"

export function useUser(): UseQueryResult<User | null> {
  const supabase = useSupabase()

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    },
    staleTime: 5 * 60 * 1000,
  })
}
