import type { Request, Response } from "express";
import prisma from "../prisma/client";

// ---------------- GET ALL CATEGORIES ----------------
export const getAllCategoriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
      },
    });

    res.status(200).json({ count: categories.length, categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

