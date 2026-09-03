"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";

export default function WishlistPage() {
  const {
    wishlist,
    toggleWishlist,
    addToCart,
  } = useShop();

  const formatPrice = (price) =>
    `₹ ${price.toLocaleString("en-IN")}`;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">

          {/* Breadcrumb */}
          <div className="mb-14 flex items-center gap-3 border-b border-border pb-6 text-sm">
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

          {/* Header */}
          <div className="mb-10">
            <h1
              className="
                font-bebas
                text-5xl
                uppercase
                tracking-wide
                text-text-primary
                sm:text-6xl
                lg:text-7xl
              "
            >
              Your Wishlist
            </h1>

            <p className="mt-4 text-sm text-text-secondary sm:text-base">
              {wishlist.length === 0
                ? "Your wishlist is empty"
                : `There ${
                    wishlist.length === 1 ? "is" : "are"
                  } ${wishlist.length} ${
                    wishlist.length === 1
                      ? "product"
                      : "products"
                  } in this list`}
            </p>
          </div>

          {/* Empty Wishlist */}
          {wishlist.length === 0 ? (
            <div
              className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-border
                bg-card
                px-5
                text-center
                shadow-[0_6px_25px_rgba(0,0,0,0.04)]
              "
            >
              <div
                className="
                  mb-5
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-full
                  bg-surface
                  text-primary
                "
              >
                <span className="text-3xl">♡</span>
              </div>

              <h2 className="font-oxanium text-2xl font-bold text-text-primary">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                Save products here and come back to them later.
              </p>

              <Link
                href="/shop"
                className="
                  mt-7
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-primary
                  px-7
                  py-3
                  font-oxanium
                  text-sm
                  font-bold
                  uppercase
                  tracking-wide
                  text-white
                  transition
                  hover:bg-primary-hover
                  hover:shadow-[0_8px_22px_rgba(229,35,35,0.20)]
                "
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <>

              {/* Desktop Header */}
              <div
                className="
                  hidden
                  rounded-xl
                  border
                  border-border
                  bg-card
                  px-8
                  py-5
                  shadow-[0_4px_18px_rgba(0,0,0,0.03)]
                  md:grid
                  md:grid-cols-[minmax(400px,1fr)_180px_170px_190px_60px]
                  md:items-center
                  md:gap-5
                "
              >
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

              {/* Wishlist Items */}
              <div className="divide-y divide-border">
                {wishlist.map((product) => (
                  <WishlistItem
                    key={product.id}
                    product={product}
                    formatPrice={formatPrice}
                    onRemove={() =>
                      toggleWishlist(product)
                    }
                    onAddToCart={() =>
                      addToCart(product)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}


/* =================================
   WISHLIST ITEM
================================= */

function WishlistItem({
  product,
  formatPrice,
  onRemove,
  onAddToCart,
}) {
  return (
    <div className="py-7 md:px-8">

      {/* =========================
          DESKTOP
      ========================= */}
      <div className="hidden md:grid md:grid-cols-[minmax(400px,1fr)_180px_170px_190px_60px] md:items-center md:gap-5">

        {/* Product */}
        <div className="flex items-center gap-6">
          <Link
            href={`/product/${product.slug}`}
            className="
              relative
              h-36
              w-36
              shrink-0
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-white
              transition
              hover:border-border-strong
            "
          >
            <Image
              src={
                product.images?.[0] ||
                "/placeholder-product.png"
              }
              alt={product.name}
              fill
              sizes="144px"
              className="object-contain p-4"
            />
          </Link>

          <Link
            href={`/product/${product.slug}`}
            className="
              line-clamp-2
              max-w-[520px]
              font-oxanium
              text-base
              font-semibold
              leading-6
              text-text-primary
              transition
              hover:text-primary
            "
          >
            {product.name}
          </Link>
        </div>

        {/* Price */}
        <div className="text-center font-oxanium">
          <span className="font-semibold text-text-primary">
            {formatPrice(product.price)}
          </span>

          {product.originalPrice > product.price && (
            <span className="ml-2 text-sm text-text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex justify-center">
          <span
            className="
              rounded-md
              bg-green-50
              px-4
              py-2
              font-oxanium
              text-sm
              font-semibold
              text-green-600
            "
          >
            In stock
          </span>
        </div>

        {/* Action */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onAddToCart}
            className="
              flex
              items-center
              gap-2
              rounded-full
              bg-primary
              px-6
              py-3
              font-oxanium
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-white
              transition
              hover:bg-primary-hover
              hover:shadow-[0_8px_22px_rgba(229,35,35,0.20)]
            "
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>

        {/* Remove */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="
              rounded-full
              p-2
              text-text-muted
              transition
              hover:bg-red-50
              hover:text-primary
            "
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>


      {/* =========================
          MOBILE
      ========================= */}
      <div className="flex gap-4 md:hidden">

        {/* Image */}
        <Link
          href={`/product/${product.slug}`}
          className="
            relative
            h-28
            w-28
            shrink-0
            overflow-hidden
            rounded-xl
            border
            border-border
            bg-white
          "
        >
          <Image
            src={
              product.images?.[0] ||
              "/placeholder-product.png"
            }
            alt={product.name}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </Link>

        <div className="min-w-0 flex-1">

          {/* Name + Remove */}
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="
                line-clamp-2
                font-oxanium
                text-sm
                font-semibold
                leading-5
                text-text-primary
                transition
                hover:text-primary
              "
            >
              {product.name}
            </Link>

            <button
              type="button"
              onClick={onRemove}
              className="
                shrink-0
                rounded-full
                p-1.5
                text-text-muted
                transition
                hover:bg-red-50
                hover:text-primary
              "
              aria-label={`Remove ${product.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Price */}
          <div className="mt-3 font-oxanium">
            <span className="font-semibold text-text-primary">
              {formatPrice(product.price)}
            </span>

            {product.originalPrice > product.price && (
              <span className="ml-2 text-xs text-text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mt-3">
            <span
              className="
                rounded-md
                bg-green-50
                px-3
                py-1.5
                font-oxanium
                text-xs
                font-semibold
                text-green-600
              "
            >
              In stock
            </span>
          </div>

          {/* Add */}
          <button
            type="button"
            onClick={onAddToCart}
            className="
              mt-4
              flex
              items-center
              gap-2
              rounded-full
              bg-primary
              px-4
              py-2
              font-oxanium
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-white
              transition
              hover:bg-primary-hover
              hover:shadow-[0_6px_18px_rgba(229,35,35,0.18)]
            "
          >
            <ShoppingCart className="h-4 w-4" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}