"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    // Trigger the password reset email
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "/login", // Customize the redirect URL as needed
    })

    if (error) {
      toast({
        title: "Reset Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Reset Email Sent",
        description: "Check your email for further instructions.",
      })
      router.push("/login")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
      <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-primary text-primary-foreground p-2">
          Reset Password
        </button>
      </form>
    </div>
  )
} 