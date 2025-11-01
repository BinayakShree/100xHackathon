"use client";

import { useEffect, useState } from "react";
import { Star, Filter, Search } from "lucide-react";
import Link from "next/link";
import { courseApi } from "@/lib/api/courseApi";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseApi.getAll({
          categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
        });
        
        // Ensure we're getting the courses array from the response
        const coursesArray = response?.courses || [];
        
        // Filter courses based on search query client-side
        const filteredCourses = coursesArray.filter((course: Course) => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
          );
        });
        
        setCourses(filteredCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, searchQuery]); // Refetch when category or search changes since we're filtering on the backend

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-black to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-4">
            Discover Cultural Courses
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Immerse yourself in Nepalese culture through unique and authentic courses led by local experts
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="all">All Categories</option>
              <option value="cultural-art">Cultural Art</option>
              <option value="traditional-music">Traditional Music</option>
              <option value="culinary">Culinary Arts</option>
              <option value="dance">Traditional Dance</option>
              <option value="crafts">Local Crafts</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors">
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Experiences Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link href={`/courses/${course.id}`} key={course.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative h-48">
                    {course.photos && course.photos.length > 0 ? (
                      <img
                        src={course.photos[0].url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-gray-200 to-gray-300" />
                    )}
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${course.price}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {course.categoryId}
                      </span>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <div className="text-gray-500">{course.duration}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}