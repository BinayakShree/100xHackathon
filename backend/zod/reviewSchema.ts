import { z } from "zod";

// ---------------- Zod schemas ----------------
export const reviewSchema = z.object({
  courseId: z.string(),
  bookingId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});
