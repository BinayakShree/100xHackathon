"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Clock, LogOut, BookOpen, AlertCircle, X, Calendar } from "lucide-react"
import Image from "next/image"
import { getToken, getUser, logout, isTourist, isAuthenticated } from "@/lib/auth"
import { courseApi, bookingApi } from "@/lib/api"

interface Course {
  id: string
  title: string
  description: string
  category?: { id: string; name: string }
  price: number
  duration: string
  level: string
  location?: string
  prerequisite?: string
  photos?: Array<{ url: string }>
  tutor?: { name: string }
  createdAt: string
}

export default function TouristDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLevel, setSelectedLevel] = useState("All")
  const [isMounted, setIsMounted] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [bookingOptions, setBookingOptions] = useState([{ date: "", startTime: "", endTime: "" }])
  const [bookingMessage, setBookingMessage] = useState("")
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const router = useRouter()
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const user = getUser()
    
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.replace("/auth/login")
      return
    }

    // Check if user is a tourist
    if (!isTourist()) {
      // If user is a tutor, redirect to tutor dashboard
      if (user?.role === "TUTOR") {
        router.replace("/dashboard/tutor")
        return
      }
      // Otherwise redirect to login
      router.replace("/auth/login")
      return
    }

    fetchCourses()
  }, [isMounted, router])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await courseApi.getAll()
      setCourses(response.courses || [])
    } catch (err: any) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses. Make sure the backend server is running.")
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleBookCourse = (course: Course) => {
    setSelectedCourse(course)
    setShowBookingModal(true)
    setBookingOptions([{ date: "", startTime: "", endTime: "" }])
    setBookingMessage("")
  }

  const addBookingOption = () => {
    setBookingOptions([...bookingOptions, { date: "", startTime: "", endTime: "" }])
  }

  const removeBookingOption = (index: number) => {
    setBookingOptions(bookingOptions.filter((_, i) => i !== index))
  }

  const updateBookingOption = (index: number, field: string, value: string) => {
    const updated = [...bookingOptions]
    updated[index] = { ...updated[index], [field]: value }
    setBookingOptions(updated)
  }

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCourse) return

    // Validate at least one option with all fields
    const validOptions = bookingOptions.filter(
      opt => opt.date && opt.startTime && opt.endTime
    )

    if (validOptions.length === 0) {
      setError("Please add at least one date and time option")
      return
    }

    setIsSubmittingBooking(true)
    setError("")

    try {
      await bookingApi.create({
        courseId: selectedCourse.id,
        message: bookingMessage || undefined,
        options: validOptions.map(opt => ({
          date: opt.date,
          startTime: opt.startTime,
          endTime: opt.endTime,
        })),
      })

      setShowBookingModal(false)
      setSelectedCourse(null)
      setBookingOptions([{ date: "", startTime: "", endTime: "" }])
      setBookingMessage("")
      alert("Booking request sent successfully! The tutor will review and respond.")
    } catch (err: any) {
      console.error("Error creating booking:", err)
      setError(err.message || "Failed to create booking. Please try again.")
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category?.name === selectedCategory
    const matchesLevel = selectedLevel === "All" || course.level === selectedLevel
    return matchesSearch && matchesCategory && matchesLevel
  })

  // Get unique categories from courses
  const categories = ["All", ...new Set(courses.map(c => c.category?.name).filter(Boolean) as string[])]

  const user = getUser() || { name: "" }

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading amazing experiences...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait a moment</p>
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
                Arogya
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
      <div className="bg-linear-to-r from-black to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold font-['Playfair_Display:Medium'] mb-4">
            Discover Authentic Experiences
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl">
            Explore Nepal's rich culture through handcrafted workshops and immersive tours
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button onClick={() => setError("")} className="text-red-600 hover:text-red-800">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-600 mb-2">Category</p>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-600 mb-2">Level</p>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="All">All Levels</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="bg-linear-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">No courses available yet</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              It looks like there are no courses available at the moment. Check back later or contact us to learn more!
            </p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="bg-linear-to-br from-blue-100 to-blue-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-blue-400" />
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-2">No courses found</h4>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No courses match your search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                setSelectedLevel("All")
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 w-full">
                  {course.photos && course.photos.length > 0 ? (
                    <img
                      src={course.photos[0].url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ${course.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    {course.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {course.category.name}
                      </span>
                    )}
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-black/80 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {course.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {course.location}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {course.duration}
                    </div>
                    {course.tutor && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="text-gray-600 font-medium">Instructor: {course.tutor.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleBookCourse(course)}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Book Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Book Course: {selectedCourse.title}</h3>
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedCourse(null)
                    setError("")
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 shrink-0" />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  placeholder="Add any special requests or notes..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Available Date & Time Options *
                  </label>
                  <button
                    type="button"
                    onClick={addBookingOption}
                    className="text-sm text-black hover:underline font-medium"
                  >
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-4">
                  {bookingOptions.map((option, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Option {index + 1}</span>
                        {bookingOptions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBookingOption(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Date</label>
                          <input
                            type="date"
                            value={option.date}
                            onChange={(e) => updateBookingOption(index, "date", e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                          <input
                            type="time"
                            value={option.startTime}
                            onChange={(e) => updateBookingOption(index, "startTime", e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">End Time</label>
                          <input
                            type="time"
                            value={option.endTime}
                            onChange={(e) => updateBookingOption(index, "endTime", e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Add multiple date/time options. The tutor will select one that works best.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedCourse(null)
                    setError("")
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingBooking ? "Submitting..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}