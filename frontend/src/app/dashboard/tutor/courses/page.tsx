"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Users,
  Eye,
} from "lucide-react";
import { getUser, logout, isTutor, isAuthenticated } from "@/lib/auth";
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
  createdAt: string;
}

interface Booking {
  id: string;
  status: string;
  courseId: string;
}

export default function TutorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
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

    if (!isTutor()) {
      if (user?.role === "TOURIST") {
        router.replace("/dashboard/tourist");
        return;
      }
      router.replace("/auth/login");
      return;
    }

    fetchCourses();
    fetchBookings();
  }, [isMounted, router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const user = getUser();
      const response = await courseApi.getAll({ tutorId: user?.id });
      setCourses(response.courses || []);
    } catch (err: unknown) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingApi.getTutorBookings();
      setBookings(response.bookings || []);
    } catch (err: unknown) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    }
  };

  const handleDelete = async (course: Course) => {
    if (
      !confirm(
        `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await courseApi.delete(course.id);
      fetchCourses();
    } catch (err: unknown) {
      console.error("Error deleting course:", err);
      alert("Failed to delete course. Please try again.");
    }
  };

  const getBookingCount = (courseId: string) => {
    return bookings.filter((b) => b.courseId === courseId).length;
  };

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
                Arogya - My Courses
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={() => router.push("/dashboard/tutor/bookings")}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Bookings
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Courses</h2>
            <p className="text-gray-600">
              Manage and view all your courses ({courses.length})
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/tutor")}
            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start sharing your expertise by creating your first course!
            </p>
            <button
              onClick={() => router.push("/dashboard/tutor")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
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
                  <div className="flex items-center gap-2 mb-3">
                    {course.category && (
                      <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {course.category.name}
                      </span>
                    )}
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
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
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {getBookingCount(course.id)} booking
                        {getBookingCount(course.id) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/tutor?course=${course.id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/dashboard/tutor?edit=${course.id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

