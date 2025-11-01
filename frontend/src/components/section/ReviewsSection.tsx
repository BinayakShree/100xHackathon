"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getUser } from "@/lib/auth";
import type { Review, CourseReviews } from "@/types/review";

interface ReviewsSectionProps {
  courseId: string;
  onSubmitReview?: () => void;
}

const ReviewForm = ({ courseId, onSubmit }: { courseId: string; onSubmit: () => void }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setRating(0);
      setComment("");
      onSubmit();
    } catch (error) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg">Write a Review</h3>
      
      {/* Star Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Rating *</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRating(value);
                setError("");
              }}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 ${
                  value <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comment (Optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Share your experience..."
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h4 className="font-semibold">{review.tourist?.name || "Anonymous"}</h4>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              className={`h-4 w-4 ${
                value <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
      <span className="text-sm text-gray-500">
        {new Date(review.createdAt).toLocaleDateString()}
      </span>
    </div>
    {review.comment && <p className="text-gray-600">{review.comment}</p>}
  </div>
);

export default function ReviewsSection({ courseId, onSubmitReview }: ReviewsSectionProps) {
  const [reviewsData, setReviewsData] = useState<CourseReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getUser();

  const fetchReviews = async () => {
    try {
      const [reviewsResponse, averageResponse] = await Promise.all([
        fetch(`/api/reviews/course/${courseId}`),
        fetch(`/api/reviews/average/${courseId}`),
      ]);

      if (!reviewsResponse.ok || !averageResponse.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const reviews = await reviewsResponse.json();
      const averageData = await averageResponse.json();

      setReviewsData({
        reviews: reviews.reviews,
        ...averageData,
      });
    } catch (error) {
      setError("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [courseId]);

  const handleReviewSubmitted = () => {
    fetchReviews();
    onSubmitReview?.();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={`h-6 w-6 ${
                  value <= Math.round(reviewsData?.averageRating || 0)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div>
            <span className="font-semibold text-xl">
              {reviewsData?.averageRating?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-500 text-sm ml-2">
              ({reviewsData?.totalReviews} {reviewsData?.totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user && user.role === "TOURIST" && (
        <ReviewForm courseId={courseId} onSubmit={handleReviewSubmitted} />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsData?.reviews?.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No reviews yet</p>
        ) : (
          reviewsData?.reviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}