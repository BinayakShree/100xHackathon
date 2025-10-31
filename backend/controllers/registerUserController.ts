import type { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import { registerUserSchema } from "../zod/authSchema";

export const registerUserController = async (req: Request, res: Response) => {
  try {
    // Validate incoming data
    const data = registerUserSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Remove password before returning response
    const { password, ...safeUser } = user;

    return res.status(201).json({
      message: `${safeUser.role} registered successfully`,
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
