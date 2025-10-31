"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, BookOpen, Clock, LogOut, Save, Upload, XCircle, AlertCircle, Edit2, Trash2, CheckCircle, X, Users, Calendar, Mail } from "lucide-react"
import { getToken, getUser, logout, isTutor } from "@/lib/auth"
import { courseApi, bookingApi } from "@/lib/api"
import { uploadImage } from "@/lib/cloudinary"
import { COMMON_CATEGORIES, getCategoryIdByName, getCategoryNameById } from "@/lib/categories"

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
  createdAt: string
}

interface Booking {
  id: string
  status: string
  message?: string
  createdAt: string
  tourist: { name: string; email: string }
  options: Array<{ id: string; date: string; time: string }>
  course?: { title: string }
}

export default function TutorDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Arts & Crafts",
    price: "",
    duration: "",
    level: "BEGINNER",
    location: "",
    prerequisite: "",
    photos: [] as string[]
  })

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    
    const token = getToken()
    const user = getUser()
    
    if (!token || !user) {
      router.replace("/auth/login")
      return
    }

    if (!isTutor()) {
      router.replace("/dashboard/tourist")
      return
    }
    
    fetchMyCourses()
    fetchBookings()
  }, [isMounted])

  const fetchMyCourses = async () => {
    try {
      setLoading(true)
      const user = getUser()
      
      const response = await courseApi.getAll({ tutorId: user?.id })
      
      if (response.courses && response.courses.length > 0) {
        setCourses(response.courses)
      } else {
        setCourses([])
      }
    } catch (err: any) {
      console.error("Error fetching courses:", err)
      if (!err.message.includes("404")) {
        setError("Failed to load courses")
      }
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true)
      const response = await bookingApi.getTutorBookings()
      setBookings(response.bookings || [])
    } catch (err: any) {
      console.error("Error fetching bookings:", err)
      setBookings([])
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      const result = await uploadImage(file)
      setUploadedPhotos(prev => [...prev, result.secure_url])
      setFormData(prev => ({ ...prev, photos: [...prev.photos, result.secure_url] }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const categoryId = getCategoryIdByName(formData.category)

      const courseData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
        level: formData.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
        location: formData.location || undefined,
        prerequisite: formData.prerequisite || undefined,
        categoryId: categoryId,
        photos: uploadedPhotos,
      }

      if (isEditing && selectedCourse) {
        await courseApi.update(selectedCourse.id, courseData)
      } else {
        await courseApi.create(courseData)
      }
      
      setShowForm(false)
      setIsEditing(false)
      setSelectedCourse(null)
      resetForm()
      fetchMyCourses()
    } catch (err: any) {
      console.error("Error saving course:", err)
      if (err.message.includes("categoryId")) {
        setError("Category is not set up in the database. Please check report.md for backend setup instructions.")
      } else if (err.message.includes("Unauthorized")) {
        setError("Failed to save course: Missing authentication. The backend needs authenticateUser middleware in courseRoutes.ts")
      } else {
        setError(err.message || "Failed to save course. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Arts & Crafts",
      price: "",
      duration: "",
      level: "BEGINNER",
      location: "",
      prerequisite: "",
      photos: []
    })
    setUploadedPhotos([])
  }

  const handleEdit = (course: Course) => {
    setSelectedCourse(course)
    setIsEditing(true)
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category?.name || "Arts & Crafts",
      price: course.price.toString(),
      duration: course.duration,
      level: course.level,
      location: course.location || "",
      prerequisite: course.prerequisite || "",
      photos: course.photos?.map(p => p.url) || []
    })
    setUploadedPhotos(course.photos?.map(p => p.url) || [])
    setShowForm(true)
  }

  const handleDelete = async (course: Course) => {
    if (!confirm(`Are you sure you want to delete "${course.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      await courseApi.delete(course.id)
      fetchMyCourses()
      fetchBookings()
      if (selectedCourse?.id === course.id) {
        setShowDetails(false)
        setSelectedCourse(null)
      }
    } catch (err: any) {
      console.error("Error deleting course:", err)
      alert("Failed to delete course. Please try again.")
    }
  }

  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course)
    setShowDetails(true)
  }

  const handleBookingResponse = async (bookingId: string, status: "CONFIRMED" | "DECLINED", selectedOptionId?: string) => {
    try {
      await bookingApi.tutorRespond(bookingId, {
        status,
        selectedOptionId,
        message: status === "CONFIRMED" ? "Looking forward to meeting you!" : ""
      })
      fetchBookings()
      if (selectedCourse) {
        setSelectedCourse({ ...selectedCourse }) // Trigger re-render
      }
    } catch (err: any) {
      console.error("Error responding to booking:", err)
      alert("Failed to respond to booking. Please try again.")
    }
  }

  const courseBookings = selectedCourse 
    ? bookings.filter(b => b.course?.title === selectedCourse.title)
    : []

  const user = getUser() || { name: "" }

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">Loading your dashboard...</p>
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
      <div className="bg-linear-to-r from-black to-gray-800 text-white py-16">
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

        {/* Create Course Button */}
        <div className="mb-8">
          <button
            onClick={() => {
              if (showForm) {
                resetForm()
                setIsEditing(false)
              }
              setShowForm(!showForm)
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>{showForm ? "Cancel" : "Create New Course"}</span>
          </button>
        </div>

        {/* Create/Edit Course Form */}
        {showForm && (
          <div className="mb-12 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6">{isEditing ? "Edit Course" : "Course Details"}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    {COMMON_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD) *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="3 hours or 2 days"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Kathmandu, Nepal"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prerequisites</label>
                  <input
                    type="text"
                    name="prerequisite"
                    value={formData.prerequisite}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Optional requirements"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Photos</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center justify-center px-6 py-3 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors">
                      <Upload className="h-5 w-5 mr-2" />
                      <span>{uploadingImage ? "Uploading..." : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {uploadedPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedPhotos.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                            <img src={url} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
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
                  onClick={() => {
                    setShowForm(false)
                    setIsEditing(false)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{isSubmitting ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Course" : "Create Course")}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* My Courses */}
        <div>
          <h3 className="text-2xl font-bold mb-6">My Courses ({courses.length})</h3>
          
          {courses.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
              <div className="bg-linear-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">No courses yet</h4>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start sharing your expertise by creating your first course. It's easy and takes just a few minutes!
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Course</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48 w-full">
                    {course.photos && course.photos.length > 0 ? (
                      <img
                        src={course.photos[0].url}
                        alt={course.title}
                        className="w-full h-full object-cover"
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
                    <h4 className="text-xl font-bold mb-2">{course.title}</h4>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {bookings.filter(b => b.course?.title === course.title).length} bookings
                      </div>
                    </div>
                    
                    {course.location && (
                      <div className="text-sm text-gray-500 mb-4">
                        📍 {course.location}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(course)}
                        className="px-4 py-2 bg-gray-100 text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Details
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                        >
                          <Edit2 className="h-4 w-4 mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(course)}
                          className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Course Details Modal */}
      {showDetails && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold">{selectedCourse.title}</h3>
              <button
                onClick={() => {
                  setShowDetails(false)
                  setSelectedCourse(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Course Info */}
              <div className="mb-8">
                {selectedCourse.photos && selectedCourse.photos.length > 0 && (
                  <div className="mb-6">
                    <img
                      src={selectedCourse.photos[0].url}
                      alt={selectedCourse.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <p className="font-semibold">{selectedCourse.category?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Level</span>
                    <p className="font-semibold">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Duration</span>
                    <p className="font-semibold">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Price</span>
                    <p className="font-semibold">${selectedCourse.price}</p>
                  </div>
                </div>

                {selectedCourse.description && (
                  <div>
                    <span className="text-sm text-gray-500">Description</span>
                    <p className="mt-2">{selectedCourse.description}</p>
                  </div>
                )}
              </div>

              {/* Bookings Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Bookings ({courseBookings.length})
                  </h4>
                  {loadingBookings && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  )}
                </div>

                {courseBookings.length === 0 ? (
                  <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">No bookings yet</p>
                    <p className="text-sm text-gray-500 mt-1">Share your course to get bookings!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courseBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold">{booking.tourist.name}</span>
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{booking.tourist.email}</span>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                              booking.status === "DECLINED" ? "bg-red-100 text-red-700" :
                              booking.status === "RESCHEDULED" ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        {booking.message && (
                          <p className="text-sm text-gray-600 mb-3 bg-gray-50 p-3 rounded-lg">
                            "{booking.message}"
                          </p>
                        )}

                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Available Times:</p>
                          <div className="space-y-1">
                            {booking.options.map((option) => (
                              <div key={option.id} className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(option.date).toLocaleDateString()} at {option.time}
                              </div>
                            ))}
                          </div>
                        </div>

                        {booking.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleBookingResponse(booking.id, "CONFIRMED", booking.options[0]?.id)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleBookingResponse(booking.id, "DECLINED")}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                            >
                              <X className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}