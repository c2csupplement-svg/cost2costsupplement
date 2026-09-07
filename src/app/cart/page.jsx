"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
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

import {
  couponApi,
  removeCouponApi,
  appplyCouponApi,
} from "@/apiService/api";

function formatPrice(value) {
  const number = Number(value || 0);
  return `₹ ${number.toLocaleString("en-IN")}`;
}

function getItemPrice(item) {
  const price =
    item?.price ??
    item?.unitPrice ??
    item?.variant?.discountedPrice ??
    item?.variant?.price ??
    item?.product?.price ??
    0;

  return Number(price) || 0;
}

function getItemOriginalPrice(item) {
  const currentPrice = getItemPrice(item);
  const variantPrice = Number(item?.variant?.price) || 0;

  const originalPrice =
    Number(item?.originalPrice) ||
    Number(item?.mrp) ||
    Number(item?.product?.originalPrice) ||
    Number(item?.product?.mrp) ||
    variantPrice;

  if (variantPrice > currentPrice && currentPrice > 0) {
    return variantPrice;
  }

  return originalPrice > currentPrice ? originalPrice : 0;
}

function getItemImage(item) {
  const product = item?.product ?? item;
  const variant = item?.variant ?? null;

  const images = item?.images ?? product?.images ?? [];

  const sources = [
    variant?.image,
    item?.image,
    product?.image,
    product?.featuredImage,
    product?.featuredimg,
    ...(Array.isArray(images) ? images : []),
  ];

  for (const source of sources) {
    if (typeof source === "string" && source.trim()) {
      return source.trim();
    }

    if (source && typeof source === "object") {
      const value =
        source?.url ||
        source?.src ||
        source?.image ||
        source?.imageUrl ||
        source?.path;

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  return "";
}

function getVariantAttributes(item) {
  const attributes =
    item?.variant?.attributes ?? item?.attributes ?? [];

  if (!Array.isArray(attributes)) {
    return [];
  }

  return attributes.filter(
    (attribute) =>
      attribute?.attribute?.name &&
      attribute?.value !== null &&
      attribute?.value !== undefined &&
      String(attribute.value).trim()
  );
}

function getVariantDetails(item) {
  const variant = item?.variant ?? {};
  const attributes = getVariantAttributes(item);

  const size = item?.size ?? variant?.size ?? "";

  const flavour =
    item?.flavour ??
    item?.flavor ??
    variant?.flavour ??
    variant?.flavor ??
    "";

  const attributeNames = new Set(
    attributes.map((attribute) =>
      String(attribute?.attribute?.name || "").toLowerCase()
    )
  );

  const details = [];

  attributes.forEach((attribute) => {
    const name = attribute?.attribute?.name;
    const value = attribute?.value;
    const unit = attribute?.attribute?.unit;

    if (!name || !value) {
      return;
    }

    details.push({
      name,
      value,
      unit,
    });
  });

  if (size && !attributeNames.has("size")) {
    details.push({
      name: "Size",
      value: size,
      unit: null,
    });
  }

  if (
    flavour &&
    !attributeNames.has("flavour") &&
    !attributeNames.has("flavor")
  ) {
    details.push({
      name: "Flavour",
      value: flavour,
      unit: null,
    });
  }

  return details;
}

function calculateCouponDiscount(coupon, subtotal) {
  if (!coupon) {
    return 0;
  }

  const discountValue = Number(coupon?.discountValue) || 0;
  const minimumCartValue = Number(coupon?.minCartValue) || 0;

  if (subtotal < minimumCartValue) {
    return 0;
  }

  if (coupon?.discountType === "PERCENTAGE") {
    return Math.min(
      subtotal * (discountValue / 100),
      subtotal
    );
  }

  if (coupon?.discountType === "FIXED") {
    return Math.min(discountValue, subtotal);
  }

  return 0;
}

function getCouponDescription(coupon) {
  if (coupon?.discountType === "PERCENTAGE") {
    return `${coupon?.discountValue || 0}% OFF`;
  }

  if (coupon?.discountType === "FIXED") {
    return `${formatPrice(coupon?.discountValue)} OFF`;
  }

  return "Special discount";
}

export default function CartPage() {
  const dispatch = useDispatch();

  const cartState = useSelector((state) => state.product);

  const cartData =
    cartState?.products?.cart ??
    cartState?.products ??
    {};

  const rawItems =
    cartData?.cart?.items ??
    cartData?.items ??
    cartState?.products?.cart?.items ??
    [];

  const cart = Array.isArray(rawItems) ? rawItems : [];

  const loading = Boolean(cartState?.loading);
  const error = cartState?.error;

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + Number(item?.quantity || 0),
    0
  );

  const cartTotal = cart.reduce((total, item) => {
    return (
      total +
      getItemPrice(item) * Number(item?.quantity || 0)
    );
  }, 0);

  const mrpTotal = cart.reduce((total, item) => {
    const price = getItemPrice(item);
    const originalPrice = getItemOriginalPrice(item);
    const quantity = Number(item?.quantity) || 0;

    const effectiveOriginal =
      originalPrice > price ? originalPrice : price;

    return total + effectiveOriginal * quantity;
  }, 0);

  const mrpSavings = Math.max(0, mrpTotal - cartTotal);

  const finalTotal = Math.max(
    0,
    cartTotal - couponDiscount
  );

  const totalSavings = mrpSavings + couponDiscount;

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    const loadCoupons = async () => {
      try {
        setCouponLoading(true);

        const response = await couponApi();
        const data = response?.data ?? response;

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
          error?.response?.data || error?.message
        );

        setCoupons([]);
      } finally {
        setCouponLoading(false);
      }
    };

    loadCoupons();
  }, []);

  const handleUpdateQuantity = async (item, quantity) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) {
      toast.error("Cart item ID is missing.");
      return;
    }

    try {
      if (quantity <= 0) {
        await dispatch(deleteCartItem(itemId));
        toast.success("Item removed from cart.");
      } else {
        await dispatch(
          updateItemQuantity(itemId, quantity)
        );
      }

      await dispatch(fetchCartItems());

      if (appliedCoupon) {
        const newSubtotal = cart.reduce(
          (total, currentItem) => {
            const currentItemId =
              currentItem?.id ??
              currentItem?.cartItemId ??
              currentItem?._id;

            if (
              String(currentItemId) ===
              String(itemId)
            ) {
              return (
                total +
                getItemPrice(currentItem) *
                quantity
              );
            }

            return (
              total +
              getItemPrice(currentItem) *
              Number(currentItem?.quantity || 0)
            );
          },
          0
        );

        const discount = calculateCouponDiscount(
          appliedCoupon,
          newSubtotal
        );

        if (discount > 0) {
          setCouponDiscount(discount);
        } else {
          setAppliedCoupon(null);
          setCouponDiscount(0);
          setCouponCode("");
        }
      }
    } catch (error) {
      console.error("Cart quantity error:", error);

      toast.error(
        error?.response?.data?.message ||
        "Unable to update cart."
      );
    }
  };

  const handleRemoveItem = async (item) => {
    const itemId =
      item?.id ??
      item?.cartItemId ??
      item?._id;

    if (!itemId) {
      return;
    }

    try {
      await dispatch(deleteCartItem(itemId));
      await dispatch(fetchCartItems());

      toast.success("Item removed from cart.");

      if (cart.length <= 1) {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponCode("");
      }
    } catch (error) {
      console.error("Remove cart item:", error);

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

    const confirmed = window.confirm(
      "Are you sure you want to clear your entire cart?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(clearCart());
      await dispatch(fetchCartItems());

      setAppliedCoupon(null);
      setCouponDiscount(0);
      setCouponCode("");

      toast.success("Cart cleared successfully.");
    } catch (error) {
      console.error("Clear cart:", error);

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

      const response = await appplyCouponApi(coupon.code);

      const data = response?.data ?? response;

      if (!data?.success) {
        throw new Error(
          data?.message ||
          "Unable to apply coupon."
        );
      }

      const serverCoupon =
        data?.coupon ||
        data?.appliedCoupon ||
        coupon;

      const serverDiscount = Number(
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

      setCouponCode(
        serverCoupon?.code ||
        coupon.code
      );

      setCouponError("");

      toast.success(
        `Coupon ${serverCoupon?.code ||
        coupon.code
        } applied successfully.`,
        {
          description: `You saved ${formatPrice(
            discount
          )}.`,
        }
      );

      setShowCouponModal(false);
    } catch (error) {
      console.error(
        "Apply coupon API error:",
        error?.response?.data ||
        error?.message
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
        String(item?.code || "").toUpperCase() ===
        code
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
          data?.message ||
          "Unable to remove coupon."
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
        error?.response?.data ||
        error?.message
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

  if (loading && cart.length === 0) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto flex min-h-[680px] max-w-xl flex-col items-center justify-center px-6 text-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-border bg-card shadow-xl">
              <ShoppingBag
                className="h-12 w-12 text-primary"
                strokeWidth={1.4}
              />
            </div>

            <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-lg">
              0
            </span>
          </div>

          <p className="oxanium mt-8 text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Shopping cart
          </p>

          <h1 className="bebas mt-2 text-5xl uppercase tracking-wide sm:text-7xl">
            Your cart is empty
          </h1>

          <p className="oxanium mt-4 max-w-md text-sm leading-7 text-text-muted">
            Your shopping bag is waiting for something
            special. Explore our latest products and
            find your next favourite.
          </p>

          {error && (
            <p className="oxanium mt-4 text-sm text-primary">
              {typeof error === "string"
                ? error
                : "Unable to load your cart."}
            </p>
          )}

          <Link
            href="/products"
            className="oxanium group mt-8 inline-flex h-13 items-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Start shopping
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-text-primary lg:pb-10">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-10 lg:px-10 lg:py-14">
        <div className="mb-6 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-primary" />
              <p className="oxanium text-xs font-bold uppercase tracking-[0.22em] text-primary">
                Shopping cart
              </p>
            </div>

            <h1 className="bebas mt-2 text-5xl uppercase tracking-wide sm:text-6xl lg:text-7xl">
              Your cart
            </h1>

            <p className="oxanium mt-2 text-sm text-text-muted">
              {cartCount}{" "}
              {cartCount === 1 ? "product" : "products"}{" "}
              ready for checkout
            </p>
          </div>

          <div className="hidden rounded-xl border border-border bg-card px-4 py-3 sm:block">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div>
                <p className="text-xs font-bold">
                  Secure shopping
                </p>
                <p className="mt-0.5 text-[10px] text-text-muted">
                  Safe & protected checkout
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-sm sm:p-3">
          <Link
            href="/products"
            className="oxanium group inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-[11px] font-bold uppercase tracking-wide text-text-primary transition hover:bg-surface hover:text-primary sm:px-5 sm:text-xs"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Continue shopping</span>
          </Link>

          <button
            type="button"
            onClick={handleClearCart}
            className="oxanium inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-[11px] font-bold uppercase tracking-wide text-red-500 transition hover:bg-red-500/10 sm:px-5 sm:text-xs"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear cart</span>
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start lg:gap-8">
          <section className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="hidden grid-cols-[minmax(300px,1fr)_120px_140px_120px_44px] items-center gap-4 border-b border-border bg-surface/70 px-6 py-4 md:grid">
                <span className="oxanium text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Product
                </span>

                <span className="oxanium text-center text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Price
                </span>

                <span className="oxanium text-center text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
                  Quantity
                </span>

                <span className="oxanium text-right text-[10px] font-bold uppercase tracking-[0.18em] text-text-muted">
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
                      index
                    }
                    item={item}
                    formatPrice={formatPrice}
                    onDecrease={() =>
                      handleUpdateQuantity(
                        item,
                        Number(item?.quantity || 0) - 1
                      )
                    }
                    onIncrease={() =>
                      handleUpdateQuantity(
                        item,
                        Number(item?.quantity || 0) + 1
                      )
                    }
                    onRemove={() =>
                      handleRemoveItem(item)
                    }
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <TrustItem
                icon={Truck}
                label="Free shipping"
              />
              <TrustItem
                icon={RotateCcw}
                label="Easy 7-day returns"
              />
              <TrustItem
                icon={ShieldCheck}
                label="Secure checkout"
              />
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border bg-gradient-to-r from-primary/10 via-transparent to-transparent p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                      <Tag className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="bebas text-2xl uppercase tracking-wide sm:text-3xl">
                        Save more on your order
                      </h2>

                      <p className="oxanium mt-1 text-xs leading-5 text-text-muted sm:text-sm">
                        Apply a coupon and unlock exclusive savings.
                      </p>
                    </div>
                  </div>

                  <Sparkles className="hidden h-5 w-5 text-primary sm:block" />
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {appliedCoupon ? (
                  <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] via-card to-card p-4 shadow-sm sm:p-5">
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl" />

                    <div className="relative flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                        <Check
                          className="h-5 w-5"
                          strokeWidth={2.5}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="oxanium text-sm font-black uppercase tracking-wide text-emerald-600">
                            {appliedCoupon.code}
                          </span>

                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-600">
                            Applied
                          </span>
                        </div>

                        <p className="oxanium mt-1 text-xs text-text-muted">
                          {appliedCoupon.discountType === "PERCENTAGE"
                            ? `${appliedCoupon.discountValue}% OFF`
                            : `${formatPrice(appliedCoupon.discountValue)} OFF`}
                          {" · "}
                          You saved{" "}
                          <span className="font-bold text-emerald-600">
                            {formatPrice(couponDiscount)}
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        disabled={couponLoading}
                        className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-[10px] font-bold uppercase tracking-wide text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <X className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
                        <span className="hidden sm:inline">
                          Remove
                        </span>
                      </button>
                    </div>

                    <div className="relative mt-4 border-t border-dashed border-emerald-500/20 pt-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 text-emerald-500" />

                          <span className="oxanium text-[10px] font-medium text-text-muted">
                            Coupon applied successfully
                          </span>
                        </div>

                        <span className="oxanium whitespace-nowrap text-xs font-black text-emerald-600">
                          - {formatPrice(couponDiscount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <form
                      onSubmit={handleCouponSubmit}
                      className="flex flex-col gap-2 sm:flex-row"
                    >
                      <div className="flex h-13 min-w-0 flex-1 items-center rounded-xl border border-border bg-background px-4 transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                        <Tag className="mr-3 h-4 w-4 shrink-0 text-text-muted" />

                        <input
                          type="text"
                          value={couponCode}
                          onChange={(event) => {
                            setCouponCode(
                              event.target.value.toUpperCase()
                            );
                            setCouponError("");
                          }}
                          placeholder="ENTER COUPON CODE"
                          className="oxanium w-full bg-transparent text-xs font-medium tracking-wide text-text-primary outline-none placeholder:text-text-muted"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={
                          !couponCode.trim() ||
                          couponLoading
                        }
                        className="oxanium h-13 rounded-xl bg-primary px-8 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {couponLoading
                          ? "Applying..."
                          : "Apply coupon"}
                      </button>
                    </form>

                    {couponError && (
                      <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2">
                        <p className="oxanium text-xs font-medium text-red-500">
                          {couponError}
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setShowCouponModal(true)
                      }
                      className="group mt-4 flex w-full items-center justify-between rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3.5 text-left transition hover:border-primary hover:bg-primary/10"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Tag className="h-4 w-4 text-primary" />
                        </span>

                        <span>
                          <span className="oxanium block text-xs font-bold text-primary">
                            {coupons.length > 0
                              ? `View ${coupons.length} available offer${coupons.length === 1
                                ? ""
                                : "s"
                              }`
                              : "View available offers"}
                          </span>

                          <span className="oxanium mt-0.5 block text-[10px] text-text-muted">
                            Find the best deal for your cart
                          </span>
                        </span>
                      </span>

                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </section>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <OrderSummary
              cartCount={cartCount}
              cartTotal={cartTotal}
              mrpSavings={mrpSavings}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              totalSavings={totalSavings}
              finalTotal={finalTotal}
              formatPrice={formatPrice}
            />
          </aside>

          <div className="lg:hidden">
            <OrderSummary
              cartCount={cartCount}
              cartTotal={cartTotal}
              mrpSavings={mrpSavings}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              totalSavings={totalSavings}
              finalTotal={finalTotal}
              formatPrice={formatPrice}
              hideCheckoutButton
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="oxanium text-[9px] font-bold uppercase tracking-[0.18em] text-text-muted">
              Total
            </p>

            <p className="oxanium mt-0.5 truncate text-lg font-bold text-text-primary">
              {formatPrice(finalTotal)}
            </p>
          </div>

          <Link
            href="/checkout"
            className="oxanium group flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
          >
            Checkout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <CouponModal
        open={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        coupons={coupons}
        couponLoading={couponLoading}
        cartTotal={cartTotal}
        formatPrice={formatPrice}
        getCouponDescription={getCouponDescription}
        onApply={handleApplyCoupon}
      />
    </main>
  );
}

function TrustItem({ icon: Icon, label }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-2 border-r border-border px-2 py-4 text-center last:border-r-0 sm:flex-row sm:py-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </div>

      <p className="oxanium text-[9px] font-bold uppercase leading-tight tracking-wide text-text-muted sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

function OrderSummary({
  cartCount,
  cartTotal,
  mrpSavings,
  appliedCoupon,
  couponDiscount,
  totalSavings,
  finalTotal,
  formatPrice,
  hideCheckoutButton = false,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-transparent p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="oxanium text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Checkout
            </p>

            <h2 className="bebas mt-1 text-3xl uppercase tracking-wide">
              Order summary
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <ShoppingBag className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {totalSavings > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>

            <p className="oxanium text-[11px] font-semibold leading-5 text-primary">
              You're saving{" "}
              <strong>
                {formatPrice(totalSavings)}
              </strong>{" "}
              on this order
            </p>
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="oxanium text-xs text-text-muted">
              Subtotal ({cartCount}{" "}
              {cartCount === 1 ? "item" : "items"})
            </span>

            <span className="oxanium text-sm font-bold">
              {formatPrice(cartTotal)}
            </span>
          </div>

          {mrpSavings > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="oxanium text-xs text-text-muted">
                Product discount
              </span>

              <span className="oxanium text-xs font-bold text-green-600">
                - {formatPrice(mrpSavings)}
              </span>
            </div>
          )}

          {appliedCoupon && couponDiscount > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="oxanium text-xs text-green-600">
                Coupon ({appliedCoupon.code})
              </span>

              <span className="oxanium text-xs font-bold text-green-600">
                - {formatPrice(couponDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <span className="oxanium text-xs text-text-muted">
              Shipping
            </span>

            <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[9px] font-bold uppercase text-green-600">
              Free
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-border" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="oxanium text-xs font-bold text-text-primary">
              Have a coupon?
            </p>

            <p className="oxanium mt-1 text-[10px] text-text-muted">
              Apply one above to save more
            </p>
          </div>

          <Tag className="h-4 w-4 text-primary" />
        </div>

        <div className="my-6 border-t border-border" />

        <div className="rounded-xl bg-surface/70 p-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="oxanium text-[10px] font-bold uppercase tracking-wider text-text-muted">
                Total payable
              </p>

              <p className="oxanium mt-1 text-[9px] text-text-muted">
                Taxes calculated at checkout
              </p>
            </div>

            <span className="oxanium text-2xl font-black text-text-primary sm:text-3xl">
              {formatPrice(finalTotal)}
            </span>
          </div>
        </div>

        {!hideCheckoutButton && (
          <Link
            href="/checkout"
            className="oxanium group mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-xl shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Proceed to checkout
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}

        <div className="mt-5 flex items-center justify-center gap-2 text-text-muted">
          <BadgeCheck className="h-3.5 w-3.5 text-green-500" />

          <p className="oxanium text-[10px]">
            100% secure payments
          </p>
        </div>
      </div>
    </div>
  );
}

function CouponModal({
  open,
  onClose,
  coupons,
  couponLoading,
  cartTotal,
  formatPrice,
  getCouponDescription,
  onApply,
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        onKeyDown
      );
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="oxanium flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:max-h-[82vh] sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <Tag className="h-4 w-4" />
            </div>

            <div>
              <p className="oxanium text-[9px] font-bold uppercase tracking-[0.18em] text-primary">
                Exclusive savings
              </p>

              <h3 className="bebas mt-0.5 text-2xl uppercase tracking-wide">
                Available offers
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition hover:bg-surface hover:text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {couponLoading && coupons.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-border p-4"
                >
                  <div className="h-6 w-24 rounded bg-surface" />
                  <div className="mt-3 h-4 w-32 rounded bg-surface" />
                  <div className="mt-2 h-3 w-48 rounded bg-surface" />
                </div>
              ))}
            </div>
          )}

          {!couponLoading && coupons.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-5 py-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface">
                <Tag className="h-6 w-6 text-text-muted" />
              </div>

              <p className="mt-4 text-sm font-semibold">
                No offers available
              </p>

              <p className="mt-1 text-xs text-text-muted">
                Check back later for new deals.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {coupons.map((coupon) => {
              const minimumCartValue =
                Number(coupon?.minCartValue) || 0;

              const eligible =
                cartTotal >= minimumCartValue;

              return (
                <div
                  key={coupon?.id}
                  className={`group relative overflow-hidden rounded-2xl border p-4 transition ${eligible
                      ? "border-border bg-background hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
                      : "border-border bg-surface/40 opacity-60"
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wide text-primary">
                          {coupon?.code}
                        </span>

                        {eligible && (
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase text-green-600">
                            <Check className="h-3 w-3" />
                            Eligible
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm font-bold text-text-primary">
                        {getCouponDescription(coupon)}
                      </p>

                      {minimumCartValue > 0 ? (
                        <p className="mt-1 text-[10px] text-text-muted">
                          Minimum order{" "}
                          {formatPrice(minimumCartValue)}
                        </p>
                      ) : (
                        <p className="mt-1 text-[10px] font-semibold text-green-600">
                          No minimum order
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={!eligible || couponLoading}
                      onClick={() => onApply(coupon)}
                      className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-surface disabled:text-text-muted"
                    >
                      {eligible ? "Apply" : "Locked"}
                    </button>
                  </div>

                  {!eligible &&
                    minimumCartValue > cartTotal && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-500/5 px-3 py-2">
                        <span className="text-[10px] text-red-500">
                          Add{" "}
                          {formatPrice(
                            minimumCartValue - cartTotal
                          )}{" "}
                          more to unlock
                        </span>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({
  item,
  formatPrice,
  onDecrease,
  onIncrease,
  onRemove,
}) {
  const product = item?.product ?? {};
  const variant = item?.variant ?? {};

  const name =
    product?.name ??
    item?.name ??
    product?.title ??
    item?.title ??
    "Product";

  const slug =
    product?.slug ??
    item?.slug ??
    "";

  const image = getItemImage(item);
  const price = getItemPrice(item);
  const originalPrice = getItemOriginalPrice(item);

  const discountPercent =
    originalPrice > price
      ? Math.round(
        ((originalPrice - price) /
          originalPrice) *
        100
      )
      : 0;

  const quantity =
    Number(item?.quantity) || 0;

  const subtotal = price * quantity;

  const productHref = slug
    ? `/product/${encodeURIComponent(slug)}`
    : "/products";

  const variantDetails = getVariantDetails(item);

  const stockQuantity =
    Number(
      variant?.stockQuantity ??
      item?.stockQuantity ??
      0
    );

  const stockStatus =
    item?.stockStatus ??
    variant?.stockStatus ??
    null;

  const inStock = stockStatus
    ? stockStatus === "in_stock"
    : stockQuantity > 0;

  const lowStock =
    inStock &&
    stockQuantity > 0 &&
    stockQuantity <= 5;

  return (
    <div className="group p-4 transition-colors hover:bg-surface/20 sm:p-6">
      <div className="hidden grid-cols-[minmax(300px,1fr)_120px_140px_120px_44px] items-center gap-4 md:grid">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            href={productHref}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-white transition group-hover:border-primary/30"
          >
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="96px"
                className="object-contain p-2 transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <ShoppingBag className="h-7 w-7 text-text-muted" />
              </div>
            )}

            {discountPercent > 0 && (
              <span className="oxanium absolute left-1.5 top-1.5 rounded-md bg-primary px-1.5 py-1 text-[8px] font-black text-white shadow-md">
                -{discountPercent}%
              </span>
            )}
          </Link>

          <div className="min-w-0">
            <Link
              href={productHref}
              className="oxanium line-clamp-2 text-sm font-bold leading-5 text-text-primary transition hover:text-primary"
            >
              {name}
            </Link>

            {variantDetails.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {variantDetails.map(
                  (detail, index) => (
                    <span
                      key={`${detail.name}-${detail.value}-${index}`}
                      className="oxanium rounded-md border border-border bg-surface px-2 py-1 text-[9px] font-medium text-text-secondary"
                    >
                      {detail.name}: {detail.value}
                      {detail.unit
                        ? ` ${detail.unit}`
                        : ""}
                    </span>
                  )
                )}
              </div>
            )}

            {stockStatus && (
              <span
                className={`oxanium mt-2 inline-flex rounded-md px-2 py-1 text-[9px] font-bold ${!inStock
                    ? "bg-red-500/10 text-red-600"
                    : lowStock
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-green-500/10 text-green-600"
                  }`}
              >
                {!inStock
                  ? "Out of stock"
                  : lowStock
                    ? `Only ${stockQuantity} left`
                    : "In stock"}
              </span>
            )}
          </div>
        </div>

        <div className="text-center">
          <div className="oxanium text-sm font-bold text-text-primary">
            {formatPrice(price)}
          </div>

          {originalPrice > price && (
            <div className="oxanium mt-1 text-[10px] text-text-muted line-through">
              {formatPrice(originalPrice)}
            </div>
          )}
        </div>

        <QuantityControl
          quantity={quantity}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
          max={stockQuantity || undefined}
        />

        <span className="oxanium text-right text-sm font-black">
          {formatPrice(subtotal)}
        </span>

        <button
          type="button"
          onClick={onRemove}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-500/10 hover:text-red-500"
          aria-label={`Remove ${name}`}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-3 md:hidden">
        <Link
          href={productHref}
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-white"
        >
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              sizes="96px"
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <ShoppingBag className="h-7 w-7 text-text-muted" />
            </div>
          )}

          {discountPercent > 0 && (
            <span className="oxanium absolute left-1 top-1 rounded-md bg-primary px-1.5 py-0.5 text-[8px] font-black text-white">
              -{discountPercent}%
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={productHref}
              className="oxanium line-clamp-2 pr-1 text-xs font-bold leading-5 text-text-primary"
            >
              {name}
            </Link>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-red-500/10 hover:text-red-500"
              aria-label={`Remove ${name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {variantDetails.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {variantDetails.map(
                (detail, index) => (
                  <span
                    key={`${detail.name}-${detail.value}-${index}`}
                    className="oxanium rounded-md bg-surface px-1.5 py-1 text-[9px] text-text-secondary"
                  >
                    {detail.name}: {detail.value}
                    {detail.unit
                      ? ` ${detail.unit}`
                      : ""}
                  </span>
                )
              )}
            </div>
          )}

          <div className="mt-2 flex items-center gap-2">
            <span className="oxanium text-sm font-black text-text-primary">
              {formatPrice(price)}
            </span>

            {originalPrice > price && (
              <span className="oxanium text-[10px] text-text-muted line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {stockStatus && (
            <span
              className={`oxanium mt-2 inline-flex rounded-md px-2 py-1 text-[9px] font-bold ${!inStock
                  ? "bg-red-500/10 text-red-600"
                  : lowStock
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-green-500/10 text-green-600"
                }`}
            >
              {!inStock
                ? "Out of stock"
                : lowStock
                  ? `Only ${stockQuantity} left`
                  : "In stock"}
            </span>
          )}

          <div className="mt-3 flex items-center justify-between gap-3">
            <QuantityControl
              quantity={quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              max={stockQuantity || undefined}
            />

            <span className="oxanium text-sm font-black text-text-primary">
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
  max,
}) {
  const atMax =
    typeof max === "number" &&
    max > 0 &&
    quantity >= max;

  return (
    <div className="flex h-9 w-fit items-center overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        className="flex h-full w-9 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <span className="oxanium flex h-full min-w-9 items-center justify-center border-x border-border px-2 text-xs font-bold tabular-nums">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        className="flex h-full w-9 items-center justify-center text-text-muted transition hover:bg-surface hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="animate-pulse space-y-5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 border-b border-border pb-5 last:border-0"
                >
                  <div className="h-24 w-24 shrink-0 rounded-2xl bg-surface" />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-surface" />
                    <div className="h-3 w-1/2 rounded bg-surface" />
                    <div className="h-9 w-28 rounded bg-surface" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-pulse rounded-2xl border border-border bg-card p-6 shadow-sm">
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

              <div className="h-14 w-full rounded-xl bg-surface" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
