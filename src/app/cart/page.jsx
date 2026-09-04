"use client";

import { useEffect, useMemo } from "react";
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
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCartItems,
  updateItemQuantity,
  deleteCartItem,
  clearCart
} from "@/redux/features/cart/cartActions";

export default function CartPage() {
  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.product);

  const cartData = cartState?.products?.cart ?? cartState?.products ?? {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartState?.products?.cart?.items ??
    [];

  const cart = Array.isArray(rawItems) ? rawItems : [];

  const cartCount = useMemo(() => {
    return cart.reduce(
      (total, item) => total + Number(item?.quantity || 0),
      0
    );
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const price = Number(
        item?.price ??
          item?.unitPrice ??
          item?.variant?.price ??
          item?.product?.price ??
          0
      );

      const quantity = Number(item?.quantity || 0);

      return total + price * quantity;
    }, 0);
  }, [cart]);

  const loading = Boolean(cartState?.loading);
  const error = cartState?.error;

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (!itemId) {
      return;
    }

    if (quantity <= 0) {
      try {
        await dispatch(deleteCartItem(itemId));
      } catch (error) {
        console.error("Delete cart item:", error);
      }

      return;
    }

    try {
      await dispatch(updateItemQuantity(itemId, quantity));
    } catch (error) {
      console.error("Update cart quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!itemId) {
      return;
    }

    try {
      await dispatch(deleteCartItem(itemId));
    } catch (error) {
      console.error("Remove cart item:", error);
    }
  };

  const handleClearCart = async () => {
    if (cart.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(clearCart());
      await dispatch(fetchCartItems());
    } catch (error) {
      console.error("Clear cart:", error);
    }
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price || 0);

    return `₹ ${numericPrice.toLocaleString("en-IN")}`;
  };

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
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

        {loading && cart.length === 0 ? (
          <CartSkeleton />
        ) : cart.length === 0 ? (
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

            {error && (
              <p className="mt-3 font-oxanium text-sm text-primary">
                {typeof error === "string"
                  ? error
                  : "Unable to load your cart."}
              </p>
            )}

            <Link
              href="/products"
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
          <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
            <section>
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

              <div className="divide-y divide-border">
                {cart.map((item, index) => (
                  <CartItem
                    key={
                      item?.id ??
                      item?.cartItemId ??
                      item?._id ??
                      `${item?.productId ?? item?.product?.id}-${index}`
                    }
                    item={item}
                    formatPrice={formatPrice}
                    updateCartQuantity={handleUpdateQuantity}
                    removeFromCart={handleRemoveItem}
                  />
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/products"
                  className="
                    inline-flex
                    items-center
                    justify-center
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

                <button
                  type="button"
                  onClick={handleClearCart}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-red-200
                    bg-card
                    px-6
                    py-3
                    font-oxanium
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wide
                    text-primary
                    transition
                    hover:border-primary
                    hover:bg-red-50
                  "
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </button>
              </div>

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
        )}
      </div>
    </main>
  );
}

function CartItem({
  item,
  formatPrice,
  updateCartQuantity,
  removeFromCart,
}) {
  const itemId =
    item?.id ??
    item?.cartItemId ??
    item?._id;

  const product = item?.product ?? item;

  const productId =
    item?.productId ??
    product?.id ??
    product?._id;

  const slug =
    item?.slug ??
    product?.slug ??
    "";

  const name =
    item?.name ??
    product?.name ??
    product?.title ??
    "Product";

  const images =
    item?.images ??
    product?.images ??
    [];

  const image =
    images?.[0]?.url ??
    images?.[0] ??
    item?.image ??
    product?.image ??
    "/placeholder-product.svg";

  const price = Number(
    item?.price ??
      item?.unitPrice ??
      item?.variant?.price ??
      product?.price ??
      0
  );

  const originalPrice = Number(
    item?.originalPrice ??
      item?.mrp ??
      item?.variant?.mrp ??
      product?.originalPrice ??
      product?.mrp ??
      0
  );

  const quantity = Number(item?.quantity || 0);

  const subtotal = price * quantity;

  const brand =
    item?.brand?.name ??
    item?.brand ??
    product?.brand?.name ??
    product?.brand ??
    "";

  const productHref = slug
    ? `/product/${encodeURIComponent(slug)}`
    : productId
      ? `/product/${productId}`
      : "/products";

  return (
    <div className="py-7 md:px-3">
      <div className="hidden md:grid md:grid-cols-[minmax(300px,1fr)_130px_140px_130px_45px] md:items-center md:gap-4">
        <div className="flex min-w-0 items-center gap-5">
          <Link
            href={productHref}
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
              src={image}
              alt={name}
              fill
              sizes="112px"
              className="object-contain p-3"
            />
          </Link>

          <div className="min-w-0">
            <Link
              href={productHref}
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
              {name}
            </Link>

            {brand && (
              <p className="mt-2 font-oxanium text-xs text-text-muted">
                {typeof brand === "string"
                  ? brand
                  : brand?.name || ""}
              </p>
            )}
          </div>
        </div>

        <div className="text-center font-oxanium">
          <span className="font-semibold text-text-primary">
            {formatPrice(price)}
          </span>

          {originalPrice > price && (
            <span className="mt-1 block text-xs text-text-muted line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <QuantityControl
          quantity={quantity}
          onDecrease={() =>
            updateCartQuantity(itemId, quantity - 1)
          }
          onIncrease={() =>
            updateCartQuantity(itemId, quantity + 1)
          }
          disabled={loadingQuantity(item)}
        />

        <div className="text-center font-oxanium font-bold text-text-primary">
          {formatPrice(subtotal)}
        </div>

        <button
          type="button"
          onClick={() => removeFromCart(itemId)}
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
          aria-label={`Remove ${name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-4 md:hidden">
        <Link
          href={productHref}
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
            src={image}
            alt={name}
            fill
            sizes="112px"
            className="object-contain p-3"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={productHref}
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
              {name}
            </Link>

            <button
              type="button"
              onClick={() => removeFromCart(itemId)}
              className="
                shrink-0
                rounded-full
                p-1
                text-text-muted
                transition
                hover:bg-red-50
                hover:text-primary
              "
              aria-label={`Remove ${name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {brand && (
            <p className="mt-1 font-oxanium text-xs text-text-muted">
              {typeof brand === "string"
                ? brand
                : brand?.name || ""}
            </p>
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

          <div className="mt-4 flex items-center justify-between gap-3">
            <QuantityControl
              quantity={quantity}
              onDecrease={() =>
                updateCartQuantity(itemId, quantity - 1)
              }
              onIncrease={() =>
                updateCartQuantity(itemId, quantity + 1)
              }
            />

            <span className="font-oxanium font-bold text-text-primary">
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        disabled={quantity <= 1}
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
          disabled:cursor-not-allowed
          disabled:opacity-40
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

function loadingQuantity() {
  return false;
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-5 border-b border-border pb-6"
            >
              <div className="h-28 w-28 shrink-0 rounded-xl bg-surface" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-2/3 rounded bg-surface" />
                <div className="h-4 w-1/3 rounded bg-surface" />
                <div className="h-10 w-32 rounded bg-surface" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside>
        <div className="animate-pulse rounded-2xl border border-border bg-card p-8">
          <div className="h-6 w-24 rounded bg-surface" />
          <div className="mt-6 h-10 w-40 rounded bg-surface" />
          <div className="my-7 h-px bg-border" />
          <div className="h-14 w-full rounded-lg bg-surface" />
        </div>
      </aside>
    </div>
  );
}