export interface Review {
  id: string;
  courseId: string;
  touristId: string;
  tourist?: {
    name: string;
  };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CourseReviews {
  averageRating: number;
  totalReviews: number;
  reviews?: Review[];
}