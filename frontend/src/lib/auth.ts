export interface User {
  id: string
  email: string
  name: string
  phone: string
  country: string
  role: "TOURIST" | "TUTOR"
  createdAt: string
  updatedAt: string
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("token")
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  
  try {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null
    return JSON.parse(userStr) as User
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getUser() !== null
}

export function isTutor(): boolean {
  const user = getUser()
  return user?.role === "TUTOR"
}

export function isTourist(): boolean {
  const user = getUser()
  return user?.role === "TOURIST"
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export function setAuth(token: string, user: User) {
  if (typeof window === "undefined") return
  localStorage.setItem("token", token)
  localStorage.setItem("user", JSON.stringify(user))
}
