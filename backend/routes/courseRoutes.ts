import { Router } from "express";
import { authorizeTutor } from "../middleware/authorizeTutor";
import { authenticateUser } from "../middleware/authenticateUser";
import {
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
} from "../controllers/courseController";
import { createCourseController } from "../controllers/courseController";
const router = Router();
router.post("/createCourse",authenticateUser, authorizeTutor, createCourseController);
router.get("/all", getAllCoursesController);
router.get("/course/:id", getCourseByIdController);
router.put("updateCourse/:id", authorizeTutor, updateCourseController);
router.delete("deleteCourse/:id", authorizeTutor, deleteCourseController);
export default router;
