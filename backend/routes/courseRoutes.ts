import { Router } from "express";
import { createCourseController } from "../controllers/createCourseController";
import { authorizeTutor } from "../middleware/authorizeTutor";
import {
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
} from "../controllers/courseController";
const router = Router();
router.post("/createCourse", authorizeTutor, createCourseController);
router.get("/all", getAllCoursesController);
router.get("/course/:id", getCourseByIdController);
router.put("updateCourse/:id", authorizeTutor, updateCourseController);
router.delete("deleteCourse/:id", authorizeTutor, deleteCourseController);
export default router;
