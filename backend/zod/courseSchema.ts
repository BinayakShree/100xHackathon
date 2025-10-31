import { z } from "zod";

export const createCourseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).default("BEGINNER"),
  location: z.string().optional(),
  prerequisite: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  photos: z.array(z.string().url("Invalid photo URL")).optional(),
});
export const updateCourseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  price: z.number().min(0, "Price must be positive").optional(),
  duration: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  location: z.string().optional(),
  prerequisite: z.string().optional(),
  categoryId: z.string().optional(),
  photos: z.array(z.string().url("Invalid photo URL")).optional(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type CreateCourseInput = z.infer<typeof createCourseSchema>;
