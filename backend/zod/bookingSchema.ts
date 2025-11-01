import { z } from "zod";

// Tourist creates booking with multiple options (date and time ranges)
export const createBookingSchema = z.object({
  courseId: z.string(),
  message: z.string().optional(),
  options: z
    .array(
      z.object({
        date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      })
    )
    .min(1, "At least one option is required"),
});

// Tutor responds to booking
export const tutorResponseSchema = z.object({
  status: z.enum(["CONFIRMED", "DECLINED", "RESCHEDULED"]),
  selectedOptionId: z.string().optional(), // the option tutor chooses if CONFIRMED
  message: z.string().optional(),
});

// Tourist reschedules booking
export const rescheduleBookingSchema = z.object({
  options: z
    .array(
      z.object({
        date: z.string().refine((d) => !isNaN(Date.parse(d)), "Invalid date"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      })
    )
    .min(1, "At least one option is required"),
  message: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type TutorResponseInput = z.infer<typeof tutorResponseSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
