import express from "express";
import {
  createReviewController,
  updateReviewController,
  deleteReviewController,
  getAverageRatingController,
} from "../controllers/reviewController";
import { authenticateUser } from "../middleware/authenticateUser";

const router = express.Router();

router.use(authenticateUser);

router.post("/", createReviewController);
router.patch("/:id", updateReviewController);
router.delete("/:id", deleteReviewController);
router.get("/average/:courseId", getAverageRatingController);

export default router;
