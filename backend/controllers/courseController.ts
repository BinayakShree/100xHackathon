import type { Request, Response } from "express";
import prisma from "../prisma/client";
import { createCourseSchema, updateCourseSchema } from "../zod/courseSchema";

// ---------------- CREATE COURSE ----------------
export const createCourseController = async (req: Request, res: Response) => {
  try {
    const data = createCourseSchema.parse(req.body);
    if (!req.user || req.user.role !== "TUTOR") {
      return res.status(403).json({ error: "Access denied: Tutors only" });
    }

    const course = await prisma.course.create({
      data: {
        ...data,
        tutorId: req.user.id,
        photos: { create: data.photos?.map((url) => ({ url })) || [] },
      },
      include: { photos: true, category: true },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllCoursesController = async (req: Request, res: Response) => {
  try {
    const { categoryId, level, tutorId } = req.query;

    // Allowed enum values for level
    const validLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
    type LevelType = (typeof validLevels)[number];

    // Validate and cast level
    let levelFilter: LevelType | undefined = undefined;
    if (
      level &&
      typeof level === "string" &&
      validLevels.includes(level as LevelType)
    ) {
      levelFilter = level as LevelType;
    }

    const courses = await prisma.course.findMany({
      where: {
        categoryId: categoryId ? String(categoryId) : undefined,
        level: levelFilter,
        tutorId: tutorId ? String(tutorId) : undefined,
      },
      include: { photos: true, category: true, tutor: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ count: courses.length, courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// ---------------- GET SINGLE COURSE ----------------
export const getCourseByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: { photos: true, category: true, tutor: true },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// ---------------- UPDATE COURSE ----------------
export const updateCourseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateCourseSchema.parse(req.body);

    if (!req.user || req.user.role !== "TUTOR") {
      return res.status(403).json({ error: "Access denied: Tutors only" });
    }

    // Ensure the course belongs to this tutor
    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse || existingCourse.tutorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own courses" });
    }

    // Update main fields
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...data,
        photos: data.photos
          ? {
              deleteMany: {}, // remove old photos
              create: data.photos.map((url) => ({ url })), // add new ones
            }
          : undefined,
      },
      include: { photos: true, category: true },
    });

    res
      .status(200)
      .json({ message: "Course updated successfully", updatedCourse });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
    console.error(error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// ---------------- DELETE COURSE ----------------
export const deleteCourseController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.role !== "TUTOR") {
      return res.status(403).json({ error: "Access denied: Tutors only" });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || course.tutorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own courses" });
    }

    await prisma.coursePhoto.deleteMany({ where: { courseId: id } });
    await prisma.course.delete({ where: { id } });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
