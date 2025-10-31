import type { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUserSchema } from "../zod/authSchema";

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const data = loginUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res
        .status(404)
        .json({ error: "No account found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in environment variables");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Exclude password from response
    const { password, ...safeUser } = user;

    return res.status(200).json({
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
