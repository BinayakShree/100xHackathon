"use client";

import { Star } from "lucide-react";

type Rating = {
  value: number;
  comment?: string;
};

interface RatingDisplayProps {
  ratings?: Rating[];
  showAddRating?: boolean;
  onAddRating?: (rating: Rating) => void;
}

export function RatingDisplay({
  ratings = [],
  showAddRating = false,
  onAddRating,
}: RatingDisplayProps) {
  const averageRating =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length) *
            10
        ) / 10
      : 0;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1">
          <Star
            className={`h-6 w-6 ${
              averageRating > 0 ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
          />
          <span className="text-2xl font-bold">
            {averageRating > 0 ? averageRating : "No ratings"}
          </span>
        </div>
        <span className="text-gray-500">({ratings.length} reviews)</span>
      </div>

      <div className="space-y-6">
        {ratings.map((rating, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < rating.value ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
            {rating.comment && <p className="text-gray-600">{rating.comment}</p>}
          </div>
        ))}

        {showAddRating && onAddRating && (
          <button
            onClick={() =>
              onAddRating({
                value: 5,
                comment: "Great experience!",
              })
            }
            className="inline-flex items-center gap-2 text-black font-medium hover:underline"
          >
            <Star className="h-4 w-4" />
            Add Review
          </button>
        )}
      </div>
    </div>
  );
}