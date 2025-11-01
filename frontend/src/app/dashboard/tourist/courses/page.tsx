"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  Search,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import { getUser, logout, isTourist, isAuthenticated } from "@/lib/auth";
import { courseApi, bookingApi } from "@/lib/api";

interface Course {
  id: string;
  title: string;
  description: string;
  category?: { id: string; name: string };
  price: number;
  duration: string;
  level: string;
  location?: string;
  prerequisite?: string;
  photos?: Array<{ url: string }>;
  tutor?: { name: string };
  createdAt: string;
}

export default function TouristCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const user = getUser();

    if (!isAuthenticated()) {
      router.replace("/auth/login");
      return;
    }

    if (!isTourist()) {
      if (user?.role === "TUTOR") {
        router.replace("/dashboard/tutor");
        return;
      }
      router.replace("/auth/login");
      return;
    }

    fetchCourses();
    fetchMyBookings();
  }, [isMounted, router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getAll();
      setCourses(response.courses || []);
    } catch (err: unknown) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await bookingApi.getTouristBookings();
      setMyBookings(response.bookings || []);
    } catch (err: unknown) {
      console.error("Error fetching bookings:", err);
      setMyBookings([]);
    }
  };

  const hasPendingBooking = (courseId: string) => {
    return myBookings.some(
      (booking) => booking.courseId === courseId && booking.status === "PENDING"
    );
  };

  const isCourseAvailable = (courseId: string) => {
    const booking = myBookings.find((b) => b.courseId === courseId);
    if (!booking) return true;
    return booking.status === "DECLINED" || booking.status === "CONFIRMED";
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category?.name === selectedCategory;
    const matchesLevel =
      selectedLevel === "All" || course.level === selectedLevel;
    const isAvailable = isCourseAvailable(course.id);
    return matchesSearch && matchesCategory && matchesLevel && isAvailable;
  });

  const categories = [
    "All",
    ...new Set(courses.map((c) => c.category?.name).filter(Boolean) as string[]),
  ];

  const user = getUser() || { name: "" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading courses...
          </p>
        </div>
      </div>
    );
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
                Arogya - Browse Courses
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={() => router.push("/dashboard/tourist/bookings")}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                My Bookings
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
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
            Explore Nepal&apos;s rich culture through handcrafted workshops and
            immersive tours
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
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-gray-600 mb-2">Category</p>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
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
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== "All" || selectedLevel !== "All"
                ? "Try adjusting your filters"
                : "No courses available at the moment"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() =>
                  router.push(`/dashboard/tourist?course=${course.id}`)
                }
              >
                <div className="relative h-48 w-full">
                  {course.photos && course.photos.length > 0 ? (
                    <img
                      src={course.photos[0].url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="flex items-center gap-2 mb-2">
                    {course.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.category.name}
                      </span>
                    )}
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-black/80 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    {course.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{course.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    {course.tutor && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Instructor: {course.tutor.name}</span>
                      </div>
                    )}
                  </div>

                  {hasPendingBooking(course.id) ? (
                    <button
                      disabled
                      className="w-full bg-gray-300 text-gray-600 py-3 rounded-xl font-semibold cursor-not-allowed"
                    >
                      Booking Pending
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/tourist?book=${course.id}`);
                      }}
                      className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                      Book Course
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

