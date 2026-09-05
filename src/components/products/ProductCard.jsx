"use client";

import { useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";

export default function ProductCard({ product }) {
  const {
    toggleWishlist,
    isInWishlist,
  } = useShop();

  const wishlistActive = isInWishlist(product?.id);

  const imageSrc = useMemo(() => {
    const images = product?.images;

    if (Array.isArray(images)) {
      for (const image of images) {
        if (
          typeof image === "string" &&
          image.trim()
        ) {
          return image.trim();
        }

        if (
          image &&
          typeof image === "object"
        ) {
          if (
            typeof image.url === "string" &&
            image.url.trim()
          ) {
            return image.url.trim();
          }

          if (
            typeof image.src === "string" &&
            image.src.trim()
          ) {
            return image.src.trim();
          }

          if (
            typeof image.image === "string" &&
            image.image.trim()
          ) {
            return image.image.trim();
          }

          if (
            typeof image.imageUrl === "string" &&
            image.imageUrl.trim()
          ) {
            return image.imageUrl.trim();
          }
        }
      }
    }

    if (
      typeof images === "string" &&
      images.trim()
    ) {
      return images.trim();
    }

    if (
      images &&
      typeof images === "object"
    ) {
      if (
        typeof images.url === "string" &&
        images.url.trim()
      ) {
        return images.url.trim();
      }

      if (
        typeof images.src === "string" &&
        images.src.trim()
      ) {
        return images.src.trim();
      }

      if (
        typeof images.image === "string" &&
        images.image.trim()
      ) {
        return images.image.trim();
      }

      if (
        typeof images.imageUrl === "string" &&
        images.imageUrl.trim()
      ) {
        return images.imageUrl.trim();
      }
    }

    if (
      typeof product?.featuredimg === "string" &&
      product.featuredimg.trim()
    ) {
      return product.featuredimg.trim();
    }

    if (
      typeof product?.featuredImage === "string" &&
      product.featuredImage.trim()
    ) {
      return product.featuredImage.trim();
    }

    return PLACEHOLDER_IMAGE;
  }, [
    product?.images,
    product?.featuredimg,
    product?.featuredImage,
  ]);

  const {
    price,
    originalPrice,
    discount,
  } = useMemo(() => {
    const topLevelPrice =
      Number(product?.price) || 0;

    const topLevelOriginalPrice =
      Number(product?.originalPrice) || 0;

    const topLevelDiscount =
      Number(product?.discount) || 0;

    if (topLevelPrice > 0) {
      const calculatedDiscount =
        topLevelDiscount > 0
          ? topLevelDiscount
          : topLevelOriginalPrice > topLevelPrice
          ? Math.round(
              ((topLevelOriginalPrice -
                topLevelPrice) /
                topLevelOriginalPrice) *
                100
            )
          : 0;

      return {
        price: topLevelPrice,
        originalPrice: topLevelOriginalPrice,
        discount: calculatedDiscount,
      };
    }

    const variants = Array.isArray(
      product?.variants
    )
      ? product.variants
      : [];

    const variant =
      variants.find(
        (item) =>
          Number(item?.discountedPrice) > 0 ||
          Number(item?.price) > 0
      ) || variants[0];

    if (!variant) {
      return {
        price: 0,
        originalPrice: 0,
        discount: 0,
      };
    }

    const basePrice =
      Number(variant?.price) || 0;

    const discountedPrice =
      variant?.discountedPrice !== null &&
      variant?.discountedPrice !== undefined &&
      Number(variant?.discountedPrice) > 0
        ? Number(variant.discountedPrice)
        : null;

    const displayPrice =
      discountedPrice !== null &&
      discountedPrice > 0
        ? discountedPrice
        : basePrice;

    const variantOriginalPrice =
      discountedPrice !== null &&
      discountedPrice < basePrice
        ? basePrice
        : 0;

    const variantDiscount =
      variantOriginalPrice > 0 &&
      discountedPrice !== null
        ? Math.round(
            ((variantOriginalPrice -
              discountedPrice) /
              variantOriginalPrice) *
              100
          )
        : Number(variant?.discount) || 0;

    return {
      price: displayPrice,
      originalPrice: variantOriginalPrice,
      discount: variantDiscount,
    };
  }, [product]);

  const productSlug =
    typeof product?.slug === "string" &&
    product.slug.trim()
      ? product.slug.trim()
      : product?.id
      ? String(product.id)
      : "";

  const productName =
    product?.name || "Product";

  const brandName =
    typeof product?.brand === "string"
      ? product.brand
      : product?.brand?.name || "";

  const categoryName =
    typeof product?.category === "string"
      ? product.category
      : product?.category?.name || "";

  const rating =
    Number(product?.rating) ||
    Number(product?.averageRating) ||
    0;

  const reviewCount =
    Number(product?.reviewCount) ||
    Number(product?._count?.reviews) ||
    (Array.isArray(product?.reviews)
      ? product.reviews.length
      : 0);

  const formattedPrice =
    Number(price) > 0
      ? Number(price).toLocaleString("en-IN")
      : "0";

  const formattedOriginalPrice =
    Number(originalPrice) > 0
      ? Number(originalPrice).toLocaleString(
          "en-IN"
        )
      : "0";

  const productHref = productSlug
    ? `/product/${productSlug}`
    : "/products";

  return (
    <article
      className="
        group
        relative
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/30
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.12)]
      "
    >
      {discount > 0 && (
        <div
          className="
            absolute
            left-0
            top-0
            z-20
            rounded-br-2xl
            bg-primary
            px-2.5
            py-1.5
            text-[8px]
            font-black
            uppercase
            tracking-wide
            text-white
            sm:px-4
            sm:py-2.5
            sm:text-[10px]
          "
        >
          -{discount}%
        </div>
      )}

      <Link
        href={productHref}
        className="block"
      >
        <div
          className="
            relative
            aspect-square
            overflow-hidden
            bg-surface
          "
        >
          <Image
            src={imageSrc}
            alt={productName}
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              310px
            "
            className="
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.06]
            "
            onError={(event) => {
              if (
                !event.currentTarget.src.includes(
                  PLACEHOLDER_IMAGE
                )
              ) {
                event.currentTarget.src =
                  PLACEHOLDER_IMAGE;
              }
            }}
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/20
              via-transparent
              to-transparent
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
            "
          />
        </div>
      </Link>

      <div
        className="
          flex
          flex-1
          flex-col
          p-3

          sm:p-5
        "
      >
        <div className="flex items-center justify-between gap-2">
          <p
            className="
              truncate
              text-[8px]
              font-black
              uppercase
              tracking-[0.18em]
              text-primary

              sm:text-[10px]
              sm:tracking-[0.2em]
            "
          >
            {brandName ||
              categoryName ||
              "Supplement"}
          </p>

          {categoryName &&
            brandName && (
              <span
                className="
                  hidden
                  truncate
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-text-muted

                  sm:block
                "
              >
                {categoryName}
              </span>
            )}
        </div>

        <Link
          href={productHref}
          className="mt-1.5 block"
        >
          <h3
            className="
              line-clamp-2
              text-[12px]
              font-black
              leading-[1.3]
              tracking-tight
              text-text-primary
              transition-colors
              duration-200
              group-hover:text-primary

              sm:text-[15px]
              sm:leading-5
            "
          >
            {productName}
          </h3>
        </Link>

        <div
          className="
            mt-2
            flex
            items-center
            gap-1.5

            sm:mt-3
            sm:gap-2
          "
        >
          <div className="flex items-center gap-px">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <Star
                key={index}
                className={`
                  h-2.5
                  w-2.5

                  sm:h-3.5
                  sm:w-3.5

                  ${
                    index <
                    Math.round(rating)
                      ? "fill-[#F7B84B] text-[#F7B84B]"
                      : "text-border"
                  }
                `}
              />
            ))}
          </div>

          <span
            className="
              text-[8px]
              font-semibold
              text-text-muted

              sm:text-[11px]
            "
          >
            {rating > 0
              ? rating.toFixed(1)
              : "0.0"}
          </span>

          {reviewCount > 0 && (
            <span
              className="
                hidden
                text-[10px]
                text-text-muted

                sm:inline
              "
            >
              ({reviewCount})
            </span>
          )}
        </div>

        <div
          className="
            mt-auto
            flex
            items-end
            justify-between
            gap-2
            pt-3

            sm:pt-5
          "
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span
                className="
                  whitespace-nowrap
                  text-[15px]
                  font-black
                  tracking-tight
                  text-text-primary

                  sm:text-xl
                "
              >
                ₹{formattedPrice}
              </span>

              {originalPrice > price && (
                <span
                  className="
                    hidden
                    text-xs
                    font-medium
                    text-text-muted
                    line-through

                    sm:inline
                  "
                >
                  ₹{formattedOriginalPrice}
                </span>
              )}
            </div>

            {discount > 0 && (
              <p
                className="
                  mt-0.5
                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-primary

                  sm:mt-1
                  sm:text-[9px]
                "
              >
                Save {discount}%
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}