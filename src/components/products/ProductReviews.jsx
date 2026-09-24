"use client";

import { useEffect, useState } from "react";
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

  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);

  useEffect(() => {
    setReviews(
      Array.isArray(product?.reviews) ? product.reviews : []
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


  const normalizedReviews = reviews.map((review) => ({
    id: review?.id ?? Date.now(),

    name: review?.name ,

    rating: Number(review?.rating ?? 0),

    title:
      review?.title ||
      review?.reviewTitle ||
      "",

    review:review?.des,

    date:review?.createdAt ,

    images: Array.isArray(review?.images)
      ? review.images
      : [],
  }));

  const productReviewCount = Number(
    product?.reviewsCount ??
    0
  );

  const totalReviews = normalizedReviews.length;

  const baseRating = Number(
    product?.avgRating ??
    0
  );

  let averageRating = baseRating.toFixed(1);

  if (normalizedReviews.length) {
    const reviewTotal = normalizedReviews.reduce(
      (sum, review) =>
        sum + Number(review?.rating || 0),
      0
    );

    const existingCount = Math.max(
      productReviewCount - normalizedReviews.length,
      0
    );

    const totalCount =
      existingCount + normalizedReviews.length;

    if (totalCount) {
      const existingRatingTotal =
        baseRating * existingCount;

      averageRating = (
        (existingRatingTotal + reviewTotal) /
        totalCount
      ).toFixed(1);
    } else {
      averageRating = "0.0";
    }
  }

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
      toast.error(
        "Please select valid image files."
      );

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

        rating: Number(
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


      setIsReviewsExpanded(false);
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

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
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
    <div className="mt-12 max-w-full sm:mt-16 lg:mt-20">
    <div className="flex flex-row items-center justify-between gap-3 sm:items-end sm:gap-5">
  <SectionHeading>
    Customer Reviews ({totalReviews})
  </SectionHeading>

  <button
    type="button"
    onClick={() => setIsReviewFormOpen(true)}
    className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-[#E52323] px-4 text-[11px] font-black uppercase tracking-wide text-white transition hover:bg-[#ff2b2b] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:px-5 sm:text-xs"
  >
    Write a Review
  </button>
</div>

<div className="mt-5 flex flex-row gap-3 sm:mt-7 sm:gap-6">
  <div className="w-[120px] shrink-0 rounded-2xl border border-[#E5E5E5] bg-white p-3 text-center sm:w-[280px] sm:p-7">
    <p className="text-2xl font-black sm:text-5xl">{averageRating}</p>

    <div className="mt-2 flex flex-wrap justify-center gap-0.5 sm:mt-3 sm:gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 sm:h-5 sm:w-5 ${
            index < Math.round(Number(averageRating))
              ? "fill-[#F7B84B] text-[#F7B84B]"
              : "text-[#A3A3A3]"
          }`}
        />
      ))}
    </div>

    <p className="mt-2 text-[10px] text-[#737373] sm:mt-3 sm:text-sm">
      Based on {totalReviews} reviews
    </p>
  </div>

  <div className="min-w-0 flex-1 rounded-2xl border border-[#E5E5E5] bg-white p-3 sm:p-7">
    <p className="text-xs font-bold sm:text-sm">Customer reviews</p>

    <p className="mt-2 text-[11px] leading-5 text-[#737373] sm:mt-3 sm:text-sm sm:leading-6">
      This product currently has {totalReviews} customer reviews with an
      average rating of {averageRating} out of 5.
    </p>

  </div>
</div>

      {normalizedReviews.length > 0 && (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {normalizedReviews.map(
              (review, index) => {

                const shouldHideInitially =
                  !isReviewsExpanded &&
                  index >= 9;

                const hideMobileOnly =
                  !isReviewsExpanded &&
                  index >= 6 &&
                  index < 9;

                return (
                  <article
                    key={review.id}
                    className={`
                      flex flex-col rounded-2xl
                      border border-[#E5E5E5]
                      bg-white p-5
                      transition
                      hover:border-[#D4D4D4]
                      hover:shadow-sm
                      sm:p-6

                      ${shouldHideInitially
                        ? "hidden"
                        : ""
                      }

                      ${hideMobileOnly
                        ? "hidden lg:flex"
                        : ""
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-sm font-black uppercase text-white">
                          {review.name?.charAt(
                            0
                          ) || "?"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#111111]">
                            {review.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        {Array.from({
                          length: 5,
                        }).map(
                          (_, starIndex) => (
                            <Star
                              key={
                                starIndex
                              }
                              className={`h-4 w-4 ${starIndex <
                                  review.rating
                                  ? "fill-[#F7B84B] text-[#F7B84B]"
                                  : "text-[#D4D4D4]"
                                }`}
                            />
                          )
                        )}
                      </div>
                    </div>
                    {review.title && (
                      <h3 className="mt-3 text-sm font-bold leading-snug text-[#111111]">
                        {review.title}
                      </h3>
                    )}

                    {review.review && (
                      <p className="mt-2 flex-1 text-sm leading-6 text-[#525252]">
                        {review.review}
                      </p>
                    )}

                    {review.images.length >
                      0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {review.images.map(
                            (
                              image,
                              imageIndex
                            ) => {
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
                                  key={`${imageUrl}-${imageIndex}`}
                                  src={imageUrl}
                                  alt={`Review ${imageIndex +
                                    1
                                    }`}
                                  className="h-16 w-16 rounded-lg border border-[#E5E5E5] object-cover"
                                />
                              );
                            }
                          )}
                        </div>
                      )}
                  </article>
                );
              }
            )}
          </div>

          {totalReviews > 6 && (
            <div className="mt-8 flex justify-center lg:hidden">

              <button
                type="button"
                onClick={() =>
                  setIsReviewsExpanded(
                    (previous) =>
                      !previous
                  )
                }
                className="inline-flex min-w-[130px] items-center justify-center rounded-lg border border-[#E52323] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#E52323] transition hover:bg-[#E52323] hover:text-white"
              >
                {isReviewsExpanded
                  ? "Read Less"
                  : "Read More"}
              </button>

            </div>
          )}

          {totalReviews > 9 && (
            <div className="mt-8 hidden justify-center lg:flex">

              <button
                type="button"
                onClick={() =>
                  setIsReviewsExpanded(
                    (previous) =>
                      !previous
                  )
                }
                className="inline-flex min-w-[130px] items-center justify-center rounded-lg border border-[#E52323] px-6 py-3 text-xs font-black uppercase tracking-wide text-[#E52323] transition hover:bg-[#E52323] hover:text-white"
              >
                {isReviewsExpanded
                  ? "Read Less"
                  : "Read More"}
              </button>

            </div>
          )}
        </>
      )}

      {isReviewFormOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">

          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8">

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
              Tell other customers what
              you think about{" "}
              {product?.shortName ||
                product?.name ||
                "this product"}
              .
            </p>

            <form
              onSubmit={
                handleSubmitReview
              }
              className="mt-8 space-y-6"
            >

              <div>
                <label className="text-sm font-bold">
                  Your Rating *
                </label>

                <div className="mt-3 flex gap-2">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => {
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
                          setHoverRating(
                            0
                          )
                        }
                        disabled={
                          isSubmitting
                        }
                        className="transition hover:scale-110 disabled:cursor-not-allowed"
                        aria-label={`Rate ${starValue} stars`}
                      >
                        <Star
                          className={`h-7 w-7 ${starValue <=
                              (hoverRating ||
                                rating)
                              ? "fill-[#F7B84B] text-[#F7B84B]"
                              : "text-[#D4D4D4]"
                            }`}
                        />
                      </button>
                    );
                  })}
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
                  disabled={
                    isSubmitting
                  }
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
                  disabled={
                    isSubmitting
                  }
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
                  disabled={
                    isSubmitting
                  }
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
                      Click to add product
                      photos
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
                    disabled={
                      isSubmitting
                    }
                    className="hidden"
                  />
                </label>

                {reviewImages.length >
                  0 && (
                    <div className="mt-4 flex flex-wrap gap-3">

                      {reviewImages.map(
                        (image, index) => (
                          <div
                            key={`${image.preview}-${index}`}
                            className="relative h-20 w-20 overflow-hidden rounded-xl border border-[#E5E5E5]"
                          >
                            <img
                              src={
                                image.preview
                              }
                              alt={`Selected review image ${index + 1
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
                              aria-label={`Remove image ${index + 1
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
                  disabled={
                    isSubmitting
                  }
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
  return (<h2 className="text-2xl font-black uppercase tracking-tight sm:text-3xl">
    {children} </h2>
  );
}
