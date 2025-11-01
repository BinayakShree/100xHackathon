import { Router } from "express";
import { getAllCategoriesController } from "../controllers/categoryController";

const router = Router();

// Get all categories (public endpoint for dropdown)
router.get("/", getAllCategoriesController);

export default router;

