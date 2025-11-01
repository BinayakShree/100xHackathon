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

    // Validate that category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      return res.status(400).json({
        error: "Category not found. Please provide a valid categoryId.",
      });
    }

    // Destructure photos from data to avoid conflict with nested create
    const { photos, ...courseData } = data;

    const course = await prisma.course.create({
      data: {
        ...courseData,
        tutorId: req.user.id,
        photos: { create: photos?.map((url) => ({ url })) || [] },
      },
      include: { photos: true, category: true },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error: any) {
    if (error.name === "ZodError")
      return res.status(400).json({ error: error.errors });
    if (error.code === "P2003") {
      return res.status(400).json({
        error: "Invalid categoryId. The category does not exist.",
      });
    }
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
      include: {
        photos: true,
        category: true,
        tutor: true,
        bookings: {
          include: {
            options: true,
            tutorResponse: true,
            tourist: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    // If user is tutor and owns this course, include all bookings
    // Otherwise, only show booking status (for privacy)
    const response: any = { ...course };

    if (req.user && req.user.role === "TUTOR" && course.tutorId === req.user.id) {
      // Tutor viewing their own course - show all booking details
      response.bookings = course.bookings;
    } else {
      // Hide booking details for non-tutor owners
      response.bookings = undefined;
    }

    res.status(200).json(response);
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

    // Validate category if being updated
    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        return res.status(400).json({
          error: "Category not found. Please provide a valid categoryId.",
        });
      }
    }

    // Destructure photos from data to avoid conflict with nested update
    const { photos, ...courseData } = data;

    // Update main fields
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        ...courseData,
        photos: photos
          ? {
              deleteMany: {}, // remove old photos
              create: photos.map((url) => ({ url })), // add new ones
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
