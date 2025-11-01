import { Router } from "express";
import { authorizeTutor } from "../middleware/authorizeTutor";
import { authenticateUser } from "../middleware/authenticateUser";
import { optionalAuthenticateUser } from "../middleware/optionalAuthenticateUser";
import {
  deleteCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  createCourseController,
} from "../controllers/courseController";
const router = Router();
router.post(
  "/createCourse",
  authenticateUser,
  authorizeTutor,
  createCourseController
);
router.get("/all", getAllCoursesController);
// Course detail - optional auth for tutors to see bookings
router.get("/course/:id", optionalAuthenticateUser, getCourseByIdController);
router.put(
  "/updateCourse/:id",
  authenticateUser,
  authorizeTutor,
  updateCourseController
);
router.delete(
  "/deleteCourse/:id",
  authenticateUser,
  authorizeTutor,
  deleteCourseController
);
export default router;
