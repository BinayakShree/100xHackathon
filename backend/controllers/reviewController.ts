// ---------------- Create review ----------------
import { Request, Response } from "express";
import prisma from "../prisma/client";
import { reviewSchema, updateReviewSchema } from "../zod/reviewSchema";
export const createReviewController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res
        .status(403)
        .json({ error: "Only tourists can review courses" });

    const data = reviewSchema.parse(req.body);

    // Check if tourist has booked the course
    const bookingExists = await prisma.booking.findFirst({
      where: {
        id: data.bookingId,
        courseId: data.courseId,
        touristId: req.user.id,
        status: "CONFIRMED",
      },
    });

    if (!bookingExists) {
      return res
        .status(403)
        .json({ error: "You can only review courses you have booked" });
    }

    // Check if the review already exists
    const existingReview = await prisma.review.findFirst({
      where: { touristId: req.user.id, courseId: data.courseId },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this course" });
    }

    const review = await prisma.review.create({
      data: {
        touristId: req.user.id,
        courseId: data.courseId,
        bookingId: data.bookingId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to create review" });
  }
};

// ---------------- Update review ----------------
export const updateReviewController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res.status(403).json({ error: "Only tourists can edit reviews" });

    const { id } = req.params; // review id
    const data = updateReviewSchema.parse(req.body);

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.touristId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only edit your own reviews" });

    const updatedReview = await prisma.review.update({
      where: { id },
      data,
    });

    res.status(200).json({ message: "Review updated", review: updatedReview });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to update review" });
  }
};

// ---------------- Delete review ----------------
export const deleteReviewController = async (req: Request, res: Response) => {
  try {
    if (!req.user || req.user.role !== "TOURIST")
      return res
        .status(403)
        .json({ error: "Only tourists can delete reviews" });

    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.touristId !== req.user.id)
      return res
        .status(403)
        .json({ error: "You can only delete your own reviews" });

    await prisma.review.delete({ where: { id } });
    res.status(200).json({ message: "Review deleted" });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete review" });
  }
};

// ---------------- Get average rating of a course ----------------
export const getAverageRatingController = async (
  req: Request,
  res: Response
) => {
  try {
    const { courseId } = req.params;

    const result = await prisma.review.aggregate({
      where: { courseId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.status(200).json({
      courseId,
      averageRating: result._avg.rating || 0,
      totalReviews: result._count.rating,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
};
