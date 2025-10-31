import type { Request, Response } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import { registerTouristSchema } from "../zod/authSchema";

export const registerToursitController = async (req: Request, res: Response) => {
  try {
  
    const data = registerTouristSchema.parse(req.body);

    const existingTourist = await prisma.tourist.findUnique({
      where: { email: data.email },
    });

    if (existingTourist) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const tourist = await prisma.tourist.create({
      data: {
        ...data,
        password: hashedPassword, 
      },
    });
    const { password, ...safeTourist } = tourist;
    return res.status(201).json(safeTourist);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
