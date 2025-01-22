"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { signIn, signUp } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      toast({
        title: "Signed in successfully",
        description: "Welcome back to SiteWhisper!",
      })
      router.push("/")
    } catch (error) {
      console.error('Error signing in:', error)
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
    }
  }

  const handleSignUp = async () => {
    try {
      await signUp(email, password)
      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      console.error('Error signing up:', error)
      toast({
        title: "Sign up failed",
        description: "An error occurred during sign up. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </div>
        </form>
        <div>
          <Button onClick={handleSignUp} variant="outline" className="w-full">
            Sign up
          </Button>
        </div>
      </div>
    </div>
  )
}

