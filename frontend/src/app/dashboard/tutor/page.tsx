"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, BookOpen, Users, Clock, LogOut, Save, X } from "lucide-react"
import Image from "next/image"
import { getToken, getUser, logout, isTutor } from "@/lib/auth"

interface Course {
  id: string
  title: string
  description: string
  category: string
  price: number
  duration: number
  maxStudents: number
  location: string
  imageUrl?: string
  createdAt: string
}

export default function TutorDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Mock data - Replace with actual API call when backend is ready
  const mockCourses: Course[] = [
    {
      id: "1",
      title: "Traditional Pottery Workshop",
      description: "Learn ancient pottery techniques from master artisans",
      category: "Arts & Crafts",
      price: 45,
      duration: 3,
      maxStudents: 12,
      location: "Kathmandu, Nepal",
      imageUrl: "/pottery.png",
      createdAt: "2024-01-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Nepalese Cooking Class",
      description: "Master authentic Nepalese recipes",
      category: "Cooking",
      price: 35,
      duration: 2,
      maxStudents: 8,
      location: "Pokhara, Nepal",
      imageUrl: "/cooking-workshop.png",
      createdAt: "2024-01-20T10:00:00Z"
    }
  ]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Arts & Crafts",
    price: "",
    duration: "",
    maxStudents: "",
    location: "",
    imageUrl: ""
  })

  const categories = ["Arts & Crafts", "Cooking", "Dance", "Tours", "Music", "Other"]

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken()
    const user = getUser()
    
    console.log("Tutor dashboard auth check:", { token: !!token, user })
    
    if (!token || !user) {
      console.log("No auth found, redirecting to login")
      router.push("/auth/login")
      return
    }

    console.log("User role:", user.role)
    if (!isTutor()) {
      console.log("Not a tutor, redirecting to tourist dashboard")
      router.push("/dashboard/tourist")
      return
    }
    
    console.log("Auth check passed, loading courses")

    // TODO: Replace with actual API call
    // const fetchMyCourses = async () => {
    //   try {
    //     const response = await fetch("http://localhost:3000/api/courses/my-courses", {
    //       headers: { "Authorization": `Bearer ${token}` }
    //     })
    //     const data = await response.json()
    //     setCourses(data)
    //   } catch (error) {
    //     console.error("Error fetching courses:", error)
    //   } finally {
    //     setLoading(false)
    //   }
    // }
    // fetchMyCourses()

    // Using mock data for now
    setTimeout(() => {
      setCourses(mockCourses)
      setLoading(false)
    }, 500)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const token = localStorage.getItem("token")

    try {
      // TODO: Replace with actual API call
      // const response = await fetch("http://localhost:3000/api/courses", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${token}`
      //   },
      //   body: JSON.stringify(formData)
      // })

      // if (!response.ok) throw new Error("Failed to create course")

      // const newCourse = await response.json()
      
      // Mock: Add new course to state
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        duration: parseFloat(formData.duration),
        maxStudents: parseInt(formData.maxStudents),
        createdAt: new Date().toISOString()
      }
      
      setCourses(prev => [newCourse, ...prev])
      setShowForm(false)
      setFormData({
        title: "",
        description: "",
        category: "Arts & Crafts",
        price: "",
        duration: "",
        maxStudents: "",
        location: "",
        imageUrl: ""
      })
    } catch (error) {
      console.error("Error creating course:", error)
      alert("Failed to create course. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const user = getUser() || { name: "" }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-black" />
              <h1 className="text-2xl font-bold font-['Playfair_Display:Medium'] text-black">
                Arogya - Tutor Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display:Medium'] mb-4">
            Share Your Expertise
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl">
            Create amazing courses and connect with students passionate about Nepali culture
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Course Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{showForm ? "Cancel" : "Create New Course"}</span>
          </button>
        </div>

        {/* Create Course Form */}
        {showForm && (
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">Course Details</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Traditional Pottery Workshop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="45"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    min="0.5"
                    step="0.5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Students *
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Kathmandu, Nepal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Describe your course..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? "Creating..." : "Create Course"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Courses */}
        <div>
          <h3 className="text-2xl font-bold mb-6">My Courses ({courses.length})</h3>
          
          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-600 mb-2">No courses yet</p>
              <p className="text-gray-500">Create your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    {course.imageUrl ? (
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${course.price}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {course.category}
                    </span>
                    <h4 className="text-xl font-bold mb-2">{course.title}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}h
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Max {course.maxStudents}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-4">
                      {course.location}
                    </div>
                    
                    <button className="w-full bg-gray-100 text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                      Edit Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
