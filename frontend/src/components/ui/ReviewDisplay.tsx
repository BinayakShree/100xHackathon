"use client";

import { Rating } from "@/types/course";

interface ReviewDisplayProps {
  ratings: Rating[];
}

export const ReviewDisplay = ({ ratings }: ReviewDisplayProps) => {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const averageRating =
    ratings.reduce((acc, rating) => acc + rating.value, 0) / ratings.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Reviews</h3>
          <div className="flex items-center mt-1">
            <span className="text-yellow-400 text-xl mr-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.round(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </span>
            <span className="text-gray-600">
              {averageRating.toFixed(1)} ({ratings.length} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {ratings.map((rating) => (
          <div
            key={rating.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{rating.userName}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index}>
                      {index < rating.value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
            {rating.comment && (
              <p className="text-gray-700 mt-2">{rating.comment}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};