"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  fetchCartItems,
  updateItemQuantity,
  deleteCartItem,
  clearCart,
} from "@/redux/features/cart/cartActions";

import { couponApi, removeCouponApi, appplyCouponApi } from "@/apiService/api";

const PLACEHOLDER_IMAGE = "/placeholder-product.svg";


function formatPrice(value) {
  const number = Number(value || 0);

  return `₹ ${number.toLocaleString("en-IN")}`;
}

function getItemPrice(item) {
  return Number(
    item?.price ??
      item?.unitPrice ??
      item?.variant?.price ??
      item?.product?.price ??
      0
  );
}

function getItemImage(item) {
  const product = item?.product ?? item;

  const images =
    item?.images ??
    product?.images ??
    [];

  const firstImage = Array.isArray(images)
    ? images[0]
    : null;

  if (typeof firstImage === "string" && firstImage.trim()) {
    return firstImage;
  }

  if (
    firstImage &&
    typeof firstImage === "object"
  ) {
    return (
      firstImage?.url ||
      firstImage?.src ||
      firstImage?.image ||
      firstImage?.imageUrl ||
      PLACEHOLDER_IMAGE
    );
  }

  return (
    item?.image ||
    product?.image ||
    product?.featuredImage ||
    product?.featuredimg ||
    PLACEHOLDER_IMAGE
  );
}

function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) {
    return 0;
  }

  const discountValue =
    Number(coupon?.discountValue) || 0;

  const minimumCartValue =
    Number(coupon?.minCartValue) || 0;

  if (subtotal < minimumCartValue) {
    return 0;
  }

  if (
    coupon?.discountType ===
    "PERCENTAGE"
  ) {
    return Math.min(
      subtotal * (discountValue / 100),
      subtotal
    );
  }

  if (
    coupon?.discountType ===
    "FIXED"
  ) {
    return Math.min(
      discountValue,
      subtotal
    );
  }

  return 0;
}

function getCouponDescription(coupon) {
  if (
    coupon?.discountType ===
    "PERCENTAGE"
  ) {
    return `${coupon?.discountValue || 0}% OFF`;
  }

  if (
    coupon?.discountType ===
    "FIXED"
  ) {
    return `${formatPrice(
      coupon?.discountValue
    )} OFF`;
  }

  return "Special discount";
}

