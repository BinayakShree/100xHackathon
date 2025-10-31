import type { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import { loginUserSchema } from "../zod/authSchema";

export const loginUserController = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const data = loginUserSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this email" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Remove password before returning response
    const { password, ...safeUser } = user;

    return res.status(200).json({
      message: "Login successful",
      user: safeUser,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
