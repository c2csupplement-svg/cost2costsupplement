"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  Heart,
} from "lucide-react";

import {
  getWishItem,
  deleteWishItem,
  clearWishList,
  moveToCart
} from "@/redux/features/wish/wishAction";

function formatPrice(price) {
  const value = Number(price);

  if (!Number.isFinite(value)) {
    return "₹ 0";
  }

  return `₹ ${value.toLocaleString("en-IN")}`;
}

function getImageUrl(image) {
  if (!image) {
    return null;
  }

  if (typeof image === "string") {
    const value = image.trim();
    return value || null;
  }

  if (typeof image === "object") {
    const value =
      image?.url ||
      image?.src ||
      image?.image ||
      image?.imageUrl ||
      image?.path ||
      image?.featuredimg ||
      image?.featuredImage;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getProductImage(product) {
  const variant = product?.variant;

  const sources = [
    variant?.image,
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.featuredimg,
    product?.featuredImage,
    product?.thumbnail,
    product?.image,
    product?.imageUrl,
  ];

  return sources.map(getImageUrl).find(Boolean) || "/placeholder-product.svg";
}

function normalizeWishlistItems(wishState) {
  const source =
    wishState?.wishItems?.wishlist ??
    wishState?.wishItems?.items ??
    wishState?.wishItems?.products ??
    wishState?.wishlist ??
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((item) => {
      if (!item) {
        return null;
      }

      const product =
        item?.product ??
        item?.productDetails ??
        item;

      if (!product) {
        return null;
      }

      const productId =
        item?.productId ??
        product?.id ??
        product?._id;

      const variant =
        item?.variant ??
        product?.selectedVariant ??
        product?.variant ??
        null;

      const variantId =
        item?.variantId ??
        variant?.id ??
        null;

      return {
        ...product,
        id: productId,
        wishlistItemId:
          item?.id ??
          item?._id ??
          productId,
        wishlistProductId: productId,
        variantId,
        variant,
        flavour:
          item?.flavour ??
          item?.flavor ??
          variant?.flavour ??
          variant?.flavor ??
          product?.selectedFlavour ??
          "",
        size:
          item?.size ??
          variant?.size ??
          product?.selectedSize ??
          "",
        stockStatus:
          item?.stockStatus ??
          product?.stockStatus ??
          null,
      };
    })
    .filter(Boolean);
}



export default function WishlistPage() {
  const dispatch = useDispatch();

  const wishState = useSelector((state) => state.wish);
  const [removingId, setRemovingId] = useState(null);
  const [movingToCartId, setMovingToCartId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const wishlist = useMemo(
    () => normalizeWishlistItems(wishState),
    [wishState]
  );

  const isLoading = Boolean(wishState?.loading);
  useEffect(() => {
    dispatch(getWishItem());
  }, [dispatch]);

  const handleRemove = async (product) => {
    const wishlistItemId =
      product?.wishlistItemId ??
      product?.id;

    if (!wishlistItemId || removingId) {
      return;
    }

    try {
      setRemovingId(wishlistItemId);

      await dispatch(
        deleteWishItem(wishlistItemId)
      ).unwrap?.() ??
        dispatch(
          deleteWishItem(wishlistItemId)
        );
    } catch (error) {
      console.error("Remove wishlist item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (product) => {
  const productId =
    product?.wishlistProductId ??
    product?.productId ??
    product?.id;

  if (!productId || movingToCartId) {
    return;
  }

  try {
    setMovingToCartId(productId);

    await dispatch(
      moveToCart({
        productId,
        variantId: product?.variantId ?? product?.variant?.id ?? null,
        quantity: 1,
      })
    );

    // await dispatch(
    //   deleteWishItem(
    //     product?.wishlistItemId ??
    //       productId
    //   )
    // );

    await dispatch(getWishItem());
  } catch (error) {
    console.error("Move wishlist item to cart:", error);
  } finally {
    setMovingToCartId(null);
  }
};

  const handleClearWishlist = async () => {
    if (clearing || wishlist.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire wishlist?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setClearing(true);

      await dispatch(clearWishList());

      await dispatch(getWishItem());
    } catch (error) {
      console.error("Clear wishlist:", error);
    } finally {
      setClearing(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-5 border-b border-border pb-6">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="text-text-secondary transition hover:text-primary"
            >
              Home
            </Link>

            <span className="text-text-muted">›</span>

            <span className="text-text-muted">
              Wishlist
            </span>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={clearing}
              className="rounded-lg border border-red-200 px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-primary hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {clearing
                ? "Clearing..."
                : "Clear Wishlist"}
            </button>
          )}
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-primary" />

            <h1 className="font-bebas text-5xl uppercase tracking-wide text-text-primary sm:text-6xl lg:text-7xl">
              Your Wishlist
            </h1>
          </div>

          <p className="mt-4 text-sm text-text-secondary sm:text-base">
            {isLoading
              ? "Loading your wishlist..."
              : wishlist.length === 0
                ? "Your wishlist is empty"
                : `There ${
                    wishlist.length === 1
                      ? "is"
                      : "are"
                  } ${wishlist.length} ${
                    wishlist.length === 1
                      ? "product"
                      : "products"
                  } in this list`}
          </p>
        </div>

        {isLoading && wishlist.length === 0 ? (
          <WishlistSkeleton />
        ) : wishlist.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border bg-card px-5 text-center shadow-[0_6px_25px_rgba(0,0,0,0.04)]">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-primary">
              <Heart className="h-9 w-9" />
            </div>

            <h2 className="font-oxanium text-2xl font-bold text-text-primary">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-sm text-text-muted">
              Save products here and come back to them later.
            </p>

            <Link
              href="/products"
              className="mt-7 flex items-center gap-2 rounded-lg bg-primary px-7 py-3 font-oxanium text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover hover:shadow-[0_8px_22px_rgba(229,35,35,0.20)]"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden rounded-xl border border-border bg-card px-8 py-5 shadow-[0_4px_18px_rgba(0,0,0,0.03)] md:grid md:grid-cols-[minmax(400px,1fr)_180px_170px_190px_60px] md:items-center md:gap-5">
              <span className="font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Product
              </span>

              <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Price
              </span>

              <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Stock Status
              </span>

              <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Action
              </span>

              <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Remove
              </span>
            </div>

            <div className="divide-y divide-border">
              {wishlist.map((product, index) => (
                <WishlistItem
                  key={
                    product?.wishlistItemId ??
                    product?.id ??
                    index
                  }
                  product={product}
                  formatPrice={formatPrice}
                  removing={
                    String(removingId) ===
                    String(product?.wishlistItemId)
                  }
                  movingToCart={
                    String(movingToCartId) ===
                    String(product?.id)
                  }
                  onRemove={() =>
                    handleRemove(product)
                  }
                  onMoveToCart={() =>
                    handleMoveToCart(product)
                  }
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function WishlistItem({
  product,
  formatPrice,
  removing,
  movingToCart,
  onRemove,
  onMoveToCart,
}) {
  const image = getProductImage(product);

  const variant = product?.variant ?? {};

  const discountedPrice = Number(
    variant?.discountedPrice ??
      product?.discountedPrice ??
      product?.salePrice ??
      0
  );

  const variantPrice = Number(
    variant?.price ??
      product?.price ??
      product?.originalPrice ??
      product?.mrp ??
      0
  );

  const price =
    discountedPrice > 0
      ? discountedPrice
      : variantPrice;

  const originalPrice =
    discountedPrice > 0 &&
    variantPrice > discountedPrice
      ? variantPrice
      : Number(
          product?.originalPrice ??
            product?.mrp ??
            0
        );

  const stock = Number(
    variant?.stockQuantity ??
      product?.stockQuantity ??
      product?.stock ??
      0
  );

  const inStock =
    product?.stockStatus
      ? product.stockStatus === "in_stock"
      : stock > 0;

  const productSlug =
    product?.slug ??
    product?.id;

  const productName =
    product?.name ??
    product?.title ??
    "Product";

  const brand =
    typeof product?.brand === "string"
      ? product.brand
      : product?.brand?.name ?? "";

  return (
    <div className="py-7 md:px-8">
      <div className="hidden md:grid md:grid-cols-[minmax(400px,1fr)_180px_170px_190px_60px] md:items-center md:gap-5">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={`/product/${productSlug}`}
            className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-border bg-white transition hover:border-border-strong"
          >
            <Image
              src={image}
              alt={productName}
              fill
              sizes="144px"
              className="object-contain p-4"
            />
          </Link>

          <div className="min-w-0">
            <Link
              href={`/product/${productSlug}`}
              className="line-clamp-2 max-w-[520px] font-oxanium text-base font-semibold leading-6 text-text-primary transition hover:text-primary"
            >
              {productName}
            </Link>

            {brand && (
              <p className="mt-2 font-oxanium text-xs text-text-muted">
                {brand}
              </p>
            )}

            {(variant?.flavour ||
              variant?.size) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {variant?.flavour && (
                  <span className="rounded-md bg-surface px-2 py-1 text-xs text-text-secondary">
                    {variant.flavour}
                  </span>
                )}

                {variant?.size && (
                  <span className="rounded-md bg-surface px-2 py-1 text-xs text-text-secondary">
                    {variant.size}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="text-center font-oxanium">
          <span className="font-semibold text-text-primary">
            {formatPrice(price)}
          </span>

          {originalPrice > price && (
            <span className="ml-2 text-sm text-text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <div className="flex justify-center">
          <span
            className={`rounded-md px-4 py-2 font-oxanium text-sm font-semibold ${
              inStock
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {inStock
              ? `In stock`
              : "Out of stock"}
          </span>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onMoveToCart}
            disabled={movingToCart || !inStock}
            className="rounded-full bg-primary px-5 py-3 font-oxanium text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {movingToCart ? "Moving..." : "Move to cart"}
          </button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="rounded-full p-2 text-text-muted transition hover:bg-red-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Remove ${productName} from wishlist`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-4 md:hidden">
        <Link
          href={`/product/${productSlug}`}
          className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-border bg-white"
        >
          <Image
            src={image}
            alt={productName}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${productSlug}`}
              className="line-clamp-2 font-oxanium text-sm font-semibold leading-5 text-text-primary transition hover:text-primary"
            >
              {productName}
            </Link>

            <button
              type="button"
              onClick={onRemove}
              disabled={removing}
              className="shrink-0 rounded-full p-1.5 text-text-muted transition hover:bg-red-50 hover:text-primary disabled:opacity-40"
              aria-label={`Remove ${productName}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {brand && (
            <p className="mt-1 font-oxanium text-xs text-text-muted">
              {brand}
            </p>
          )}

          {(variant?.flavour ||
            variant?.size) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {variant?.flavour && (
                <span className="rounded-md bg-surface px-2 py-1 text-xs text-text-secondary">
                  {variant.flavour}
                </span>
              )}

              {variant?.size && (
                <span className="rounded-md bg-surface px-2 py-1 text-xs text-text-secondary">
                  {variant.size}
                </span>
              )}
            </div>
          )}

          <div className="mt-3 font-oxanium">
            <span className="font-semibold text-text-primary">
              {formatPrice(price)}
            </span>

            {originalPrice > price && (
              <span className="ml-2 text-xs text-text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-3">
            <span
              className={`rounded-md px-3 py-1.5 font-oxanium text-xs font-semibold ${
                inStock
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {inStock
                ? `In stock${stock > 0 ? ` (${stock})` : ""}`
                : "Out of stock"}
            </span>
          </div>

          {inStock && (
            <button
              type="button"
              onClick={onMoveToCart}
              disabled={movingToCart}
              className="mt-4 rounded-full bg-primary px-4 py-2 font-oxanium text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {movingToCart ? "Moving..." : "Move to cart"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {Array.from({ length: 4 }).map(
        (_, index) => (
          <div
            key={index}
            className="flex gap-5 p-6"
          >
            <div className="h-28 w-28 shrink-0 animate-pulse rounded-xl bg-surface" />

            <div className="flex-1 space-y-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />

              <div className="h-4 w-1/4 animate-pulse rounded bg-surface" />

              <div className="h-9 w-28 animate-pulse rounded-full bg-surface" />
            </div>
          </div>
        )
      )}
    </div>
  );
}