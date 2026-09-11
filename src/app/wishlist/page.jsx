"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Trash2,
  ArrowRight,
  Heart,
  X,
  Loader2,
} from "lucide-react";

import {
  getWishItem,
  deleteWishItem,
  clearWishList,
  moveToCart,
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

      const product = item?.product ?? item?.productDetails ?? item;

      if (!product) {
        return null;
      }

      const productId = item?.productId ?? product?.id ?? product?._id;

      const variant =
        item?.variant ?? product?.selectedVariant ?? product?.variant ?? null;

      const variantId = item?.variantId ?? variant?.id ?? null;

      const basePrice =
        Number(variant?.price) ||
        Number(product?.price) ||
        Number(product?.originalPrice) ||
        Number(product?.mrp) ||
        0;

      const discountedPrice =
        variant?.discountedPrice !== null &&
        variant?.discountedPrice !== undefined &&
        variant?.discountedPrice !== ""
          ? Number(variant.discountedPrice)
          : null;

      const salePrice =
        discountedPrice !== null &&
        discountedPrice > 0 &&
        discountedPrice < basePrice
          ? discountedPrice
          : null;

      const displayPrice = salePrice !== null ? salePrice : basePrice;

      const originalPrice =
        salePrice !== null
          ? basePrice
          : Number(product?.originalPrice) || Number(product?.mrp) || basePrice;

      const discount =
        originalPrice > 0 && salePrice !== null && salePrice < originalPrice
          ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
          : Number(product?.discount) || 0;

      const stock = Number(
        variant?.stockQuantity ??
          item?.stockQuantity ??
          product?.stockQuantity ??
          product?.stock ??
          0
      );

      const stockStatus =
        item?.stockStatus ?? variant?.stockStatus ?? product?.stockStatus ?? null;

      const inStock = stockStatus ? stockStatus === "in_stock" : stock > 0;

      const attributes =
        item?.attributes ?? variant?.attributes ?? product?.attributes ?? [];

      return {
        ...product,
        id: productId,
        productId,
        wishlistItemId: item?.id ?? item?._id ?? productId,
        wishlistProductId: productId,
        variantId,
        variant,
        selectedVariant: variant,
        attributes,
        price: displayPrice,
        originalPrice,
        salePrice,
        discountedPrice: salePrice !== null ? salePrice : discountedPrice,
        discount,
        stockQuantity: stock,
        stockStatus,
        inStock,
        flavour:
          item?.flavour ??
          item?.flavor ??
          variant?.flavour ??
          variant?.flavor ??
          product?.selectedFlavour ??
          "",
        size: item?.size ?? variant?.size ?? product?.selectedSize ?? "",
      };
    })
    .filter(Boolean);
}

function VariantAttributes({ variant, product }) {
  const attributes = variant?.attributes ?? product?.attributes ?? [];

  if (!Array.isArray(attributes) || attributes.length === 0) {
    return null;
  }

  return (
    <>
      {attributes.map((item, index) => {
        const attributeName = item?.attribute?.name ?? item?.name ?? "";
        const attributeValue = item?.value ?? "";
        const unit = item?.attribute?.unit ?? item?.unit ?? "";

        if (!attributeName || !attributeValue) {
          return null;
        }

        return (
          <span
            key={item?.attribute?.id ?? `${attributeName}-${index}`}
            className="rounded-md bg-surface px-2 py-1 text-[11px] text-text-secondary"
          >
            {attributeName}: {attributeValue}
            {unit ? ` ${unit}` : ""}
          </span>
        );
      })}
    </>
  );
}

