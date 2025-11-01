"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  LogOut,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react";
import { getUser, logout, isTourist, isAuthenticated } from "@/lib/auth";
import { bookingApi } from "@/lib/api";

interface Booking {
  id: string;
  status: string;
  message?: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    price: number;
    duration: string;
    location?: string;
    tutor?: { name: string };
    photos?: Array<{ url: string }>;
  };
  options: Array<{ id: string; date: string; time: string }>;
  tutorResponse?: {
    selectedOption?: { date: string; time: string };
    message?: string;
  };
}

export default function TouristBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
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

    fetchBookings();
  }, [isMounted, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getTouristBookings();
      setBookings(response.bookings || []);
    } catch (err: unknown) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filterStatus === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");
  const pastBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "DECLINED"
  );

  const user = getUser() || { name: "" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading your bookings...
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
                Arogya - My Bookings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={() => router.push("/dashboard/tourist")}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Browse Courses
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Pending</p>
                <p className="text-2xl font-bold mt-1 text-blue-700">
                  {pendingBookings.length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Confirmed</p>
                <p className="text-2xl font-bold mt-1 text-green-700">
                  {confirmedBookings.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{bookings.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="DECLINED">Declined</option>
          </select>
        </div>

        {/* Bookings Grid */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No bookings found
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === "ALL"
                ? "You haven't made any bookings yet."
                : `No ${filterStatus.toLowerCase()} bookings.`}
            </p>
            {filterStatus !== "ALL" && (
              <button
                onClick={() => setFilterStatus("ALL")}
                className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                View All Bookings
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                {/* Course Image */}
                <div className="relative h-48 w-full">
                  {booking.course.photos && booking.course.photos.length > 0 ? (
                    <img
                      src={booking.course.photos[0].url}
                      alt={booking.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === "CONFIRMED"
                          ? "bg-green-500 text-white"
                          : booking.status === "DECLINED"
                          ? "bg-red-500 text-white"
                          : booking.status === "RESCHEDULED"
                          ? "bg-yellow-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {booking.course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    ${booking.course.price} • {booking.course.duration}
                  </p>

                  {booking.course.tutor && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Instructor: {booking.course.tutor.name}</span>
                    </div>
                  )}

                  {booking.course.location && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{booking.course.location}</span>
                    </div>
                  )}

                  {booking.options.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Preferred Time:
                        </span>
                      </div>
                      <p className="text-sm text-gray-900">
                        {new Date(
                          booking.options[0].date
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.options[0].time}
                      </p>
                    </div>
                  )}

                  {booking.tutorResponse?.selectedOption && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Confirmed Time:
                        </span>
                      </div>
                      <p className="text-sm text-green-900">
                        {new Date(
                          booking.tutorResponse.selectedOption.date
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-green-700">
                        {booking.tutorResponse.selectedOption.time}
                      </p>
                    </div>
                  )}

                  {booking.message && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Your message:</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                        &ldquo;{booking.message}&rdquo;
                      </p>
                    </div>
                  )}

                  {booking.tutorResponse?.message && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Tutor response:</p>
                      <p className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                        &ldquo;{booking.tutorResponse.message}&rdquo;
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-gray-400 mt-4">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

