export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Review Types
export interface CreateReviewRequest {
  courseId: string;
  bookingId?: string;  // Optional: booking reference
  rating: number;      // 1 to 5
  comment?: string;    // Optional text
}

export interface ReviewResponse {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  bookingId?: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseReviewsResponse {
  reviews: ReviewResponse[];
  averageRating: number;
  totalReviews: number;
}

export interface AverageRatingResponse {
  courseId: string;
  averageRating: number;
  totalReviews: number;
}