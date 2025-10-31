import { z } from "zod";

// Enum-like validation for role
export const UserRoleEnum = z.enum(["TOURIST", "TUTOR"]);

export const registerUserSchema = z.object({
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
  role: UserRoleEnum.default("TOURIST"), // Default role = TOURIST
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
