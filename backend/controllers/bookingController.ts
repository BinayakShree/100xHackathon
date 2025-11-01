import type { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  createBookingSchema,
  tutorResponseSchema,
  rescheduleBookingSchema,
} from "../zod/bookingSchema";
import { createNotification } from "../utils/createNotification";

// ---------------- Tourist: create booking ----------------
export const createBookingController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res.status(403).json({ error: "Only tourists can book courses" });

    const data = createBookingSchema.parse(req.body);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        courseId: data.courseId,
        touristId: req.user.id,
        status: "PENDING",
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        error:
          "You already have a pending booking for this course. Please wait for the tutor's response.",
      });
    }

    const bookingOption = {
      date: new Date(data.date),
      time: `${data.startTime} - ${data.endTime}`,
    };

    const booking = await prisma.booking.create({
      data: {
        courseId: data.courseId,
        touristId: req.user.id,
        message: data.message,
        options: { create: [bookingOption] },
      },
      include: {
        options: true,
        tutorResponse: true,
        course: true,
        tourist: true,
      },
    });

    // 🔔 Notify the tutor
    await createNotification({
      userId: booking.course.tutorId,
      bookingId: booking.id,
      title: "New Booking Request",
      message: `${booking.tourist.name} has requested a booking for your course "${booking.course.title}".`,
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError")
      return res.status(400).json({ error: err.errors });
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};
// ---------------- Tourist: view their bookings ----------------
export const getTouristBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res
        .status(403)
        .json({ error: "Only tourists can view their bookings" });

    const bookings = await prisma.booking.findMany({
      where: { touristId: req.user.id },
      include: { options: true, tutorResponse: true, course: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ---------------- Tutor: view all bookings for their courses ----------------
export const getTutorBookingsController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "TUTOR")
      return res.status(403).json({ error: "Only tutors can view bookings" });

    const bookings = await prisma.booking.findMany({
      where: { course: { tutorId: req.user.id } },
      include: {
        options: true,
        tutorResponse: true,
        course: true,
        tourist: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ---------------- Tutor: respond to booking ----------------
export const tutorRespondBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "TUTOR")
      return res
        .status(403)
        .json({ error: "Only tutors can respond to bookings" });

    const { id } = req.params;
    const data = tutorResponseSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        options: true,
        course: true,
        tourist: true,
      },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.course.tutorId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only respond to your own course bookings" });

    if (data.status === "CONFIRMED" && data.selectedOptionId) {
      const optionExists = booking.options.some(
        (opt) => opt.id === data.selectedOptionId
      );
      if (!optionExists)
        return res.status(400).json({
          error: "Selected option must be one of the booking options",
        });
    }

    const tutorResponse = await prisma.tutorResponse.upsert({
      where: { bookingId: id },
      update: { ...data },
      create: { bookingId: id, ...data },
      include: { selectedOption: true },
    });

    const bookingStatus =
      data.status === "CONFIRMED"
        ? "CONFIRMED"
        : data.status === "DECLINED"
        ? "DECLINED"
        : "RESCHEDULED";

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: bookingStatus },
      include: {
        options: true,
        tutorResponse: { include: { selectedOption: true } },
        course: true,
        tourist: true,
      },
    });

    // 🔔 Notify the tourist
    const messages = {
      CONFIRMED: `Your booking for "${booking.course.title}" has been confirmed!`,
      DECLINED: `Your booking for "${booking.course.title}" was declined.`,
      RESCHEDULED: `The tutor requested a reschedule for "${booking.course.title}".`,
    };

    await createNotification({
      userId: booking.tourist.id,
      bookingId: booking.id,
      title: `Booking ${bookingStatus}`,
      message: messages[bookingStatus],
    });

    res.status(200).json({
      message: "Booking response saved",
      booking: updatedBooking,
      tutorResponse,
    });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError")
      return res.status(400).json({ error: err.errors });
    console.error(error);
    return res.status(500).json({ error: "Failed to respond to booking" });
  }
};

// ---------------- Get bookings by courseId (for tutor course detail page) ----------------
export const getBookingsByCourseIdController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "TUTOR")
      return res
        .status(403)
        .json({ error: "Only tutors can view course bookings" });

    const { courseId } = req.params;

    // Verify the course belongs to this tutor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.tutorId !== req.user.id)
      return res.status(403).json({
        error: "You can only view bookings for your own courses",
      });

    const bookings = await prisma.booking.findMany({
      where: { courseId },
      include: {
        options: true,
        tutorResponse: {
          include: { selectedOption: true },
        },
        tourist: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course bookings" });
  }
};

// ---------------- Tourist: reschedule booking ----------------
export const rescheduleBookingController = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res.status(403).json({ error: "Only tourists can reschedule" });

    const { id } = req.params;
    const data = rescheduleBookingSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.touristId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only reschedule your own bookings" });

    const bookingOptions = data.options.map((option) => ({
      date: new Date(option.date),
      time: `${option.startTime} - ${option.endTime}`,
    }));

    await prisma.bookingOption.deleteMany({ where: { bookingId: id } });
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        message: data.message,
        status: "PENDING",
        options: { create: bookingOptions },
        tutorResponse: { delete: true },
      },
      include: { options: true, tutorResponse: true, course: true },
    });

    // 🔔 Notify the tutor
    await createNotification({
      userId: booking.course.tutorId,
      bookingId: booking.id,
      title: "Booking Rescheduled",
      message: `${req.user.email} has rescheduled the booking for "${booking.course.title}".`,
    });

    res
      .status(200)
      .json({ message: "Booking rescheduled", booking: updatedBooking });
  } catch (error: unknown) {
    const err = error as { name?: string; errors?: unknown };
    if (err.name === "ZodError")
      return res.status(400).json({ error: err.errors });
    console.error(error);
    res.status(500).json({ error: "Failed to reschedule booking" });
  }
};
