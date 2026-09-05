"use client";

import {
  ShoppingBag,
  Package,
  ChevronRight,
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  CalendarDays,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getOrder,
  orderCancel,
} from "@/redux/features/order/orderActon";

const formatCurrency = (value) => {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "Pending";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClass = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (
    normalized.includes("delivered") ||
    normalized.includes("completed") ||
    normalized.includes("success")
  ) {
    return "border-green-500/20 bg-green-500/10 text-green-600";
  }

  if (
    normalized.includes("cancel") ||
    normalized.includes("failed") ||
    normalized.includes("return")
  ) {
    return "border-red-500/20 bg-red-500/10 text-red-600";
  }

  if (
    normalized.includes("shipped") ||
    normalized.includes("transit") ||
    normalized.includes("dispatch")
  ) {
    return "border-blue-500/20 bg-blue-500/10 text-blue-600";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600";
};

const getItemImage = (item) => {
  return (
    item?.image ||
    item?.productImage ||
    item?.thumbnail ||
    item?.product?.image ||
    item?.product?.featuredImage ||
    item?.product?.images?.[0] ||
    "/placeholder-product.svg"
  );
};

const getItemName = (item) => {
  return (
    item?.productName ||
    item?.name ||
    item?.product?.name ||
    "Product"
  );
};

const getItemQuantity = (item) => {
  return Number(
    item?.quantity ||
      item?.qty ||
      1
  );
};

const getItemPrice = (item) => {
  return Number(
    item?.price ||
      item?.unitPrice ||
      item?.sellingPrice ||
      item?.product?.price ||
      0
  );
};

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="animate-pulse rounded-2xl border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 gap-3">
              <div className="h-11 w-11 shrink-0 rounded-xl bg-surface" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-surface" />
                <div className="h-3 w-52 max-w-full rounded bg-surface" />
              </div>
            </div>

            <div className="h-7 w-20 rounded-full bg-surface" />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((box) => (
              <div
                key={box}
                className="h-16 rounded-xl bg-surface"
              />
            ))}
          </div>

          <div className="mt-4 h-10 rounded-xl bg-surface" />
        </div>
      ))}
    </div>
  );
}

function EmptyOrders({ onBack }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center sm:px-8">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <ShoppingBag className="h-7 w-7 text-text-secondary" />
      </div>

      <h3 className="mt-5 text-lg font-bold text-text-primary">
        No orders yet
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
        You have not placed any orders yet. Start shopping and
        your orders will appear here.
      </p>

      <button
        type="button"
        onClick={onBack}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Continue Shopping
      </button>
    </div>
  );
}

