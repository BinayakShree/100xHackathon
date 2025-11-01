"use client";

import { Course } from "@/types/course";
import { courseApi } from "@/lib/api/courseApi";
import { reviewApi } from "@/lib/api/reviewApi";
import { useEffect, useState } from "react";
import { Clock, MapPin, Award, ChevronUp, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { ReviewForm } from "@/components/ui/ReviewForm";
import { ReviewDisplay } from "@/components/ui/ReviewDisplay";

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showAllDescription, setShowAllDescription] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    setError(null);
    setReviewsLoading(true);
    try {
      await reviewApi.create({
        courseId: params.id as string,
        rating,
        comment,
      });
      
      // Refresh course data to get updated reviews
      const updatedCourse = await courseApi.getById(params.id as string);
      setCourse(updatedCourse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await courseApi.getById(params.id as string);
        setCourse(response);
      } catch (error) {
        console.error("Error fetching course:", error);
        setError("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCourse();
    }
  }, [params.id]);

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Photo Gallery */}
      <div className="h-[60vh] bg-black relative">
        {course.photos && course.photos[0] && (
          <img
            src={course.photos[0].url}
            alt={course.title}
            className="w-full h-full object-cover opacity-90"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              {course.categoryId && (
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {course.categoryId}
                </span>
              )}
              <span className="bg-blue-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {course.level}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-['Playfair_Display'] mb-4">
              {course.title}
            </h1>
            <div className="flex items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {course.duration}
              </div>
              {course.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {course.location}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About this course</h2>
              <div className="relative">
                <p className={`text-gray-600 whitespace-pre-line ${!showAllDescription && "line-clamp-4"}`}>
                  {course.description}
                </p>
                {course.description.split("\n").length > 4 && (
                  <button
                    onClick={() => setShowAllDescription(!showAllDescription)}
                    className="text-black font-medium flex items-center gap-1 mt-2"
                  >
                    {showAllDescription ? (
                      <>
                        Show less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show more
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisite && (
              <div>
                <h2 className="text-2xl font-bold mb-4">What you need to know</h2>
                <div className="bg-gray-100 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-gray-600 mt-1" />
                    <p className="text-gray-600">{course.prerequisite}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <div className="space-y-8">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
                
                <ReviewDisplay ratings={course.ratings || []} />
                
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                  {reviewsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  ) : (
                    <ReviewForm onSubmit={handleReviewSubmit} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl font-bold mb-4">${course.price}</div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>{course.duration}</span>
                  </div>
                  {course.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <span>{course.location}</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <button className="w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}