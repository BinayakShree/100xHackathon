import { z } from "zod";

export const registerTouristSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password too long" })
    .regex(/[A-Z]/, { message: "Password must contain an uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain a lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain a number" }),

  name: z
    .string()
    .trim()
    .min(2, { message: "Name too short" })
    .max(50, { message: "Name too long" }),

  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{7,15}$/, { message: "Invalid phone number" }),

  country: z.string().trim().max(50, { message: "Country name too long" }),
});
export type RegisterTouristInput = z.infer<typeof registerTouristSchema>;
