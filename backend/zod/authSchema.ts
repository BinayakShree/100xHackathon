import { z } from "zod";

export const registerTouristSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long"),
  phone: z
    .string()
    .min(6, "Phone number too short")
    .max(20, "Phone number too long"),
  country: z.string().min(2, "Country must be at least 2 characters"),
});
export type RegisterTouristInput = z.infer<typeof registerTouristSchema>;
