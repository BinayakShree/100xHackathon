import { Router } from "express";
import { authenticateUser } from "../middleware/authenticateUser";
import { authorizeTourist } from "../middleware/authorizeTourist";
import { authorizeTutor } from "../middleware/authorizeTutor";
import {
  createBookingController,
  getTouristBookingsController,
  getTutorBookingsController,
  tutorRespondBookingController,
  rescheduleBookingController,
} from "../controllers/bookingController";

const router = Router();

// Tourist: create booking with multiple options
router.post("/", authenticateUser, authorizeTourist, createBookingController);

// Tourist: view all their bookings
router.get(
  "/tourist",
  authenticateUser,
  authorizeTourist,
  getTouristBookingsController
);

// Tourist: reschedule a booking
router.put(
  "/:id/reschedule",
  authenticateUser,
  authorizeTourist,
  rescheduleBookingController
);

// Tutor: view all bookings for their courses
router.get(
  "/tutor",
  authenticateUser,
  authorizeTutor,
  getTutorBookingsController
);

// Tutor: respond to a booking
router.put(
  "/:id/respond",
  authenticateUser,
  authorizeTutor,
  tutorRespondBookingController
);

export default router;
