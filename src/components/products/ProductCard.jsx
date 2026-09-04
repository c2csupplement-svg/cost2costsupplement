"use client";

import { useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useShop();

  const router = useRouter();

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

    return "/placeholder-product.svg";
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
        originalPrice:
          topLevelOriginalPrice,
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
        variant?.discountedPrice !==
        undefined &&
        Number(variant?.discountedPrice) > 0
        ? Number(
          variant.discountedPrice
        )
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
        : Number(
          variant?.discount
        ) || 0;

    return {
      price: displayPrice,
      originalPrice:
        variantOriginalPrice,
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
    Number(
      product?.reviewCount
    ) ||
    Number(
      product?._count?.reviews
    ) ||
    (Array.isArray(product?.reviews)
      ? product.reviews.length
      : 0);

  const formattedPrice =
    Number(price) > 0
      ? Number(price).toLocaleString(
        "en-IN"
      )
      : "0";

  const formattedOriginalPrice =
    Number(originalPrice) > 0
      ? Number(
        originalPrice
      ).toLocaleString("en-IN")
      : "0";

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
        rounded-xl
        border
        border-border
        bg-card
        transition-all
        duration-300
        sm:rounded-2xl
        hover:-translate-y-1
        hover:border-border-strong
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]
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
            py-1.5
            text-[8px]
            font-black
            uppercase
            tracking-wide
            text-white
            shadow-sm
            sm:rounded-br-2xl
            sm:px-4
            sm:py-2.5
            sm:text-[11px]
          "
        >
          -{discount}%
        </div>
      )}

      {/* <button
        type="button"
        onClick={() =>
          toggleWishlist(product)
        }
        className={`
          absolute
          right-2
          top-2
          z-30
          flex
          h-7
          w-7
          items-center
          justify-center
          rounded-full
          border
          shadow-md
          backdrop-blur-sm
          transition-all
          duration-300
          sm:right-4
          sm:top-4
          sm:h-10
          sm:w-10
          ${wishlistActive
            ? "border-[#E52323] bg-[#E52323] text-white shadow-[0_6px_18px_rgba(229,35,35,0.25)]"
            : "border-[#E5E5E5] bg-white text-[#333333] hover:border-[#E52323] hover:text-[#E52323]"
          }
        `}
        aria-label={
          wishlistActive
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
      >
        <Heart
          className="h-3.5 w-3.5 transition-transform duration-300 sm:h-[18px] sm:w-[18px]"
          fill={
            wishlistActive
              ? "#FFFFFF"
              : "none"
          }
          strokeWidth={
            wishlistActive ? 2.5 : 2
          }
        />
      </button> */}

      <Link
        href={
          productSlug
            ? `/product/${productSlug}`
            : "/products"
        }
        className="
          relative
          block
          aspect-square
          overflow-hidden
          bg-surface
        "
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-primary/0 transition-all duration-500 group-hover:bg-primary/[0.025]" />

        <Image
          src={imageSrc}
          alt={productName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.07]
          "
          onError={(event) => {
            if (
              event.currentTarget.src.includes(
                "/placeholder-product.svg"
              )
            ) {
              return;
            }

            event.currentTarget.src =
              "/placeholder-product.svg";
          }}
        />

        <div
          className="
            absolute
            bottom-2
            right-2
            z-20
            hidden
            h-7
            w-7
            translate-y-2
            items-center
            justify-center
            rounded-full
            bg-text-primary
            text-white
            opacity-0
            shadow-lg
            transition-all
            duration-300
            sm:flex
            sm:bottom-4
            sm:right-4
            sm:h-9
            sm:w-9
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        <div className="flex items-center justify-between gap-1">
          <p
            className="
              truncate
              text-[7px]
              font-black
              uppercase
              tracking-[0.12em]
              text-primary
              sm:text-[10px]
              sm:tracking-[0.2em]
            "
          >
            {brandName ||
              categoryName ||
              "Uncategorized"}
          </p>

          {brandName &&
            categoryName && (
              <span className="hidden truncate text-[10px] font-semibold uppercase tracking-wide text-text-muted sm:block">
                {categoryName}
              </span>
            )}
        </div>

        <Link
          href={
            productSlug
              ? `/product/${productSlug}`
              : "/products"
          }
          className="mt-1"
        >
          <h3
            className="
              line-clamp-2
              min-h-[20px]
              text-[11px]
              font-black
              leading-4
              tracking-tight
              text-text-primary
              transition-colors
              duration-200
              sm:min-h-[25px]
              sm:text-[15px]
              sm:leading-6
              group-hover:text-primary
            "
          >
            {productName}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1 sm:mt-3 sm:gap-2">
          <div className="flex items-center gap-px sm:gap-0.5">
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
                  ${index <
                    Math.round(
                      rating
                    )
                    ? "fill-[#F7B84B] text-[#F7B84B]"
                    : "text-[#D9D9D9]"
                  }
                `}
              />
            ))}
          </div>

          <span className="text-[8px] font-semibold text-text-muted sm:text-[11px]">
            {rating > 0
              ? rating.toFixed(1)
              : "0.0"}
          </span>

          <span className="hidden text-[11px] text-text-muted sm:inline">
            ({reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-1.5 pt-3 sm:gap-3 sm:pt-5">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="whitespace-nowrap text-[14px] font-black tracking-tight text-text-primary sm:text-xl">
                ₹{formattedPrice}
              </span>

              {originalPrice >
                price && (
                  <span className="hidden text-xs font-medium text-text-muted line-through sm:inline">
                    ₹
                    {
                      formattedOriginalPrice
                    }
                  </span>
                )}
            </div>

            {discount > 0 && (
              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-primary sm:mt-1 sm:text-[9px]">
                You save {discount}%
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              router.push(`/product/${productSlug}`);
            }}
            disabled={!productSlug}
            className="
              flex
              h-8
              shrink-0
              items-center
              justify-center
              rounded-md
              bg-primary
              px-2
              text-[8px]
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-[0_6px_18px_rgba(229,35,35,0.18)]
              transition-all
              duration-300
              sm:h-10
              sm:gap-2
              sm:rounded-lg
              sm:px-4
              sm:text-xs
              hover:-translate-y-0.5
              hover:bg-primary-hover
              hover:shadow-[0_8px_22px_rgba(229,35,35,0.25)]
              active:translate-y-0
            "
          >

            <span className="ml-1 sm:ml-0">
              View
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}