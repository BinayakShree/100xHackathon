import type { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  createBookingSchema,
  tutorResponseSchema,
  rescheduleBookingSchema,
} from "../zod/bookingSchema";

// ---------------- Tourist: create booking ----------------
export const createBookingController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res.status(403).json({ error: "Only tourists can book courses" });

    const data = createBookingSchema.parse(req.body);

    // Transform options to match Prisma schema (store time range as string)
    const bookingOptions = data.options.map((option) => ({
      date: new Date(option.date),
      time: `${option.startTime} - ${option.endTime}`,
    }));

    const booking = await prisma.booking.create({
      data: {
        courseId: data.courseId,
        touristId: req.user.id,
        message: data.message,
        options: { create: bookingOptions },
      },
      include: { options: true, tutorResponse: true, course: true },
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
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

    const { id } = req.params; // bookingId
    const data = tutorResponseSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        options: true,
        course: true,
      },
    });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.course.tutorId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only respond to your own course bookings" });

    // Validate selectedOptionId if CONFIRMED
    if (data.status === "CONFIRMED" && data.selectedOptionId) {
      const optionExists = booking.options.some(
        (opt) => opt.id === data.selectedOptionId
      );
      if (!optionExists) {
        return res.status(400).json({
          error: "Selected option must be one of the booking options",
        });
      }
    }

    // Create or update tutor response
    const tutorResponse = await prisma.tutorResponse.upsert({
      where: { bookingId: id },
      update: { ...data },
      create: { bookingId: id, ...data },
      include: { selectedOption: true },
    });

    // Update booking status based on tutor response
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
        tutorResponse: {
          include: { selectedOption: true },
        },
        course: true,
        tourist: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Booking response saved",
      booking: updatedBooking,
      tutorResponse,
    });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
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
      return res.status(403).json({ error: "Only tutors can view course bookings" });

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

    const { id } = req.params; // bookingId
    const data = rescheduleBookingSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.touristId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only reschedule your own bookings" });

    // Transform options to match Prisma schema (store time range as string)
    const bookingOptions = data.options.map((option) => ({
      date: new Date(option.date),
      time: `${option.startTime} - ${option.endTime}`,
    }));

    // Delete old options and add new ones
    await prisma.bookingOption.deleteMany({ where: { bookingId: id } });
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        message: data.message,
        status: "PENDING",
        options: { create: bookingOptions },
        tutorResponse: { delete: true }, // remove previous tutor response
      },
      include: { options: true, tutorResponse: true, course: true },
    });

    res
      .status(200)
      .json({ message: "Booking rescheduled", booking: updatedBooking });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: "Failed to reschedule booking" });
  }
};
