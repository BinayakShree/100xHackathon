import apiCall from './apiCall';
import {
  ApiResponse,
  CreateReviewRequest,
  ReviewResponse,
  CourseReviewsResponse,
  AverageRatingResponse,
} from './types';

export const reviewApi = {
  /**
   * Create a new review for a course
   * Only tourists who have booked and completed the course can create reviews
   */
  create: async (data: CreateReviewRequest): Promise<ApiResponse<ReviewResponse>> => {
    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      const response = await apiCall('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error cases
        if ('code' in error) {
          switch (error.code) {
            case 'ALREADY_REVIEWED':
              throw new Error('You have already reviewed this course');
            case 'BOOKING_NOT_FOUND':
              throw new Error('You must book and complete this course before reviewing');
            case 'BOOKING_NOT_ACCEPTED':
              throw new Error('Your booking must be accepted before you can review');
            case 'NOT_TOURIST':
              throw new Error('Only tourists can create reviews');
            default:
              throw new Error('Failed to submit review. Please try again later.');
          }
        }
      }
      throw new Error('Failed to submit review. Please try again later.');
    }
  },

  // Get course reviews
  getCourseReviews: async (courseId: string): Promise<ApiResponse<CourseReviewsResponse>> => {
    try {
      const response = await apiCall(`/api/reviews/course/${courseId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to load reviews. Please try again later.');
    }
  },

  // Get average rating for a course
  getAverageRating: async (courseId: string): Promise<ApiResponse<AverageRatingResponse>> => {
    try {
      const response = await apiCall(`/api/reviews/average/${courseId}`);
      return response;
    } catch (error) {
      throw new Error('Failed to load course rating. Please try again later.');
    }
  },

  /**
   * Update an existing review
   * Users can only update their own reviews
   */
  update: async (
    id: string, 
    data: Partial<Pick<ReviewResponse, 'rating' | 'comment'>>
  ): Promise<ApiResponse<ReviewResponse>> => {
    // Validate rating if provided
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error('Rating must be between 1 and 5');
    }

    try {
      const response = await apiCall(`/api/reviews/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'NOT_AUTHORIZED') {
        throw new Error('You can only edit your own reviews');
      }
      throw new Error('Failed to update review. Please try again later.');
    }
  },

  /**
   * Delete a review
   * Users can only delete their own reviews
   */
  delete: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await apiCall(`/api/reviews/${id}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'NOT_AUTHORIZED') {
        throw new Error('You can only delete your own reviews');
      }
      throw new Error('Failed to delete review. Please try again later.');
    }
  },
}