"use client"

import { useState } from "react"
import { User, Phone, MapPin, Mail, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter } from "next/navigation"

type UserRole = "TOURIST" | "TUTOR"

interface SignUpFormData {
  name: string
  phone: string
  country: string
  email: string
  password: string
  role: UserRole
}

export function SignUpForm() {
  const [role, setRole] = useState<UserRole>("TOURIST")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    const formData = new FormData(event.currentTarget)
    const data: SignUpFormData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: role,
    }

    try {
      const response = await fetch("http://localhost:3000/api/auth/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Signup failed")
      }

      setSuccess(true)
      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        router.push("/auth/login")
      }, 1500)
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
      {success && (
        <div className="mb-4 p-3 rounded bg-green-50 text-green-600 text-sm">
          Account created successfully! Redirecting to login...
        </div>
      )}
      
      {/* User Type Selection */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setRole("TOURIST")}
          className={`flex-1 h-[45px] rounded-[20px] border border-[#838383] font-medium text-xl transition-colors ${
            role === "TOURIST"
              ? "bg-white text-black"
              : "bg-transparent text-black/60"
          }`}
        >
          Tourist
        </button>
        <button
          type="button"
            onClick={() => setRole("TUTOR")}
          className={`flex-1 h-[45px] rounded-[20px] border border-[#838383] font-medium text-xl transition-colors ${
            role === "TUTOR" ? "bg-black text-white" : "bg-transparent text-black/60"
          }`}
        >
          Tutor
        </button>
      </div>

      {/* Form Fields */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Name"
            name="name"
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Phone"
            name="phone"
            type="tel"
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
              placeholder="Country"
            name="country"
            className="pl-10"
            required
            disabled={isLoading}
          />
        </div>

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
          {isLoading ? "Signing up..." : "Let's Start"}
        </button>

        <p className="text-center text-[#838383]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-black hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  )
}