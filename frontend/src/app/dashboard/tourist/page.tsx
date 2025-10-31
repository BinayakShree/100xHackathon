"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Clock, Users, Star, LogOut, BookOpen } from "lucide-react"
import Image from "next/image"
import { getToken, getUser, logout } from "@/lib/auth"

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
  tutor: {
    name: string
  }
}

export default function TouristDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const router = useRouter()

  // Mock data - Replace with actual API call when backend is ready
  const mockCourses: Course[] = [
    {
      id: "1",
      title: "Traditional Pottery Workshop",
      description: "Learn ancient pottery techniques from master artisans in the heart of Kathmandu",
      category: "Arts & Crafts",
      price: 45,
      duration: 3,
      maxStudents: 12,
      location: "Kathmandu, Nepal",
      imageUrl: "/pottery.png",
      tutor: { name: "Rajesh Thapa" }
    },
    {
      id: "2",
      title: "Nepalese Cooking Class",
      description: "Master authentic Nepalese recipes in a hands-on cooking experience",
      category: "Cooking",
      price: 35,
      duration: 2,
      maxStudents: 8,
      location: "Pokhara, Nepal",
      imageUrl: "/cooking.png",
      tutor: { name: "Sita Gurung" }
    },
    {
      id: "3",
      title: "Traditional Dance Performance",
      description: "Experience vibrant traditional dances and learn basic steps",
      category: "Dance",
      price: 25,
      duration: 1.5,
      maxStudents: 20,
      location: "Bhaktapur, Nepal",
      imageUrl: "/dancing.png",
      tutor: { name: "Prem Shrestha" }
    },
    {
      id: "4",
      title: "Heritage Walking Tour",
      description: "Explore UNESCO World Heritage sites with local guides",
      category: "Tours",
      price: 30,
      duration: 4,
      maxStudents: 15,
      location: "Kathmandu Valley",
      imageUrl: "/walk.png",
      tutor: { name: "Gopal Adhikari" }
    },
    {
      id: "5",
      title: "Museum & History Tour",
      description: "Discover Nepal's rich history through guided museum visits",
      category: "Tours",
      price: 20,
      duration: 2,
      maxStudents: 25,
      location: "Kathmandu",
      imageUrl: "/museum.png",
      tutor: { name: "Laxmi Bhandari" }
    }
  ]

  const categories = ["All", "Arts & Crafts", "Cooking", "Dance", "Tours"]

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken()
    const user = getUser()
    
    if (!token || !user) {
      router.push("/auth/login")
      return
    }

    // TODO: Replace with actual API call
    // const fetchCourses = async () => {
    //   try {
    //     const response = await fetch("http://localhost:3000/api/courses", {
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
    // fetchCourses()

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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const user = getUser() || { name: "" }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading courses...</p>
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
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
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
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No courses found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div className="relative h-48 w-full">
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <h3 className="text-xl font-bold mb-2 group-hover:text-black/80 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {course.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {course.duration} hours
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Max {course.maxStudents} students
                    </div>
                  </div>
                  
                  <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
