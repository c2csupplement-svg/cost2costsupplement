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
      Number(product?.salePrice) ||
      Number(product?.price) ||
      0;

    const productPrice =
      Number(product?.price) || 0;

    const productSalePrice =
      Number(product?.salePrice) || 0;

    if (
      productSalePrice > 0 &&
      productPrice > productSalePrice
    ) {
      return {
        price: productSalePrice,
        originalPrice: productPrice,
        discount: Math.round(
          ((productPrice - productSalePrice) /
            productPrice) *
            100
        ),
      };
    }

    if (topLevelPrice > 0) {
      const topLevelOriginalPrice =
        Number(product?.originalPrice) || 0;

      const topLevelDiscount =
        Number(product?.discount) || 0;

      const calculatedDiscount =
        topLevelDiscount > 0
          ? topLevelDiscount
          : topLevelOriginalPrice >
            topLevelPrice
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
          Number(item?.salePrice) > 0 ||
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
      Number(variant?.discountedPrice) > 0
        ? Number(variant.discountedPrice)
        : Number(variant?.salePrice) > 0
        ? Number(variant.salePrice)
        : null;

    const displayPrice =
      discountedPrice !== null
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
    Number(product?.averageRating) ||
    Number(product?.rating) ||
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
      ? Number(
          originalPrice
        ).toLocaleString("en-IN")
      : "0";

  const productHref = productSlug
    ? `/product/${productSlug}`
    : "/products";

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (product?.id) {
      toggleWishlist(product.id);
    }
  };

  return (
    <article
  className="
    group
    relative
    flex
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
            rounded-br-xl
            bg-primary
            px-2
            py-1
            text-[7px]
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

      <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          wishlistActive
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        className="
          absolute
          right-2
          top-2
          z-20
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white/95
          text-text-primary
          shadow-sm
          transition-all
          duration-200
          hover:scale-105
          hover:text-primary
          sm:right-3
          sm:top-3
          sm:h-10
          sm:w-10
        "
      >
        <Heart
          className="
            h-4
            w-4
            sm:h-5
            sm:w-5
          "
          fill={
            wishlistActive
              ? "currentColor"
              : "none"
          }
        />
      </button>

      <Link
        href={productHref}
        className="block shrink-0"
      >
        <div
          className="
            relative
            h-[165px]
            overflow-hidden
            bg-surface
            sm:h-[250px]
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
              object-contain
              p-2
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
              sm:p-4
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
        </div>
      </Link>

     <div
  className="
    flex
    flex-col
    px-3
    pb-3
    pt-3
    sm:px-5
    sm:pb-5
    sm:pt-4
  "
>
        <div className="flex items-center justify-between gap-2">
          <p
            className="
              truncate
              text-[7px]
              font-black
              uppercase
              tracking-[0.15em]
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
          className="mt-1 block"
        >
          <h3
            className="
              line-clamp-2
              text-[11px]
              font-black
              leading-[14px]
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
            mt-1
            flex
            items-center
            gap-1
            sm:mt-2
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
              text-[7px]
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
            mt-2
            flex
            items-end
            justify-between
            gap-2
            sm:mt-4
          "
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span
                className="
                  whitespace-nowrap
                  text-[14px]
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
                  text-[6px]
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