import type { Request, Response } from "express";
import prisma from "../prisma/client";
import { createCourseSchema } from "../zod/courseSchema";

export const createCourseController = async (req: Request, res: Response) => {
  try {
    const data = createCourseSchema.parse(req.body);

    // Only tutors can create course, but we double check
    if (!req.user || req.user.role !== "TUTOR") {
      return res.status(403).json({ error: "Access denied: Tutors only" });
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        level: data.level,
        location: data.location,
        prerequisite: data.prerequisite,
        tutorId: req.user.id,
        categoryId: data.categoryId,
        photos: {
          create: data.photos?.map((url) => ({ url })) || [],
        },
      },
      include: {
        photos: true,
        tutor: true,
        category: true,
      },
    });

    return res
      .status(201)
      .json({ message: "Course created successfully", course });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return res.status(400).json({ error: error.errors });
    }

    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
