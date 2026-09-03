"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Trash2,
  Tag,
  Minus,
  Plus,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateCartQuantity,
  } = useShop();

  const formatPrice = (price) => {
    return `₹ ${price.toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">

          {/* =========================
              PAGE HEADER
          ========================= */}
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
              Your Cart
            </h1>

            <p className="mt-3 font-oxanium text-sm text-text-secondary sm:text-base">
              {cartCount === 0
                ? "Your cart is currently empty"
                : `There ${
                    cartCount === 1 ? "is" : "are"
                  } ${cartCount} ${
                    cartCount === 1 ? "product" : "products"
                  } in your cart`}
            </p>
          </div>

          {/* =========================
              EMPTY CART
          ========================= */}
          {cart.length === 0 ? (
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
                px-6
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
                "
              >
                <ShoppingBag className="h-9 w-9 text-text-muted" />
              </div>

              <h2 className="font-oxanium text-2xl font-bold text-text-primary">
                Your cart is empty
              </h2>

              <p className="mt-2 max-w-md font-oxanium text-sm text-text-muted">
                Looks like you haven't added anything to your cart yet.
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
                  font-semibold
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
              {/* =========================
                  CART CONTENT
              ========================= */}
              <div className="grid gap-8 lg:grid-cols-[1fr_390px]">

                {/* LEFT */}
                <section>

                  {/* TABLE HEADER */}
                  <div
                    className="
                      hidden
                      rounded-xl
                      border
                      border-border
                      bg-card
                      px-6
                      py-4
                      shadow-[0_4px_18px_rgba(0,0,0,0.03)]
                      md:grid
                      md:grid-cols-[minmax(300px,1fr)_130px_140px_130px_45px]
                      md:items-center
                      md:gap-4
                    "
                  >
                    <span className="font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                      Product
                    </span>

                    <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                      Unit Price
                    </span>

                    <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                      Quantity
                    </span>

                    <span className="text-center font-oxanium text-sm font-semibold uppercase tracking-wider text-text-secondary">
                      Subtotal
                    </span>

                    <span />
                  </div>

                  {/* PRODUCTS */}
                  <div className="divide-y divide-border">
                    {cart.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        formatPrice={formatPrice}
                        updateCartQuantity={updateCartQuantity}
                        removeFromCart={removeFromCart}
                      />
                    ))}
                  </div>

                  {/* CONTINUE SHOPPING */}
                  <div className="mt-8">
                    <Link
                      href="/shop"
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-border
                        bg-card
                        px-6
                        py-3
                        font-oxanium
                        text-sm
                        font-semibold
                        uppercase
                        tracking-wide
                        text-text-primary
                        transition
                        hover:border-primary
                        hover:text-primary
                      "
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </div>

                  {/* COUPON */}
                  <div className="mt-14 border-t border-border pt-10">
                    <h2 className="font-bebas text-3xl uppercase tracking-wide text-text-primary">
                      Apply Coupon
                    </h2>

                    <p className="mt-2 font-oxanium text-sm text-text-muted">
                      Using A Promo Code?
                    </p>

                    <div className="mt-6 flex max-w-[700px] flex-col gap-3 sm:flex-row">

                      <div
                        className="
                          flex
                          h-14
                          flex-1
                          items-center
                          rounded-lg
                          border
                          border-border
                          bg-card
                          px-4
                          transition
                          focus-within:border-primary
                        "
                      >
                        <input
                          type="text"
                          placeholder="Enter Your Coupon"
                          className="
                            w-full
                            bg-transparent
                            font-oxanium
                            text-sm
                            text-text-primary
                            outline-none
                            placeholder:text-text-muted
                          "
                        />
                      </div>

                      <button
                        type="button"
                        className="
                          flex
                          h-14
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-primary
                          px-8
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
                        <Tag className="h-4 w-4" />
                        Apply
                      </button>
                    </div>
                  </div>
                </section>

                {/* =========================
                    ORDER SUMMARY
                ========================= */}
                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <div
                    className="
                      rounded-2xl
                      border
                      border-border
                      bg-card
                      p-6
                      shadow-[0_8px_30px_rgba(0,0,0,0.05)]
                      sm:p-8
                    "
                  >

                    <div className="flex items-center justify-between">
                      <span className="font-oxanium text-sm text-text-secondary">
                        Total
                      </span>

                      <span className="font-oxanium text-2xl font-bold text-text-primary sm:text-3xl">
                        {formatPrice(cartTotal)}
                      </span>
                    </div>

                    <p className="mt-2 font-oxanium text-xs text-text-muted">
                      (Shipping fees not included)
                    </p>

                    <div className="my-7 h-px bg-border" />

                    <Link
                      href="/checkout"
                      className="
                        flex
                        h-14
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-lg
                        bg-primary
                        font-oxanium
                        text-sm
                        font-bold
                        uppercase
                        tracking-wide
                        text-white
                        transition
                        hover:bg-primary-hover
                        hover:shadow-[0_8px_22px_rgba(229,35,35,0.22)]
                      "
                    >
                      Proceed To Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </aside>
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
   CART ITEM
================================= */

function CartItem({
  item,
  formatPrice,
  updateCartQuantity,
  removeFromCart,
}) {
  const subtotal = item.price * item.quantity;

  return (
    <div className="py-7 md:px-3">

      {/* DESKTOP */}
      <div className="hidden md:grid md:grid-cols-[minmax(300px,1fr)_130px_140px_130px_45px] md:items-center md:gap-4">

        {/* Product */}
        <div className="flex min-w-0 items-center gap-5">

          <Link
            href={`/product/${item.slug}`}
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
              transition
              hover:border-border-strong
            "
          >
            <Image
              src={item.images?.[0] || "/placeholder-product.png"}
              alt={item.name}
              fill
              sizes="112px"
              className="object-contain p-3"
            />
          </Link>

          <div className="min-w-0">

            <Link
              href={`/product/${item.slug}`}
              className="
                line-clamp-2
                font-oxanium
                text-base
                font-semibold
                leading-6
                text-text-primary
                transition
                hover:text-primary
              "
            >
              {item.name}
            </Link>

            {item.brand && (
              <p className="mt-2 font-oxanium text-xs text-text-muted">
                {item.brand}
              </p>
            )}
          </div>
        </div>

        {/* Unit Price */}
        <div className="text-center font-oxanium">
          <span className="font-semibold text-text-primary">
            {formatPrice(item.price)}
          </span>

          {item.originalPrice > item.price && (
            <span className="mt-1 block text-xs text-text-muted line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Quantity */}
        <QuantityControl
          quantity={item.quantity}
          onDecrease={() =>
            updateCartQuantity(item.id, item.quantity - 1)
          }
          onIncrease={() =>
            updateCartQuantity(item.id, item.quantity + 1)
          }
        />

        {/* Subtotal */}
        <div className="text-center font-oxanium font-bold text-text-primary">
          {formatPrice(subtotal)}
        </div>

        {/* Remove */}
        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="
            mx-auto
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            text-text-muted
            transition
            hover:bg-red-50
            hover:text-primary
          "
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* MOBILE */}
      <div className="flex gap-4 md:hidden">

        <Link
          href={`/product/${item.slug}`}
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
            src={item.images?.[0] || "/placeholder-product.png"}
            alt={item.name}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </Link>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${item.slug}`}
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
              {item.name}
            </Link>

            <button
              type="button"
              onClick={() => removeFromCart(item.id)}
              className="
                shrink-0
                rounded-full
                p-1
                text-text-muted
                transition
                hover:bg-red-50
                hover:text-primary
              "
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 font-oxanium">
            <span className="font-semibold text-text-primary">
              {formatPrice(item.price)}
            </span>

            {item.originalPrice > item.price && (
              <span className="ml-2 text-xs text-text-muted line-through">
                {formatPrice(item.originalPrice)}
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <QuantityControl
              quantity={item.quantity}
              onDecrease={() =>
                updateCartQuantity(item.id, item.quantity - 1)
              }
              onIncrease={() =>
                updateCartQuantity(item.id, item.quantity + 1)
              }
            />

            <span className="font-oxanium font-bold text-text-primary">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =================================
   QUANTITY CONTROL
================================= */

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}) {
  return (
    <div
      className="
        flex
        h-11
        items-center
        overflow-hidden
        rounded-lg
        border
        border-border
        bg-card
      "
    >
      <button
        type="button"
        onClick={onDecrease}
        className="
          flex
          h-full
          w-10
          items-center
          justify-center
          text-text-secondary
          transition
          hover:bg-surface
          hover:text-primary
        "
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>

      <span
        className="
          flex
          h-full
          min-w-10
          items-center
          justify-center
          border-x
          border-border
          px-2
          font-oxanium
          text-sm
          font-semibold
          text-text-primary
        "
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="
          flex
          h-full
          w-10
          items-center
          justify-center
          text-text-secondary
          transition
          hover:bg-surface
          hover:text-primary
        "
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}