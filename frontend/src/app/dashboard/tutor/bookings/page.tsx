"use client";

import { useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  LogOut,
  Users,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Bell,
} from "lucide-react";
import { getUser, logout, isTutor, isAuthenticated } from "@/lib/auth";
import { bookingApi } from "@/lib/api";
import { NotificationSheet, useNotifications } from "@/components/notifications";

interface Booking {
  id: string;
  status: string;
  message?: string;
  createdAt: string;
  tourist: { name: string; email: string; phone?: string };
  options: Array<{ id: string; date: string; time: string }>;
  course: { id: string; title: string; price: number };
  tutorResponse?: {
    selectedOption?: { date: string; time: string };
    message?: string;
  };
}

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isRespondingBooking, setIsRespondingBooking] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const router = useRouter();

  const {
    notifications,
    isOpen: isNotificationOpen,
    addNotification,
    removeNotification,
    clearAll: clearAllNotifications,
    toggleSheet: toggleNotificationSheet,
  } = useNotifications();

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

    fetchBookings();
  }, [isMounted, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingApi.getTutorBookings();
      setBookings(response.bookings || []);
    } catch (err: unknown) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingResponse = async (
    bookingId: string,
    status: "CONFIRMED" | "DECLINED",
    selectedOptionId?: string
  ) => {
    setIsRespondingBooking(bookingId);
    try {
      await bookingApi.tutorRespond(bookingId, {
        status,
        selectedOptionId: selectedOptionId || undefined,
        message:
          status === "CONFIRMED" ? "Looking forward to meeting you!" : "",
      });

      await fetchBookings();

      const booking = bookings.find((b) => b.id === bookingId);
      addNotification(
        status === "CONFIRMED" ? "success" : "info",
        `Booking ${status.toLowerCase()}`,
        `You ${status === "CONFIRMED" ? "accepted" : "declined"} the booking request from ${booking?.tourist.name || "tourist"}`
      );
    } catch (err: unknown) {
      console.error("Error responding to booking:", err);
      const error = err as { message?: string };
      addNotification(
        "error",
        "Failed to respond",
        error.message || "Failed to respond to booking. Please try again."
      );
    } finally {
      setIsRespondingBooking(null);
    }
  };

  const filteredBookings =
    filterStatus === "ALL"
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const declinedCount = bookings.filter((b) => b.status === "DECLINED").length;

  const user = getUser() || { name: "" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black border-t-transparent mx-auto"></div>
          <p className="mt-6 text-lg text-gray-600 font-medium">
            Loading bookings...
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
                Arogya - Bookings
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <NotificationSheet
                notifications={notifications}
                onClose={removeNotification}
                onCloseAll={clearAllNotifications}
                isOpen={isNotificationOpen}
                onToggle={toggleNotificationSheet}
              />
              <button
                onClick={() => router.push("/dashboard/tutor")}
                className="px-4 py-2 text-gray-700 hover:text-black transition-colors"
              >
                Courses
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{bookings.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Pending</p>
                <p className="text-2xl font-bold mt-1 text-blue-700">
                  {pendingCount}
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
                  {confirmedCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-red-50 rounded-xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Declined</p>
                <p className="text-2xl font-bold mt-1 text-red-700">
                  {declinedCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
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

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tourist
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">
                        No bookings found
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {booking.tourist.name}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {booking.tourist.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">
                          {booking.course.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${booking.course.price}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {booking.options.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(
                                  booking.options[0].date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.options[0].time}
                              </p>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "DECLINED"
                              ? "bg-red-100 text-red-700"
                              : booking.status === "RESCHEDULED"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {booking.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleBookingResponse(
                                  booking.id,
                                  "CONFIRMED",
                                  booking.options[0]?.id
                                )
                              }
                              disabled={isRespondingBooking === booking.id}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {isRespondingBooking === booking.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  <span>Accept</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                handleBookingResponse(booking.id, "DECLINED")
                              }
                              disabled={isRespondingBooking === booking.id}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {isRespondingBooking === booking.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3 w-3" />
                                  <span>Reject</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                        {booking.status !== "PENDING" && (
                          <span className="text-sm text-gray-500">
                            {booking.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

