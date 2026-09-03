"use client";

import { useMemo, useState } from "react";
import { Check, Star, X } from "lucide-react";

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  const totalReviews = product.reviewCount + reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return product.rating;

    const totalRating =
      product.rating * product.reviewCount +
      reviews.reduce((sum, review) => sum + review.rating, 0);

    return (totalRating / totalReviews).toFixed(1);
  }, [
    product.rating,
    product.reviewCount,
    reviews,
    totalReviews,
  ]);

  const handleSubmitReview = (event) => {
    event.preventDefault();

    if (!rating || !reviewTitle.trim() || !reviewText.trim()) {
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewerName.trim() || "Anonymous Customer",
      rating,
      title: reviewTitle.trim(),
      review: reviewText.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setReviews((prev) => [newReview, ...prev]);

    setRating(0);
    setHoverRating(0);
    setReviewTitle("");
    setReviewText("");
    setReviewerName("");
    setIsReviewFormOpen(false);
  };

  return (
    <div className="mt-20 max-w-5xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading>
          Customer Reviews ({totalReviews})
        </SectionHeading>

        <button
          type="button"
          onClick={() => setIsReviewFormOpen(true)}
          className="
            inline-flex
            h-11
            items-center
            justify-center
            rounded-lg
            bg-[#E52323]
            px-5
            text-xs
            font-black
            uppercase
            tracking-wide
            text-white
            transition
            hover:bg-[#ff2b2b]
          "
        >
          Write a Review
        </button>
      </div>

      {/* RATING SUMMARY */}
      <div className="mt-7 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 text-center">
          <p className="text-5xl font-black">
            {averageRating}
          </p>

          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.round(Number(averageRating))
                    ? "fill-[#F7B84B] text-[#F7B84B]"
                    : "text-[#A3A3A3]"
                }`}
              />
            ))}
          </div>

          <p className="mt-3 text-sm text-[#737373]">
            Based on {totalReviews} reviews
          </p>
        </div>

        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7">
          <p className="text-sm font-bold">
            Customer reviews
          </p>

          <p className="mt-3 text-sm leading-6 text-[#737373]">
            This product currently has {totalReviews} customer reviews
            with an average rating of {averageRating} out of 5.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#A3A3A3]">
            <Check className="h-4 w-4 text-[#E52323]" />

            Share your experience with other customers.
          </div>
        </div>
      </div>

      {/* REVIEW LIST */}
      {reviews.length > 0 && (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.rating
                            ? "fill-[#F7B84B] text-[#F7B84B]"
                            : "text-[#D4D4D4]"
                        }`}
                      />
                    ))}
                  </div>

                  <h3 className="mt-3 text-base font-bold">
                    {review.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#525252]">
                    {review.review}
                  </p>
                </div>

                <div className="shrink-0 text-sm sm:text-right">
                  <p className="font-semibold text-[#111111]">
                    {review.name}
                  </p>

                  <p className="mt-1 text-xs text-[#A3A3A3]">
                    {review.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isReviewFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setIsReviewFormOpen(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#525252] transition hover:border-[#E52323] hover:text-[#E52323]"
              aria-label="Close review form"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#E52323]">
              Share your experience
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              Write a Review
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#737373]">
              Tell other customers what you think about{" "}
              {product.shortName}.
            </p>

            <form
              onSubmit={handleSubmitReview}
              className="mt-8 space-y-6"
            >
              {/* RATING */}
              <div>
                <label className="text-sm font-bold">
                  Your Rating *
                </label>

                <div className="mt-3 flex gap-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starValue = index + 1;

                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() =>
                          setHoverRating(starValue)
                        }
                        onMouseLeave={() =>
                          setHoverRating(0)
                        }
                        className="transition hover:scale-110"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <Star
                          className={`h-7 w-7 ${
                            starValue <=
                            (hoverRating || rating)
                              ? "fill-[#F7B84B] text-[#F7B84B]"
                              : "text-[#D4D4D4]"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* NAME */}
              <div>
                <label
                  htmlFor="reviewerName"
                  className="text-sm font-bold"
                >
                  Your Name
                </label>

                <input
                  id="reviewerName"
                  type="text"
                  value={reviewerName}
                  onChange={(event) =>
                    setReviewerName(event.target.value)
                  }
                  placeholder="Enter your name"
                  className="mt-3 h-12 w-full rounded-lg border border-[#D4D4D4] px-4 text-sm outline-none transition focus:border-[#E52323]"
                />
              </div>

              {/* TITLE */}
              <div>
                <label
                  htmlFor="reviewTitle"
                  className="text-sm font-bold"
                >
                  Review Title *
                </label>

                <input
                  id="reviewTitle"
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(event) =>
                    setReviewTitle(event.target.value)
                  }
                  placeholder="Summarize your experience"
                  className="mt-3 h-12 w-full rounded-lg border border-[#D4D4D4] px-4 text-sm outline-none transition focus:border-[#E52323]"
                />
              </div>

              {/* REVIEW */}
              <div>
                <label
                  htmlFor="reviewText"
                  className="text-sm font-bold"
                >
                  Your Review *
                </label>

                <textarea
                  id="reviewText"
                  required
                  rows={5}
                  value={reviewText}
                  onChange={(event) =>
                    setReviewText(event.target.value)
                  }
                  placeholder="Tell us about your experience with this product..."
                  className="mt-3 w-full resize-none rounded-lg border border-[#D4D4D4] px-4 py-3 text-sm outline-none transition focus:border-[#E52323]"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsReviewFormOpen(false)}
                  className="h-12 rounded-lg border border-[#D4D4D4] px-6 text-xs font-black uppercase tracking-wide transition hover:border-[#111111]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!rating}
                  className="h-12 rounded-lg bg-[#E52323] px-6 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
      {children}
    </h2>
  );
}