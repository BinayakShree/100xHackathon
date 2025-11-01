import express from "express";
import prisma from "../prisma/client";
import { authenticateUser } from "../middleware/authenticateUser";

const router = express.Router();
router.use(authenticateUser);

// Get all notifications
router.get("/", async (req, res) => {
  const user = req.user!;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({ count: notifications.length, notifications });
});

// Mark one as read
router.patch("/:id/read", async (req, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  res.json({ message: "Notification marked as read" });
});

// Mark all as read
router.patch("/mark-all-read", async (req, res) => {
  const user = req.user!;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await prisma.notification.updateMany({
    where: { userId: user.id },
    data: { isRead: true },
  });

  res.json({ message: "All notifications marked as read" });
});

// Delete one
router.delete("/:id", async (req, res) => {
  await prisma.notification.delete({
    where: { id: req.params.id },
  });
  res.json({ message: "Notification deleted" });
});

// Delete all
router.delete("/clear/all", async (req, res) => {
  const user = req.user!;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  await prisma.notification.deleteMany({
    where: { userId: user.id },
  });

  res.json({ message: "All notifications deleted" });
});

export default router;
