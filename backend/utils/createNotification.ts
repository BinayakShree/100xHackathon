import prisma from "../prisma/client";

export const createNotification = async ({
  userId,
  bookingId,
  title,
  message,
}: {
  userId: string;
  bookingId?: string;
  title: string;
  message: string;
}) => {
  try {
    await prisma.notification.create({
      data: {
        userId,
        bookingId,
        title,
        message,
      },
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
