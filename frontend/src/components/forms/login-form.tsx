"use client"

import { useState } from "react"
import { Mail, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { setAuth } from "@/lib/auth"

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)
    const data: LoginFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || errorData.message || "Login failed")
      }

      // Handle successful login
      const responseData = await response.json()
      
      console.log("Login response:", responseData)
      
      // Store JWT token and user data in localStorage
      if (responseData.token && responseData.user) {
        setAuth(responseData.token, responseData.user)
        console.log("User role:", responseData.user.role)
        
        // Redirect based on user role
        if (responseData.user.role === "TUTOR") {
          console.log("Redirecting to tutor dashboard")
          router.replace("/dashboard/tutor")
        } else {
          console.log("Redirecting to tourist dashboard")
          router.replace("/dashboard/tourist")
        }
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Email"
            name="email"
            type="email"
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Password"
            name="password"
            type="password"
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white rounded-full py-3 text-2xl font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-[#838383]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-black hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  )
}