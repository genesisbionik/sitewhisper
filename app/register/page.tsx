"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    // Sign up the user via Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      toast({
        title: "Registration Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Registration Successful",
        description: "Check your email for a confirmation link.",
      })
      // Optionally redirect to login after registration
      router.push("/login")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-primary text-primary-foreground p-2">
          Register
        </button>
      </form>
    </div>
  )
} 