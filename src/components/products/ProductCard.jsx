"use client";

import { useMemo } from "react";
import { useShop } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, ArrowUpRight, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const wishlistActive = isInWishlist(product.id);

  // Pricing can arrive two shapes:
  // 1. Already-normalized (e.g. from the shop page's product mapping) -
  //    product.price / product.originalPrice / product.discount are plain numbers.
  // 2. Raw API product (e.g. product detail page) - price only lives
  //    inside variants[0].price / variants[0].discountedPrice, with no
  //    reliable top-level price/originalPrice for multi-variant products.
  const { price, originalPrice, discount } = useMemo(() => {
    if (product.price) {
      const normalizedDiscount =
        product.discount ??
        (product.originalPrice > product.price
          ? Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )
          : 0);

      return {
        price: product.price,
        originalPrice: product.originalPrice || 0,
        discount: normalizedDiscount,
      };
    }

    const variant = product.variants?.[0];

    if (variant) {
      const basePrice = Number(variant.price) || 0;
      const salePrice =
        variant.discountedPrice !== null &&
        variant.discountedPrice !== undefined
          ? Number(variant.discountedPrice)
          : null;

      const displayPrice =
        salePrice !== null && salePrice > 0 ? salePrice : basePrice;

      const variantOriginalPrice =
        salePrice !== null && salePrice < basePrice ? basePrice : 0;

      const variantDiscount =
        variantOriginalPrice > 0
          ? Math.round(
              ((variantOriginalPrice - salePrice) /
                variantOriginalPrice) *
                100
            )
          : 0;

      return {
        price: displayPrice,
        originalPrice: variantOriginalPrice,
        discount: variantDiscount,
      };
    }

    return { price: 0, originalPrice: 0, discount: 0 };
  }, [product]);

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
      {/* =====================================================
          DISCOUNT BADGE
      ===================================================== */}

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

      {/* =====================================================
          WISHLIST
      ===================================================== */}

      <button
        type="button"
        onClick={() => toggleWishlist(product)}
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
          ${
            wishlistActive
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
          fill={wishlistActive ? "#FFFFFF" : "none"}
          strokeWidth={wishlistActive ? 2.5 : 2}
        />
      </button>

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

      <Link
        href={`/product/${product.slug}`}
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
          src={product.images?.[0] || "/placeholder-product.png"}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          className="
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-[1.07]
          "
        />

        {/* View product indicator */}
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

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

      <div className="flex flex-1 flex-col p-2.5 sm:p-5">
        {/* Brand / Category */}

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
            {product.brand || product.category?.name || "Uncategorized"}
          </p>

          {product.brand && product.category?.name && (
            <span className="hidden truncate text-[10px] font-semibold uppercase tracking-wide text-text-muted sm:block">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Product Name */}

        <Link
          href={`/product/${product.slug}`}
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
            {product.name}
          </h3>
        </Link>

        {/* =================================================
            RATING
        ================================================= */}

        <div className="mt-1.5 flex items-center gap-1 sm:mt-3 sm:gap-2">
          <div className="flex items-center gap-px sm:gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`
                  h-2.5
                  w-2.5
                  sm:h-3.5
                  sm:w-3.5
                  ${
                    index < Math.round(product.rating ?? 0)
                      ? "fill-[#F7B84B] text-[#F7B84B]"
                      : "text-[#D9D9D9]"
                  }
                `}
              />
            ))}
          </div>

          <span className="text-[8px] font-semibold text-text-muted sm:text-[11px]">
            {product.rating ?? "0.0"}
          </span>

          <span className="hidden text-[11px] text-text-muted sm:inline">
            ({product.reviewCount ?? product.reviews ?? 0})
          </span>
        </div>

        {/* =================================================
            PRICE + ADD
        ================================================= */}

        <div className="mt-auto flex items-end justify-between gap-1.5 pt-3 sm:gap-3 sm:pt-5">
          {/* Price */}

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
              <span className="whitespace-nowrap text-[14px] font-black tracking-tight text-text-primary sm:text-xl">
                ₹{price ? price.toLocaleString("en-IN") : 0}
              </span>

              {originalPrice > price && (
                <span className="hidden text-xs font-medium text-text-muted line-through sm:inline">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {discount > 0 && (
              <p className="mt-0.5 text-[7px] font-bold uppercase tracking-wide text-primary sm:mt-1 sm:text-[9px]">
                You save {discount}%
              </p>
            )}
          </div>

          {/* Add to Cart */}

          <button
            type="button"
            onClick={() => addToCart(product)}
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
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 sm:ml-0">Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}   