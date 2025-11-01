export type NotificationType = 
  | "BOOKING_PENDING" 
  | "BOOKING_CONFIRMED" 
  | "BOOKING_DECLINED" 
  | "BOOKING_RESCHEDULED";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date;
  userId: string;
  bookingId?: string;
}