export default function CartPage() {
  const dispatch = useDispatch();

  const cartState = useSelector(
    (state) => state.product
  );

  const cartData =
    cartState?.products?.cart ??
    cartState?.products ??
    {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartState?.products?.cart?.items ??
    [];

  const cart = Array.isArray(rawItems)
    ? rawItems
    : [];

  const loading = Boolean(
    cartState?.loading
  );

  const error = cartState?.error;

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] =
    useState("");
  const [appliedCoupon, setAppliedCoupon] =
    useState(null);
  const [couponDiscount, setCouponDiscount] =
    useState(0);
  const [couponLoading, setCouponLoading] =
    useState(false);
  const [couponError, setCouponError] =
    useState("");

  const cartCount = cart.reduce(
    (total, item) =>
      total +
      Number(item?.quantity || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => {
      const price = getItemPrice(item);
      const quantity =
        Number(item?.quantity) || 0;

      return total + price * quantity;
    },
    0
  );

  const finalTotal = Math.max(
    0,
    cartTotal - couponDiscount
  );

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setCouponLoading(true);

        const response =
          await couponApi();

        const data =
          response?.data ??
          response;

        if (
          data?.success &&
          Array.isArray(data?.coupons)
        ) {
          setCoupons(data.coupons);
        } else {
          setCoupons([]);
        }
      } catch (error) {
        console.error(
          "Coupon API error:",
          error?.response?.data ||
            error?.message
        );

        setCoupons([]);
      } finally {
        setCouponLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const handleUpdateQuantity = async (
    item,
    quantity
  ) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) {
      toast.error(
        "Cart item ID is missing."
      );
      return;
    }

    try {
      if (quantity <= 0) {
        await dispatch(
          deleteCartItem(itemId)
        );

        toast.success(
          "Item removed from cart."
        );
      } else {
        await dispatch(
          updateItemQuantity(
            itemId,
            quantity
          )
        );
      }

      await dispatch(
        fetchCartItems()
      );

      if (appliedCoupon) {
        const newSubtotal =
          cart.reduce(
            (total, currentItem) => {
              if (
                currentItem?.id === itemId
              ) {
                const price =
                  getItemPrice(
                    currentItem
                  );

                return (
                  total +
                  price * quantity
                );
              }

              return (
                total +
                getItemPrice(
                  currentItem
                ) *
                  Number(
                    currentItem?.quantity ||
                      0
                  )
              );
            },
            0
          );

        const discount =
          calculateCouponDiscount(
            appliedCoupon,
            newSubtotal
          );

        if (discount > 0) {
          setCouponDiscount(
            discount
          );
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponCode("");
        }
      }
    } catch (error) {
      console.error(
        "Cart quantity error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to update cart."
      );
    }
  };

  const handleRemoveItem = async (
    item
  ) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) {
      return;
    }

    try {
      await dispatch(
        deleteCartItem(itemId)
      );

      await dispatch(
        fetchCartItems()
      );

      toast.success(
        "Item removed from cart."
      );

      if (cart.length <= 1) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
      }
    } catch (error) {
      console.error(
        "Remove cart item:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to remove item."
      );
    }
  };

  const handleClearCart = async () => {
    if (cart.length === 0) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to clear your entire cart?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(
        clearCart()
      );

      await dispatch(
        fetchCartItems()
      );

      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode("");

      toast.success(
        "Cart cleared successfully."
      );
    } catch (error) {
      console.error(
        "Clear cart:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to clear cart."
      );
    }
  };

  const handleApplyCoupon = async (coupon) => {
    if (!coupon) {
      setCouponError("Invalid coupon code.");
      return;
    }

    if (couponLoading) {
      return;
    }

    const subtotal = Number(cartTotal) || 0;
    const minimumCartValue =
      Number(coupon?.minCartValue) || 0;

    if (
      minimumCartValue > 0 &&
      subtotal < minimumCartValue
    ) {
      const message = `Minimum cart value is ${formatPrice(
        minimumCartValue
      )}.`;

      setCouponError(message);

      toast.error(
        `Add ${formatPrice(
          minimumCartValue - subtotal
        )} more to use ${coupon.code}.`
      );

      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");

      const response = await appplyCouponApi({
        code: coupon.code,
        couponId: coupon.id,
        cartValue: subtotal,
        cartTotal: subtotal,
      });

      const data = response?.data ?? response;

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to apply coupon."
        );
      }

      const serverCoupon =
        data?.coupon ||
        data?.appliedCoupon ||
        coupon;

      const serverDiscount =
        Number(
          data?.discount ??
            data?.discountAmount ??
            data?.couponDiscount
        );

      const discount =
        Number.isFinite(serverDiscount) &&
        serverDiscount > 0
          ? serverDiscount
          : calculateCouponDiscount(
              serverCoupon,
              subtotal
            );

      if (discount <= 0) {
        throw new Error(
          data?.message ||
            "This coupon cannot be applied."
        );
      }

      setAppliedCoupon(serverCoupon);
      setCouponDiscount(discount);
      setCouponCode(serverCoupon?.code || coupon.code);
      setCouponError("");

      toast.success(
        `Coupon ${
          serverCoupon?.code || coupon.code
        } applied successfully.`,
        {
          description: `You saved ${formatPrice(discount)}.`,
        }
      );
    } catch (error) {
      console.error(
        "Apply coupon API error:",
        error?.response?.data || error?.message
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to apply coupon.";

      setCouponError(message);
      setAppliedCoupon(null);
      setCouponDiscount(0);

      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCouponSubmit = async (event) => {
    event.preventDefault();

    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    const coupon = coupons.find(
      (item) =>
        String(item?.code || "").toUpperCase() === code
    );

    if (!coupon) {
      setCouponError("Invalid coupon code.");
      toast.error("Coupon code not found.");
      return;
    }

    await handleApplyCoupon(coupon);
  };

  const handleRemoveCoupon = async () => {
    if (!appliedCoupon) {
      return;
    }

    try {
      setCouponLoading(true);

      const response = await removeCouponApi({
        couponId: appliedCoupon.id,
        code: appliedCoupon.code,
      });

      const data = response?.data ?? response;

      if (data?.success === false) {
        throw new Error(
          data?.message || "Unable to remove coupon."
        );
      }

      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode("");
      setCouponError("");

      toast.success("Coupon removed.");
    } catch (error) {
      console.error(
        "Remove coupon API error:",
        error?.response?.data || error?.message
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to remove coupon."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  if (
    loading &&
    cart.length === 0
  ) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto flex min-h-[620px] max-w-[1440px] flex-col items-center justify-center px-5 text-center sm:px-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
            <ShoppingBag className="h-9 w-9 text-text-muted" />
          </div>

          <h1 className="bebas mt-6 text-4xl uppercase tracking-wide sm:text-5xl">
            Your Cart Is Empty
          </h1>

          <p className="oxanium mt-3 max-w-md text-sm leading-6 text-text-muted">
            Add some products to your cart before proceeding.
          </p>

          {error && (
            <p className="oxanium mt-3 text-sm text-primary">
              {typeof error === "string"
                ? error
                : "Unable to load your cart."}
            </p>
          )}

          <Link
            href="/products"
            className="oxanium mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary-hover"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="oxanium text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Shopping Cart
            </p>

            <h1 className="bebas mt-2 text-5xl uppercase tracking-wide sm:text-6xl lg:text-7xl">
              Your Cart
            </h1>

            <p className="oxanium mt-2 text-sm text-text-muted">
              {cartCount}{" "}
              {cartCount === 1
                ? "product"
                : "products"}{" "}
              in your cart
            </p>
          </div>

          <Link
            href="/products"
            className="oxanium inline-flex w-fit items-center gap-2 text-sm font-semibold text-text-muted transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-8">
          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="hidden grid-cols-[minmax(300px,1fr)_130px_140px_130px_45px] items-center gap-4 border-b border-border bg-surface px-6 py-4 md:grid">
                <span className="oxanium text-xs font-bold uppercase tracking-wider text-text-muted">
                  Product
                </span>

                <span className="oxanium text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                  Unit Price
                </span>

                <span className="oxanium text-center text-xs font-bold uppercase tracking-wider text-text-muted">
                  Quantity
                </span>

                <span className="oxanium text-right text-xs font-bold uppercase tracking-wider text-text-muted">
                  Subtotal
                </span>

                <span />
              </div>

              <div className="divide-y divide-border">
                {cart.map(
                  (item, index) => (
                    <CartItem
                      key={
                        item?.id ??
                        item?.cartItemId ??
                        item?._id ??
                        index
                      }
                      item={item}
                      formatPrice={
                        formatPrice
                      }
                      onDecrease={() =>
                        handleUpdateQuantity(
                          item,
                          Number(
                            item?.quantity ||
                              0
                          ) - 1
                        )
                      }
                      onIncrease={() =>
                        handleUpdateQuantity(
                          item,
                          Number(
                            item?.quantity ||
                              0
                          ) + 1
                        )
                      }
                      onRemove={() =>
                        handleRemoveItem(
                          item
                        )
                      }
                    />
                  )
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-border bg-card px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <Link
                  href="/products"
                  className="oxanium inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-primary hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>

                <button
                  type="button"
                  onClick={
                    handleClearCart
                  }
                  className="oxanium inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 px-5 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Tag className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="bebas text-2xl uppercase tracking-wide sm:text-3xl">
                    Apply Coupon
                  </h2>

                  <p className="oxanium mt-1 text-xs text-text-muted sm:text-sm">
                    Enter a coupon code or choose one of the available offers.
                  </p>
                </div>
              </div>

              {appliedCoupon ? (
                <div className="mt-5 rounded-xl border border-green-500/30 bg-green-500/10 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white">
                        <Check className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="oxanium text-sm font-bold uppercase text-green-600">
                          {appliedCoupon.code}
                        </p>

                        <p className="oxanium mt-1 text-xs text-text-muted">
                          {getCouponDescription(
                            appliedCoupon
                          )}{" "}
                          · Saved{" "}
                          {formatPrice(
                            couponDiscount
                          )}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveCoupon
                      }
                      className="oxanium inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={
                      handleCouponSubmit
                    }
                    className="mt-5 flex flex-col gap-2 sm:flex-row"
                  >
                    <div className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-border bg-background px-4 transition focus-within:border-primary">
                      <Tag className="mr-3 h-4 w-4 shrink-0 text-text-muted" />

                      <input
                        type="text"
                        value={
                          couponCode
                        }
                        onChange={(
                          event
                        ) => {
                          setCouponCode(
                            event.target.value.toUpperCase()
                          );
                          setCouponError(
                            ""
                          );
                        }}
                        placeholder="Enter coupon code"
                        className="oxanium w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={
                        !couponCode.trim() || couponLoading
                      }
                      className="oxanium h-12 rounded-xl bg-primary px-7 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>

                  {couponError && (
                    <p className="oxanium mt-2 text-xs font-medium text-red-500">
                      {couponError}
                    </p>
                  )}

                  <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="oxanium text-xs font-bold uppercase tracking-wider text-text-muted">
                        Available Coupons
                      </p>

                      {couponLoading && (
                        <span className="oxanium text-xs text-text-muted">
                          Loading...
                        </span>
                      )}
                    </div>

                    {!couponLoading &&
                      coupons.length === 0 && (
                        <div className="rounded-xl border border-dashed border-border px-4 py-5 text-center">
                          <p className="oxanium text-sm text-text-muted">
                            No coupons available right now.
                          </p>
                        </div>
                      )}

                    <div className="grid gap-3 sm:grid-cols-2">
                      {coupons.map(
                        (coupon) => {
                          const minimumCartValue =
                            Number(
                              coupon?.minCartValue
                            ) || 0;

                          const eligible =
                            cartTotal >=
                            minimumCartValue;

                          return (
                            <div
                              key={
                                coupon?.id
                              }
                              className={`rounded-xl border p-4 transition ${
                                eligible
                                  ? "border-border hover:border-primary"
                                  : "border-border opacity-60"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="oxanium rounded-md bg-primary/10 px-2 py-1 text-xs font-bold uppercase text-primary">
                                      {
                                        coupon?.code
                                      }
                                    </span>

                                    {eligible && (
                                      <Check className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>

                                  <p className="oxanium mt-2 text-sm font-bold text-text-primary">
                                    {
                                      getCouponDescription(
                                        coupon
                                      )
                                    }
                                  </p>

                                  {minimumCartValue >
                                    0 ? (
                                    <p className="oxanium mt-1 text-[11px] text-text-muted">
                                      Min. order{" "}
                                      {formatPrice(
                                        minimumCartValue
                                      )}
                                    </p>
                                  ) : (
                                    <p className="oxanium mt-1 text-[11px] text-green-600">
                                      No minimum order
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  disabled={
                                    !eligible
                                  }
                                  onClick={() =>
                                    handleApplyCoupon(
                                      coupon
                                    )
                                  }
                                  className="oxanium shrink-0 rounded-lg bg-primary px-3 py-2 text-[11px] font-bold uppercase text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
                                >
                                  {eligible
                                    ? "Apply"
                                    : "Locked"}
                                </button>
                              </div>

                              {!eligible &&
                                minimumCartValue >
                                  cartTotal && (
                                  <p className="oxanium mt-3 text-[11px] text-red-500">
                                    Add{" "}
                                    {formatPrice(
                                      minimumCartValue -
                                        cartTotal
                                    )}{" "}
                                    more
                                  </p>
                                )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="bebas text-3xl uppercase tracking-wide">
                  Order Summary
                </h2>

                <ShoppingBag className="h-5 w-5 text-text-muted" />
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="oxanium text-sm text-text-muted">
                    Subtotal
                  </span>

                  <span className="oxanium text-sm font-semibold text-text-primary">
                    {formatPrice(
                      cartTotal
                    )}
                  </span>
                </div>

                {appliedCoupon &&
                  couponDiscount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="oxanium text-sm text-green-600">
                        Discount
                      </span>

                      <span className="oxanium text-sm font-semibold text-green-600">
                        -{" "}
                        {formatPrice(
                          couponDiscount
                        )}
                      </span>
                    </div>
                  )}

                <div className="flex items-center justify-between">
                  <span className="oxanium text-sm text-text-muted">
                    Shipping
                  </span>

                  <span className="oxanium text-sm font-semibold text-green-600">
                    FREE
                  </span>
                </div>
              </div>

              {appliedCoupon && (
                <div className="mt-5 rounded-xl bg-green-500/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />

                    <p className="oxanium text-xs font-semibold text-green-600">
                      {appliedCoupon.code} applied
                    </p>
                  </div>

                  <p className="oxanium mt-1 text-[11px] text-text-muted">
                    You saved{" "}
                    {formatPrice(
                      couponDiscount
                    )}{" "}
                    on this order.
                  </p>
                </div>
              )}

              <div className="my-6 h-px bg-border" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="oxanium text-xs uppercase tracking-wider text-text-muted">
                    Total
                  </p>

                  <p className="oxanium mt-1 text-xs text-text-muted">
                    Taxes calculated at checkout
                  </p>
                </div>

                <span className="oxanium text-2xl font-bold text-text-primary sm:text-3xl">
                  {formatPrice(
                    finalTotal
                  )}
                </span>
              </div>

              <Link
                href="/checkout"
                className="oxanium mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover"
              >
                Proceed To Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-surface px-3 py-3 text-center">
                  <p className="oxanium text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Items
                  </p>

                  <p className="oxanium mt-1 text-sm font-bold text-text-primary">
                    {cartCount}
                  </p>
                </div>

                <div className="rounded-xl bg-surface px-3 py-3 text-center">
                  <p className="oxanium text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Shipping
                  </p>

                  <p className="oxanium mt-1 text-sm font-bold text-green-600">
                    Free
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartItem({
  item,
  formatPrice,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const product =
    item?.product ?? item;

  const name =
    item?.name ??
    product?.name ??
    product?.title ??
    "Product";

  const slug =
    item?.slug ??
    product?.slug ??
    "";

  const image =
    getItemImage(item);

  const price =
    getItemPrice(item);

  const quantity =
    Number(item?.quantity) || 0;

  const subtotal =
    price * quantity;

  const productHref = slug
    ? `/product/${encodeURIComponent(
        slug
      )}`
    : "/products";

  return (
    <div className="p-4 sm:p-6">
      <div className="hidden grid-cols-[minmax(300px,1fr)_130px_140px_130px_45px] items-center gap-4 md:grid">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
            <Image
              src={
                image ||
                PLACEHOLDER_IMAGE
              }
              alt={name}
              fill
              sizes="96px"
              className="object-contain p-2"
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

          <div className="min-w-0">
            <Link
              href={productHref}
              className="oxanium line-clamp-2 text-sm font-bold leading-5 text-text-primary transition hover:text-primary"
            >
              {name}
            </Link>

            {item?.variant && (
              <div className="oxanium mt-2 flex flex-wrap gap-2 text-xs text-text-muted">
                {item.variant?.flavour && (
                  <span>
                    Flavour:{" "}
                    {item.variant.flavour}
                  </span>
                )}

                {item.variant?.flavor && (
                  <span>
                    Flavour:{" "}
                    {item.variant.flavor}
                  </span>
                )}

                {item.variant?.size && (
                  <span>
                    Size:{" "}
                    {item.variant.size}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <span className="oxanium text-center text-sm font-semibold">
          {formatPrice(price)}
        </span>

        <QuantityControl
          quantity={quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />

        <span className="oxanium text-right text-sm font-bold">
          {formatPrice(subtotal)}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-500/10 hover:text-primary"
          aria-label="Remove product"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-3 md:hidden">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
          <Image
            src={
              image ||
              PLACEHOLDER_IMAGE
            }
            alt={name}
            fill
            sizes="96px"
            className="object-contain p-2"
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

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={productHref}
              className="oxanium line-clamp-2 pr-2 text-sm font-bold leading-5 text-text-primary"
            >
              {name}
            </Link>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-red-500/10 hover:text-primary"
              aria-label="Remove product"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {item?.variant && (
            <div className="oxanium mt-1 text-[11px] text-text-muted">
              {item.variant?.flavour ||
                item.variant?.flavor ||
                item.variant?.size ||
                ""}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="oxanium text-sm font-bold text-text-primary">
              {formatPrice(price)}
            </span>

            <QuantityControl
              quantity={quantity}
              onDecrease={
                onDecrease
              }
              onIncrease={
                onIncrease
              }
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="oxanium text-xs text-text-muted">
              Subtotal
            </span>

            <span className="oxanium text-sm font-bold text-text-primary">
              {formatPrice(
                subtotal
              )}
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
    <div className="flex h-9 w-fit items-center overflow-hidden rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-full w-9 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="oxanium flex h-full min-w-9 items-center justify-center border-x border-border px-2 text-xs font-bold">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        className="flex h-full w-9 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CartSkeleton() {
  return (
    <main className="min-h-screen bg-background text-text-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded bg-surface" />
          <div className="mt-3 h-12 w-52 rounded bg-surface sm:h-16 sm:w-64" />
          <div className="mt-3 h-4 w-48 rounded bg-surface" />
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
            <div className="animate-pulse space-y-5">
              {[1, 2, 3].map(
                (item) => (
                  <div
                    key={item}
                    className="flex gap-4 border-b border-border pb-5"
                  >
                    <div className="h-24 w-24 shrink-0 rounded-xl bg-surface" />

                    <div className="min-w-0 flex-1 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-surface" />
                      <div className="h-3 w-1/2 rounded bg-surface" />
                      <div className="h-9 w-28 rounded bg-surface" />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-border bg-card p-6">
            <div className="h-7 w-40 rounded bg-surface" />
            <div className="mt-7 space-y-4">
              <div className="flex justify-between">
                <div className="h-4 w-20 rounded bg-surface" />
                <div className="h-4 w-24 rounded bg-surface" />
              </div>

              <div className="flex justify-between">
                <div className="h-4 w-24 rounded bg-surface" />
                <div className="h-4 w-20 rounded bg-surface" />
              </div>

              <div className="h-px bg-border" />

              <div className="flex justify-between">
                <div className="h-6 w-16 rounded bg-surface" />
                <div className="h-7 w-28 rounded bg-surface" />
              </div>

              <div className="h-12 w-full rounded-xl bg-surface" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}