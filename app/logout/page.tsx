"use client"

import { useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function signOutUser() {
      await supabase.auth.signOut()
      router.push("/login")
    }

    signOutUser()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Logging out...</p>
    </div>
  )
} 