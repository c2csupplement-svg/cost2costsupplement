"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";

import { addReviewApi } from "@/apiService/api";

export default function ProductReviews({ product }) {
  const [reviews, setReviews] = useState(
    Array.isArray(product?.reviews) ? product.reviews : []
  );
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [reviewImages, setReviewImages] = useState([]);

  useEffect(() => {
    setReviews(
      Array.isArray(product?.reviews)
        ? product.reviews
        : []
    );
  }, [product?.reviews]);

  useEffect(() => {
    return () => {
      reviewImages.forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [reviewImages]);

  const normalizedReviews = useMemo(() => {
    return reviews.map((review) => ({
      id: review?.id ?? Date.now(),
      name:
        review?.name ||
        review?.user?.name ||
        review?.user?.fullName ||
        reviewerName ||
        "Customer",
      rating: Number(review?.rating ?? 0),
      title:
        review?.title ||
        review?.reviewTitle ||
        "",
      review:
        review?.review ||
        review?.description ||
        review?.des ||
        review?.comment ||
        "",
      date:
        review?.createdAt ||
        review?.date ||
        "",
      images: Array.isArray(review?.images)
        ? review.images
        : [],
    }));
  }, [reviews, reviewerName]);

  const productReviewCount = Number(
    product?.reviewCount ??
      product?.reviewsCount ??
      0
  );

  const totalReviews =
    productReviewCount + normalizedReviews.length;

  const baseRating = Number(
    product?.rating ??
      product?.averageRating ??
      0
  );

  const averageRating = useMemo(() => {
    if (!normalizedReviews.length) {
      return baseRating.toFixed(1);
    }

    const reviewTotal = normalizedReviews.reduce(
      (sum, review) =>
        sum + Number(review?.rating || 0),
      0
    );

    const existingCount = Math.max(
      productReviewCount -
        normalizedReviews.length,
      0
    );

    const totalCount =
      existingCount +
      normalizedReviews.length;

    if (!totalCount) {
      return "0.0";
    }

    const existingRatingTotal =
      baseRating * existingCount;

    return (
      (existingRatingTotal + reviewTotal) /
      totalCount
    ).toFixed(1);
  }, [
    baseRating,
    normalizedReviews,
    productReviewCount,
  ]);

  const getProductId = () => {
    return (
      product?.id ??
      product?.productId ??
      product?._id
    );
  };

  const handleImagesChange = (event) => {
    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    const nextImages = files
      .filter((file) =>
        file.type.startsWith("image/")
      )
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    if (!nextImages.length) {
      toast.error("Please select valid image files.");
      event.target.value = "";
      return;
    }

    setReviewImages((previous) => [
      ...previous,
      ...nextImages,
    ]);

    event.target.value = "";
  };

  const removeReviewImage = (index) => {
    setReviewImages((previous) => {
      const image = previous[index];

      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return previous.filter(
        (_, itemIndex) => itemIndex !== index
      );
    });
  };

  const resetReviewForm = () => {
    reviewImages.forEach((image) => {
      if (image?.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setRating(0);
    setHoverRating(0);
    setReviewTitle("");
    setReviewText("");
    setReviewerName("");
    setReviewImages([]);
  };

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const productId = getProductId();

    if (!productId) {
      toast.error("Product ID is missing.");
      return;
    }

    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formdata = new FormData();

      formdata.append(
        "productId",
        String(productId)
      );

      formdata.append(
        "rating",
        String(rating)
      );

      formdata.append(
        "des",
        reviewText.trim()
      );

      for (const image of reviewImages) {
        if (image?.file) {
          formdata.append(
            "images",
            image.file
          );
        }
      }

      const response =
        await addReviewApi(formdata);


      const responseData =
        response?.data ?? response;

      if (responseData?.success === false) {
        throw new Error(
          responseData?.message ||
            "Failed to submit review."
        );
      }

      const returnedReview =
        responseData?.review ||
        responseData?.data?.review ||
        responseData?.data;

      const newReview = {
        id:
          returnedReview?.id ??
          `local-${Date.now()}`,
        name:
          returnedReview?.name ||
          returnedReview?.user?.name ||
          reviewerName.trim() ||
          "Anonymous Customer",
        rating:
          Number(
            returnedReview?.rating ??
              rating
          ),
        title:
          returnedReview?.title ||
          reviewTitle.trim(),
        review:
          returnedReview?.review ||
          returnedReview?.description ||
          returnedReview?.des ||
          reviewText.trim(),
        date:
          returnedReview?.createdAt ||
          new Date().toISOString(),
        images:
          Array.isArray(
            returnedReview?.images
          )
            ? returnedReview.images
            : [],
      };

      setReviews((previous) => [
        newReview,
        ...previous,
      ]);

      toast.success(
        responseData?.message ||
          "Review submitted successfully."
      );

      resetReviewForm();
      setIsReviewFormOpen(false);
    } catch (error) {
      console.error(
        "ADD REVIEW API ERROR:",
        error
      );

      console.error(
        "ADD REVIEW API RESPONSE:",
        error?.response?.data
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit review."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatReviewDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="mt-12 max-w-5xl sm:mt-16 lg:mt-20">
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
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Write a Review
        </button>
      </div>

      <div className="mt-7 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-7 text-center">
          <p className="text-5xl font-black">
            {averageRating}
          </p>

          <div className="mt-3 flex justify-center gap-1">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  className={`h-5 w-5 ${
                    index <
                    Math.round(
                      Number(averageRating)
                    )
                      ? "fill-[#F7B84B] text-[#F7B84B]"
                      : "text-[#A3A3A3]"
                  }`}
                />
              )
            )}
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
            This product currently has{" "}
            {totalReviews} customer reviews with
            an average rating of{" "}
            {averageRating} out of 5.
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-[#A3A3A3]">
            <Check className="h-4 w-4 text-[#E52323]" />
            Share your experience with other
            customers.
          </div>
        </div>
      </div>

      {normalizedReviews.length > 0 && (
        <div className="mt-8 space-y-4">
          {normalizedReviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-[#E5E5E5] bg-white p-6 sm:p-7"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index <
                            review.rating
                              ? "fill-[#F7B84B] text-[#F7B84B]"
                              : "text-[#D4D4D4]"
                          }`}
                        />
                      )
                    )}
                  </div>

                  {review.title && (
                    <h3 className="mt-3 text-base font-bold">
                      {review.title}
                    </h3>
                  )}

                  {review.review && (
                    <p className="mt-3 text-sm leading-6 text-[#525252]">
                      {review.review}
                    </p>
                  )}

                  {review.images.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {review.images.map(
                        (image, index) => {
                          const imageUrl =
                            typeof image ===
                            "string"
                              ? image
                              : image?.url ||
                                image?.image ||
                                image?.imageUrl;

                          if (!imageUrl) {
                            return null;
                          }

                          return (
                            <img
                              key={`${imageUrl}-${index}`}
                              src={imageUrl}
                              alt={`Review ${
                                index + 1
                              }`}
                              className="h-20 w-20 rounded-xl border border-[#E5E5E5] object-cover"
                            />
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-sm sm:text-right">
                  <p className="font-semibold text-[#111111]">
                    {review.name}
                  </p>

                  <p className="mt-1 text-xs text-[#A3A3A3]">
                    {formatReviewDate(
                      review.date
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {isReviewFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) {
                  setIsReviewFormOpen(false);
                }
              }}
              disabled={isSubmitting}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E5E5] text-[#525252] transition hover:border-[#E52323] hover:text-[#E52323] disabled:cursor-not-allowed disabled:opacity-50"
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

            <p className="mt-3 pr-8 text-sm leading-6 text-[#737373]">
              Tell other customers what you think
              about{" "}
              {product?.shortName ||
                product?.name ||
                "this product"}
              .
            </p>

            <form
              onSubmit={handleSubmitReview}
              className="mt-8 space-y-6"
            >
              <div>
                <label className="text-sm font-bold">
                  Your Rating *
                </label>

                <div className="mt-3 flex gap-2">
                  {Array.from({ length: 5 }).map(
                    (_, index) => {
                      const starValue =
                        index + 1;

                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() =>
                            setRating(
                              starValue
                            )
                          }
                          onMouseEnter={() =>
                            setHoverRating(
                              starValue
                            )
                          }
                          onMouseLeave={() =>
                            setHoverRating(0)
                          }
                          disabled={isSubmitting}
                          className="transition hover:scale-110 disabled:cursor-not-allowed"
                          aria-label={`Rate ${starValue} stars`}
                        >
                          <Star
                            className={`h-7 w-7 ${
                              starValue <=
                              (hoverRating ||
                                rating)
                                ? "fill-[#F7B84B] text-[#F7B84B]"
                                : "text-[#D4D4D4]"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

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
                    setReviewerName(
                      event.target.value
                    )
                  }
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                  className="mt-3 h-12 w-full rounded-lg border border-[#D4D4D4] px-4 text-sm outline-none transition focus:border-[#E52323] disabled:bg-[#F5F5F5]"
                />
              </div>

              <div>
                <label
                  htmlFor="reviewTitle"
                  className="text-sm font-bold"
                >
                  Review Title
                </label>

                <input
                  id="reviewTitle"
                  type="text"
                  value={reviewTitle}
                  onChange={(event) =>
                    setReviewTitle(
                      event.target.value
                    )
                  }
                  placeholder="Summarize your experience"
                  disabled={isSubmitting}
                  className="mt-3 h-12 w-full rounded-lg border border-[#D4D4D4] px-4 text-sm outline-none transition focus:border-[#E52323] disabled:bg-[#F5F5F5]"
                />
              </div>

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
                    setReviewText(
                      event.target.value
                    )
                  }
                  placeholder="Tell us about your experience with this product..."
                  disabled={isSubmitting}
                  className="mt-3 w-full resize-none rounded-lg border border-[#D4D4D4] px-4 py-3 text-sm outline-none transition focus:border-[#E52323] disabled:bg-[#F5F5F5]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="reviewImages"
                    className="text-sm font-bold"
                  >
                    Add Photos
                  </label>

                  <span className="text-xs text-[#A3A3A3]">
                    Optional
                  </span>
                </div>

                <label
                  htmlFor="reviewImages"
                  className="mt-3 flex min-h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#D4D4D4] bg-[#FAFAFA] px-4 py-5 transition hover:border-[#E52323] hover:bg-[#FFF8F8]"
                >
                  <div className="text-center">
                    <ImagePlus className="mx-auto h-6 w-6 text-[#737373]" />
                    <p className="mt-2 text-xs font-bold text-[#525252]">
                      Click to add product photos
                    </p>
                    <p className="mt-1 text-[11px] text-[#A3A3A3]">
                      JPG, PNG, WEBP
                    </p>
                  </div>

                  <input
                    id="reviewImages"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={
                      handleImagesChange
                    }
                    disabled={isSubmitting}
                    className="hidden"
                  />
                </label>

                {reviewImages.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {reviewImages.map(
                      (image, index) => (
                        <div
                          key={`${image.preview}-${index}`}
                          className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#E5E5E5]"
                        >
                          <img
                            src={image.preview}
                            alt={`Selected review image ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeReviewImage(
                                index
                              )
                            }
                            disabled={
                              isSubmitting
                            }
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-[#E52323] disabled:opacity-50"
                            aria-label={`Remove image ${
                              index + 1
                            }`}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmitting) {
                      setIsReviewFormOpen(
                        false
                      );
                    }
                  }}
                  disabled={isSubmitting}
                  className="h-12 rounded-lg border border-[#D4D4D4] px-6 text-xs font-black uppercase tracking-wide transition hover:border-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !rating ||
                    !reviewText.trim()
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#E52323] px-6 text-xs font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
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
