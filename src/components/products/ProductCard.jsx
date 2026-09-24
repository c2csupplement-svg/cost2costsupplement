"use client";

import { useShop } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, ShoppingCart, Star, Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cart/cartActions";
import { toggleItem } from "@/redux/features/wish/wishAction";

const pickString = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

export default function ProductCard({ product, isWishlisted }) {
  const dispatch = useDispatch();
  const [isAddingToCart, setIsAddingToCart] = useState(false);


  const wishlistActive = isWishlisted;

  const featuredImage = product?.featuredImage || product?.featuredimg;
  const imageSrc =
    typeof featuredImage === "string"
      ? pickString(featuredImage)
      : pickString(
        featuredImage?.url,
        featuredImage?.src,
        featuredImage?.image,
        featuredImage?.imageUrl,
      );

  const { price, originalPrice, discount } = (() => {
    const productPrice = Number(product?.price) || 0;
    const productSalePrice = Number(product?.salePrice) || 0;

    if (productSalePrice > 0 && productPrice > productSalePrice) {
      return {
        price: productSalePrice,
        originalPrice: productPrice,
        discount: Math.round(
          ((productPrice - productSalePrice) / productPrice) * 100,
        ),
      };
    }

    if (productPrice > 0) {
      const original = Number(product?.originalPrice) || 0;
      const productDiscount = Number(product?.discount) || 0;
      const calculatedDiscount =
        productDiscount > 0
          ? productDiscount
          : original > productPrice
            ? Math.round(((original - productPrice) / original) * 100)
            : 0;

      return {
        price: productPrice,
        originalPrice: original,
        discount: calculatedDiscount,
      };
    }

    const variants = Array.isArray(product?.variants) ? product.variants : [];
    const variant =
      variants.find(
        (item) =>
          Number(item?.discountedPrice) > 0 ||
          Number(item?.salePrice) > 0 ||
          Number(item?.price) > 0,
      ) || variants[0];

    if (!variant) return { price: 0, originalPrice: 0, discount: 0 };

    const basePrice = Number(variant?.price) || 0;
    const discountedPrice =
      Number(variant?.discountedPrice) > 0
        ? Number(variant.discountedPrice)
        : Number(variant?.salePrice) > 0
          ? Number(variant.salePrice)
          : null;

    const displayPrice = discountedPrice !== null ? discountedPrice : basePrice;
    const variantOriginalPrice =
      discountedPrice !== null && discountedPrice < basePrice ? basePrice : 0;
    const variantDiscount =
      variantOriginalPrice > 0 && discountedPrice !== null
        ? Math.round(
          ((variantOriginalPrice - discountedPrice) / variantOriginalPrice) *
          100,
        )
        : Number(variant?.discount) || 0;

    return {
      price: displayPrice,
      originalPrice: variantOriginalPrice,
      discount: variantDiscount,
    };
  })();

  /* ---------- stock / variant ---------- */
  const selectedVariant =
    product?.variants?.find(
      (v) => Number(v?.stockQuantity ?? v?.stock ?? 0) > 0,
    ) ?? product?.variants?.[0];

  const inStock =
    Number(
      selectedVariant?.stockQuantity ??
      selectedVariant?.stock ??
      product?.stockQuantity ??
      product?.stock ??
      0,
    ) > 0;

  /* ---------- text fields ---------- */
  const productSlug =
    pickString(product?.slug) || (product?.id ? String(product.id) : "");
  const productName = product?.name || "Product";
  const brandName =
    typeof product?.brand === "string"
      ? product.brand
      : product?.brand?.name || "";
  const categoryName =
    typeof product?.category === "string"
      ? product.category
      : product?.category?.name || "";

  const reviewCount = Number(product?.reviewCount) || 0;
  const rating = Number(product?.avgRating) || 0;

  const formattedPrice = Number(price).toLocaleString("en-IN");
  const formattedOriginalPrice = Number(originalPrice).toLocaleString("en-IN");

  const productHref = productSlug
    ? `/products/${encodeURIComponent(productSlug)}`
    : "/products";

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!product || !inStock || isAddingToCart) return;

    if (!product.id || !selectedVariant?.id) {
      console.error("Product ID or Variant ID is missing");
      return;
    }

    try {
      setIsAddingToCart(true);
      await dispatch(
        addToCart({
          product: product.id,
          variantId: selectedVariant.id,
          quantity: 1,
        }),
      );
    } catch (error) {
      console.error("Add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async (event) => {

    event.preventDefault();
    event.stopPropagation();


    await dispatch(toggleItem(product.id, selectedVariant.id, selectedVariant?.attribute?.slug, selectedVariant?.size))

  };

  return (
    <article className="group relative flex h-full min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
      <div className="relative shrink-0">
        <Link
          href={productHref}
          aria-label={productName}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="relative h-[140px] overflow-hidden bg-surface sm:h-[250px]">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={productName}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 310px"
                className={`object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:p-5 ${!inStock ? "opacity-50 grayscale" : ""
                  }`}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingBag
                  className="h-8 w-8 text-text-muted sm:h-14 sm:w-14"
                  strokeWidth={1.25}
                />
              </div>
            )}
          </div>
        </Link>

        {discount > 0 && (
          <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold leading-4 sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-xs">
            {discount}% off
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlistActive ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={wishlistActive}
          className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur transition-all duration-200 hover:scale-105 hover:border-primary active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:right-3 sm:top-3 sm:h-9 sm:w-9"
        >
          <Heart
            className={`h-3 w-3 transition-colors sm:h-[18px] sm:w-[18px] ${wishlistActive
                ? "fill-red-500 text-red-500"
                : "text-text-muted group-hover:text-text-primary"
              }`}
          />
        </button>

        {!inStock && (
          <span className="absolute bottom-1.5 left-1.5 z-10 rounded-md bg-black/75 px-1.5 py-0.5 text-[9px] font-semibold text-white sm:bottom-3 sm:left-3 sm:text-xs">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[5px] md:text-[10px] font-bold uppercase tracking-[0.12em] text-primary sm:text-[11px]">
            {brandName || categoryName || "Supplement"}
          </p>

          {categoryName && brandName && (
            <span className="hidden max-w-[45%] truncate text-[11px] font-medium text-text-muted sm:block">
              {categoryName}
            </span>
          )}
        </div>

        <Link href={productHref} className="mt-1 block">
          <h3 className="line-clamp-2 min-h-[32px] text-[12px] font-bold leading-4 tracking-tight text-text-primary transition-colors duration-200 group-hover:text-primary sm:min-h-[40px] sm:text-[15px] sm:leading-5">
            {productName}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
          <div
            className="flex items-center gap-px"
            role="img"
            aria-label={`Rated ${rating.toFixed(1)} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${index < Math.round(rating)
                  ? "fill-[#F7B84B] text-[#F7B84B]"
                  : "text-border"
                  }`}
              />
            ))}
          </div>

          <span className="text-[10px] font-semibold text-text-muted sm:text-[11px]">
            {rating.toFixed(1)}
          </span>

          {reviewCount > 0 && (
            <span className="hidden text-[11px] text-text-muted sm:inline">
              ({reviewCount})
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3 sm:pt-4">
          <div className="min-w-0">
            {originalPrice > price ? (
              <span className="block text-[10px] font-medium leading-none text-text-muted line-through sm:text-xs">
                ₹{formattedOriginalPrice}
              </span>
            ) : (
              <span className="block h-[10px] sm:h-3" aria-hidden="true" />
            )}
            <span className="mt-1 block whitespace-nowrap text-[15px] font-black leading-none tracking-tight text-text-primary sm:text-xl">
              ₹{formattedPrice}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || isAddingToCart}
            aria-label={inStock ? `Add ${productName} to cart` : "Out of stock"}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 py-2 text-[11px] font-bold text-black transition-all duration-200 hover:opacity-90 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-xs"
          >
            {inStock && !isAddingToCart && (
              <Plus className="h-3 w-3 text-white sm:hidden" strokeWidth={2.5} />
            )}
            <ShoppingCart className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
            <span className="hidden text-white sm:inline">
              {!inStock ? "Sold out" : isAddingToCart ? "Adding…" : "Add to cart"}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}