export default function WishlistPage() {
  const dispatch = useDispatch();

  const wishState = useSelector((state) => state.wish || {});

  const [removingId, setRemovingId] = useState(null);
  const [movingToCartId, setMovingToCartId] = useState(null);
  const [clearing, setClearing] = useState(false);

  const wishlist = normalizeWishlistItems(wishState);

  const isLoading = Boolean(wishState?.loading);

  useEffect(() => {
    dispatch(getWishItem());
  }, [dispatch]);

  const handleRemove = async (product) => {
    const wishlistItemId = product?.id;

    if (!wishlistItemId || removingId) {
      return;
    }

    try {
      setRemovingId(wishlistItemId);

      const action = dispatch(deleteWishItem(wishlistItemId));

      if (action?.unwrap) {
        await action.unwrap();
      } else {
        await action;
      }

      await dispatch(getWishItem());
    } catch (error) {
      console.error("Remove wishlist item:", error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleMoveToCart = async (product) => {
    const productId =
      product?.wishlistProductId ?? product?.productId ?? product?.id;

    const variantId = product?.variantId ?? product?.variant?.id ?? null;

    if (!productId || movingToCartId) {
      return;
    }

    try {
      setMovingToCartId(productId);

      await dispatch(
        moveToCart({
          productId,
          variantId,
          quantity: 1,
        })
      );

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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="text-text-secondary transition hover:text-primary"
            >
              Home
            </Link>

            <span className="text-text-muted">›</span>

            <span className="text-text-muted">Wishlist</span>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={handleClearWishlist}
              disabled={clearing}
              className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {clearing ? "Clearing..." : "Clear wishlist"}
            </button>
          )}
        </div>

        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="h-6 w-6" fill="currentColor" />
            </span>

            <div>
              <h1 className="font-bebas text-4xl uppercase leading-none tracking-wide text-text-primary sm:text-5xl">
                Your Wishlist
              </h1>

              <p className="mt-1.5 text-sm text-text-secondary">
                {isLoading
                  ? "Loading your saved products..."
                  : wishlist.length === 0
                  ? "Nothing saved yet"
                  : `${wishlist.length} ${
                      wishlist.length === 1 ? "product" : "products"
                    } saved for later`}
              </p>
            </div>
          </div>
        </div>

       {isLoading ? (
  <WishlistSkeleton />
) : wishlist.length === 0 ? (
  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-5 text-center">
    <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface text-primary">
      <Heart className="h-9 w-9" />
    </div>

    <h2 className="font-oxanium text-2xl font-bold text-text-primary">
      Your wishlist is empty
    </h2>

    <p className="mt-2 max-w-sm text-sm text-text-muted">
      Tap the heart on any product to save it here and pick up where you left
      off.
    </p>

    <Link
      href="/products"
      className="mt-7 flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-oxanium text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover hover:shadow-[0_8px_22px_rgba(229,35,35,0.20)]"
    >
      Continue Shopping
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
) : (
  <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
    {wishlist.map((product, index) => (
      <WishlistCard
        key={
          product?.wishlistItemId ??
          `${product?.productId}-${product?.variantId}` ??
          product?.id ??
          index
        }
        product={product}
        removing={
          String(removingId) === String(product?.wishlistItemId)
        }
        movingToCart={
          String(movingToCartId) ===
          String(
            product?.wishlistProductId ??
              product?.productId ??
              product?.id
          )
        }
        onRemove={() => handleRemove(product)}
        onMoveToCart={() => handleMoveToCart(product)}
      />
    ))}
  </div>
)}
      </div>
    </main>
  );
}

function WishlistCard({
  product,
  removing,
  movingToCart,
  onRemove,
  onMoveToCart,
}) {
  const image = getProductImage(product);

  const variant = product?.variant ?? product?.selectedVariant ?? {};

  const discountedPrice =
    Number(
      variant?.discountedPrice ??
        product?.discountedPrice ??
        product?.salePrice ??
        0
    ) || 0;

  const variantPrice =
    Number(
      variant?.price ??
        product?.originalPrice ??
        product?.price ??
        product?.mrp ??
        0
    ) || 0;

  const price =
    discountedPrice > 0 && discountedPrice < variantPrice
      ? discountedPrice
      : Number(product?.price) || variantPrice;

  const originalPrice =
    discountedPrice > 0 && variantPrice > discountedPrice
      ? variantPrice
      : Number(product?.originalPrice ?? product?.mrp ?? 0);

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : Number(product?.discount) || 0;

  const stock = Number(
    variant?.stockQuantity ?? product?.stockQuantity ?? product?.stock ?? 0
  );

  const inStock = product?.stockStatus
    ? product.stockStatus === "in_stock"
    : product?.inStock !== undefined
    ? product.inStock
    : stock > 0;

  const productSlug = product?.slug ?? product?.id;

  const productName = product?.name ?? product?.title ?? "Product";

  const brand =
    typeof product?.brand === "string" ? product.brand : product?.brand?.name ?? "";

  const flavour = variant?.flavour ?? variant?.flavor ?? "";
  const size = variant?.size ?? "";

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-border-strong hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] ${
        removing ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 bg-white">
        <Link href={`/products/${productSlug}`} className="absolute inset-0">
          <Image
            src={image}
            alt={productName}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-contain p-4"
          />
        </Link>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 font-oxanium text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          aria-label={`Remove ${productName} from wishlist`}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-text-secondary shadow-sm backdrop-blur transition hover:bg-primary hover:text-white disabled:cursor-not-allowed"
        >
          {removing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        {brand && (
          <p className="text-[10px] font-medium text-text-muted">{brand}</p>
        )}

        <Link
          href={`/products/${productSlug}`}
          className="mt-0.5 line-clamp-1 font-oxanium text-sm font-semibold leading-5 text-text-primary transition hover:text-primary"
        >
          {productName}
        </Link>

        {(flavour || size) && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {flavour && (
              <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary">
                {flavour}
              </span>
            )}

            {size && (
              <span className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary">
                {size}
              </span>
            )}

            <VariantAttributes variant={variant} product={product} />
          </div>
        )}

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-oxanium text-sm font-bold text-text-primary">
              {formatPrice(price)}
            </span>

            {originalPrice > price && (
              <span className="text-[11px] text-text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <span
            className={`flex shrink-0 items-center gap-1 text-[10px] font-semibold ${
              inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </div>

        <button
          type="button"
          onClick={onMoveToCart}
          disabled={movingToCart || !inStock}
          className="mt-2.5 w-full rounded-full bg-primary py-2 font-oxanium text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-text-muted disabled:opacity-60"
        >
          {movingToCart
            ? "Moving..."
            : inStock
            ? "Move to cart"
            : "Out of stock"}
        </button>
      </div>
    </div>
  );
}

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="aspect-[4/3] w-full animate-pulse bg-surface" />

          <div className="space-y-2 p-3">
            <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-surface" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface" />
            <div className="h-8 w-full animate-pulse rounded-full bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}