function OrderItem({
  order,
  expanded,
  onToggle,
  onCancel,
  cancelling,
}) {
  const items = Array.isArray(order?.items)
    ? order.items
    : [];

  const canCancel =order?.status !== "pending";

  const shippingAddress =
    order?.address || {
      fullName: order?.shippingFullName,
      mobile: order?.shippingMobile,
      addressLine1: order?.shippingAddressLine1,
      addressLine2: order?.shippingAddressLine2,
      landmark: order?.shippingLandmark,
      city: order?.shippingCity,
      state: order?.shippingState,
      pincode: order?.shippingPincode,
      country: order?.shippingCountry,
      addressType: order?.shippingAddressType,
    };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 text-left sm:p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface">
              <Package className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-bold text-text-primary sm:text-base">
                  {order?.orderNumber || `Order #${order?.id}`}
                </h3>

                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusClass(
                    order?.status
                  )}`}
                >
                  {formatStatus(
                    order?.displayStage || order?.status
                  )}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(order?.createdAt)}
                </span>

                <span>
                  {items.length}{" "}
                  {items.length === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            className={`mt-1 h-5 w-5 shrink-0 text-text-secondary transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-surface p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Total
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {formatCurrency(order?.totalAmount)}
            </p>
          </div>

          <div className="rounded-xl bg-surface p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Payment
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {formatStatus(order?.paymentMethod)}
            </p>
          </div>

          <div className="rounded-xl bg-surface p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Payment Status
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {formatStatus(order?.paymentStatus)}
            </p>
          </div>

          <div className="rounded-xl bg-surface p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
              Shipping
            </p>

            <p className="mt-1 text-sm font-bold text-text-primary">
              {formatCurrency(order?.shippingCost)}
            </p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border p-4 sm:p-5">
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />

                <h4 className="text-sm font-bold text-text-primary">
                  Order Items
                </h4>
              </div>

              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const quantity = getItemQuantity(item);
                    const price = getItemPrice(item);
                    const image = getItemImage(item);

                    return (
                      <div
                        key={
                          item?.id ||
                          item?.productId ||
                          `${order?.id}-${index}`
                        }
                        className="flex gap-3 rounded-xl border border-border p-3 sm:p-4"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface sm:h-20 sm:w-20">
                          <img
                            src={image}
                            alt={getItemName(item)}
                            className="h-full w-full object-contain p-1.5"
                            onError={(event) => {
                              if (
                                !event.currentTarget.src.includes(
                                  "/placeholder-product.svg"
                                )
                              ) {
                                event.currentTarget.src =
                                  "/placeholder-product.svg";
                              }
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className="line-clamp-2 text-sm font-semibold text-text-primary">
                            {getItemName(item)}
                          </h5>

                          {item?.variantName && (
                            <p className="mt-1 text-xs text-text-secondary">
                              {item.variantName}
                            </p>
                          )}

                          {(item?.variant?.flavour ||
                            item?.variant?.flavor ||
                            item?.variant?.size) && (
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-text-secondary">
                              {(item?.variant?.flavour ||
                                item?.variant?.flavor) && (
                                <span>
                                  {item?.variant?.flavour ||
                                    item?.variant?.flavor}
                                </span>
                              )}

                              {item?.variant?.size && (
                                <span>
                                  {item.variant.size}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                            <span className="text-text-secondary">
                              Qty:{" "}
                              <span className="font-semibold text-text-primary">
                                {quantity}
                              </span>
                            </span>

                            <span className="font-semibold text-text-primary">
                              {formatCurrency(price)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-sm font-bold text-text-primary">
                            {formatCurrency(
                              price * quantity
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-5 text-center text-sm text-text-secondary">
                    No items found for this order.
                  </div>
                )}
              </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />

                  <h4 className="text-sm font-bold text-text-primary">
                    Delivery Address
                  </h4>
                </div>

                <div className="space-y-1 text-sm text-text-secondary">
                  <p className="font-semibold text-text-primary">
                    {shippingAddress?.fullName || "N/A"}
                  </p>

                  <p>
                    {shippingAddress?.addressLine1 ||
                      "N/A"}
                  </p>

                  {shippingAddress?.addressLine2 && (
                    <p>
                      {shippingAddress.addressLine2}
                    </p>
                  )}

                  {shippingAddress?.landmark && (
                    <p>
                      {shippingAddress.landmark}
                    </p>
                  )}

                  <p>
                    {shippingAddress?.city || "N/A"},{" "}
                    {shippingAddress?.state || "N/A"}{" "}
                    - {shippingAddress?.pincode || "N/A"}
                  </p>

                  <p>
                    {shippingAddress?.country || "India"}
                  </p>

                  {shippingAddress?.mobile && (
                    <p className="pt-1 font-medium text-text-primary">
                      Mobile: {shippingAddress.mobile}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-border p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />

                  <h4 className="text-sm font-bold text-text-primary">
                    Payment Details
                  </h4>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-secondary">
                      Method
                    </span>

                    <span className="font-semibold text-text-primary">
                      {formatStatus(
                        order?.paymentMethod
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-secondary">
                      Status
                    </span>

                    <span className="font-semibold text-text-primary">
                      {formatStatus(
                        order?.paymentStatus
                      )}
                    </span>
                  </div>

                  {order?.razorpayPaymentId && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-text-secondary">
                        Payment ID
                      </span>

                      <span className="max-w-[220px] break-all text-right text-xs font-medium text-text-primary">
                        {order.razorpayPaymentId}
                      </span>
                    </div>
                  )}

                  {/* {order?.razorpayOrderId && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-text-secondary">
                        Razorpay Order
                      </span>

                      <span className="max-w-[220px] break-all text-right text-xs font-medium text-text-primary">
                        {order.razorpayOrderId}
                      </span>
                    </div>
                  )} */}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-primary" />

                <h4 className="text-sm font-bold text-text-primary">
                  Shipment Details
                </h4>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-text-secondary">
                    Courier
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {order?.courierName || "Not assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-secondary">
                    AWB Code
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-text-primary">
                    {order?.awbCode || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-secondary">
                    Shipment Status
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {formatStatus(
                      order?.shipmentStatus ||
                        "not_shipped"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-text-secondary">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text-primary">
                    {formatDateTime(order?.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-border p-4">
              <h4 className="mb-4 text-sm font-bold text-text-primary">
                Order Summary
              </h4>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">
                    Subtotal
                  </span>

                  <span className="font-medium text-text-primary">
                    {formatCurrency(order?.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">
                    Shipping
                  </span>

                  <span className="font-medium text-text-primary">
                    {formatCurrency(order?.shippingCost)}
                  </span>
                </div>

                {Number(order?.discountAmount || 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">
                      Discount
                      {order?.couponCode
                        ? ` (${order.couponCode})`
                        : ""}
                    </span>

                    <span className="font-medium text-green-600">
                      -{" "}
                      {formatCurrency(
                        order?.discountAmount
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between gap-4">
                    <span className="font-bold text-text-primary">
                      Total
                    </span>

                    <span className="text-base font-black text-text-primary">
                      {formatCurrency(
                        order?.totalAmount
                      )}
                    </span>
                  </div>
                </div>

                {Number(order?.advanceAmount || 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">
                      Advance Paid
                    </span>

                    <span className="font-medium text-text-primary">
                      {formatCurrency(
                        order?.advanceAmount
                      )}
                    </span>
                  </div>
                )}

                {Number(order?.remainingAmount || 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">
                      Remaining
                    </span>

                    <span className="font-bold text-primary">
                      {formatCurrency(
                        order?.remainingAmount
                      )}
                    </span>
                  </div>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-text-secondary">
                Last updated:{" "}
                {formatDateTime(order?.updatedAt)}
              </div>

              {canCancel && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel(order);
                  }}
                  disabled={cancelling}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Cancel Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersSection({ onBack }) {
  const dispatch = useDispatch();

  const {
    orderLists: reduxOrders,
    loading = false,
    error = null,
  } = useSelector((state) => state.order || {});

  const [expandedOrder, setExpandedOrder] =
    useState(null);

  const [cancellingOrderId, setCancellingOrderId] =
    useState(null);

  const orders = Array.isArray(reduxOrders)
    ? reduxOrders
    : Array.isArray(reduxOrders?.orders)
      ? reduxOrders.orders
      : [];

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  const handleCancelOrder = async (order) => {
    if (!order?.id) {
      return;
    }

    // const confirmed = window.confirm(
    //   "Are you sure you want to cancel this order?"
    // );

    // if (!confirmed) {
    //   return;
    // }

    try {
      setCancellingOrderId(order.id);

      await dispatch(
        orderCancel({
          orderId: order.id,
        })
      ).unwrap?.();

      await dispatch(getOrder());

      setExpandedOrder(null);
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleToggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };

  return (
    <section className="w-full">
      <div className="mb-5 flex items-center gap-3 sm:mb-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-text-primary transition hover:bg-surface"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0">
          <h2 className="text-xl font-black text-text-primary sm:text-2xl">
            My Orders
          </h2>

          <p className="mt-1 text-xs text-text-secondary sm:text-sm">
            Track and manage your orders
          </p>
        </div>
      </div>

      {loading && orders.length === 0 && (
        <OrdersSkeleton />
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-600">
                Unable to load orders
              </h3>

              <p className="mt-1 text-xs text-red-500/80 sm:text-sm">
                {typeof error === "string"
                  ? error
                  : "Something went wrong while loading your orders."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => dispatch(getOrder())}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        orders.length === 0 && (
          <EmptyOrders onBack={onBack} />
        )}

      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderItem
              key={order?.id || order?.orderNumber}
              order={order}
              expanded={
                expandedOrder === order?.id
              }
              onToggle={() =>
                handleToggleOrder(order?.id)
              }
              onCancel={handleCancelOrder}
              cancelling={
                cancellingOrderId === order?.id
              }
            />
          ))}
        </div>
      )}

      {loading && orders.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2 py-3 text-xs text-text-secondary">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Updating orders...
        </div>
      )}
    </section>
  );
}