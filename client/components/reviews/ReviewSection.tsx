"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquareQuote, Send, Loader2, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addReview, getReviewsByCompanyId, updateReview, deleteReview } from "@/modules/review/server/review-service";
import { timeAgo } from "@/lib/time-ago";
import { useSelector } from "react-redux";
import { errorNotification, successNotification } from "@/modules/notifications/server/notification-service";

interface Review {
  id: number;
  reviewerId: number;
  companyId: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName?: string;
}

export function ReviewSection({ companyId }: { companyId: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(5);

  // User state from redux (assumes it exists based on other components)
  const user = useSelector((state: any) => state.user);

  const hasReviewed = user?.id ? reviews.some((r) => r.reviewerId === user.id) : false;

  useEffect(() => {
    if (!companyId) return;
    
    getReviewsByCompanyId(companyId)
      .then((res) => {
        setReviews(res || []);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.id) {
      errorNotification("Login required", "You must be logged in to post a review.");
      return;
    }
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      const newReview = await addReview(user.id, companyId, rating, comment, user.name || "Anonymous");
      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
      successNotification("Success", "Review posted successfully!");
    } catch (err: any) {
      errorNotification("Error", err.response?.data?.errorMessage || "Failed to post review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      successNotification("Success", "Review deleted successfully!");
    } catch (err: any) {
      errorNotification("Error", "Failed to delete review");
    }
  };

  const startEditing = (review: Review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdate = async (e: React.FormEvent, reviewId: number) => {
    e.preventDefault();
    if (!editComment.trim()) return;

    setEditSubmitting(true);
    try {
      const updated = await updateReview(reviewId, user.id, companyId, editRating, editComment, user.name || "Anonymous");
      setReviews(reviews.map((r) => (r.id === reviewId ? updated : r)));
      setEditingId(null);
      successNotification("Success", "Review updated successfully!");
    } catch (err: any) {
      errorNotification("Error", "Failed to update review");
    } finally {
      setEditSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary shrink-0" />
        <p className="text-sm text-[#64748B] mt-4">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mt-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 rounded-full shrink-0 bg-yellow-400" />
        <h2 className="text-lg font-bold text-[#0F172A] tracking-tight flex items-center gap-2">
          Company Reviews
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">
            {reviews.length}
          </span>
        </h2>
      </div>

      {/* Review Form */}
      {user?.accountType === "APPLICANT" && !hasReviewed && (
        <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-blue-500" />
            Write a Review
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`transition-colors focus:outline-none`}
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                  } hover:text-yellow-400 transition-all`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-slate-500 ml-2">
              {rating} out of 5
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this company..."
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all placeholder:text-slate-400 min-h-[100px]"
            required
          />

          <div className="flex justify-end mt-3">
            <Button
              type="submit"
              disabled={submitting || !comment.trim() || rating === 0}
              className="rounded-xl font-semibold gap-2 px-6"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Post Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-slate-500">No reviews yet.</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to share your experience!</p>
          </div>
        ) : (
          <>
          {reviews.slice(0, visibleCount).map((review) => (
            <div key={review.id} className="p-5 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
              {editingId === review.id ? (
                <form onSubmit={(e) => handleUpdate(e, review.id)}>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setEditRating(star)}
                        className={`transition-colors focus:outline-none`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= editRating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                          } hover:text-yellow-400 transition-all`}
                        />
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all placeholder:text-slate-400 min-h-[100px] mb-3"
                    required
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(null)}
                      className="rounded-xl font-semibold px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={editSubmitting || !editComment.trim()}
                      className="rounded-xl font-semibold px-4"
                    >
                      {editSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {(review.reviewerName || "A")[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">
                            {review.reviewerName || "Anonymous User"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                            • {timeAgo(review.createdAt || new Date().toISOString())}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {user?.id === review.reviewerId && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(review)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Review"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mt-2 pl-11">
                    {review.comment}
                  </p>
                </>
              )}
            </div>
          ))}
          {visibleCount < reviews.length && (
            <div className="flex justify-center mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="rounded-xl px-6 font-semibold border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                View More Reviews
              </Button>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
}
