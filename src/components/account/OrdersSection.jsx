"use client";

import {
  ShoppingBag,
  Package,
  ChevronRight,
  ChevronLeft,
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

const ORDERS_PER_PAGE = 10;

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

  if (normalized.includes("confirm")) {
    return "border-indigo-500/20 bg-indigo-500/10 text-indigo-600";
  }

  return "border-orange-500/20 bg-orange-500/10 text-orange-600";
};

const getItemImage = (item) => {
  return (
    item?.product?.featuredimg ||
    item?.product?.varitant?.image
  );
};

const getItemName = (item) => {
  return item?.productName;
};

const getItemQuantity = (item) => {
  return Number(item?.quantity || 0);
};

const getItemPrice = (item) => {
  return Number(item?.priceAtPurchase || 0);
};


const stageOrder = [
  "pending",
  "placed",
  "confirmed",
  "ready_to_ship",
  "on_the_way",
  "delivered",
];

const stageLabels = {
  pending: "Payment Pending",
  placed: "Order Placed",
  confirmed: "Order Confirmed",
  ready_to_ship: "Ready to Ship",
  on_the_way: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function OrderProgress({ status }) {
  const normalizedStatus = String(status || "pending")
    .toLowerCase()
    .trim();

  if (normalizedStatus === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-white px-4 py-5 sm:px-6">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-red-600">
          <XCircle className="h-5 w-5" />
          Order Cancelled
        </div>
      </div>
    );
  }

  const currentIndex = Math.max(
    stageOrder.indexOf(normalizedStatus),
    0
  );

  return (
    <div className="rounded-xl border border-[#e8e8e8] bg-white px-3 py-5 sm:px-6 sm:py-6">
      <div className="relative">
        <div className="absolute left-[8.33%] right-[8.33%] top-[8px] h-[3px] rounded-full bg-[#e5e5e5]" />
        <div
          className="absolute left-[8.33%] top-[8px] h-[3px] rounded-full bg-[#E52323] transition-all duration-500"
          style={{
            width:
              currentIndex === 0
                ? "0%"
                : `calc(${(currentIndex / (stageOrder.length - 1)) *
                83.34
                }% - 0px)`,
          }}
        />

        <div className="relative grid grid-cols-6">
          {stageOrder.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={stage}
                className="flex min-w-0 flex-col items-center"
              >
                <div
                  className={`relative z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full border-[2px] transition-all duration-300 ${isCompleted || isCurrent
                    ? "border-[#E52323] bg-[#E52323]"
                    : "border-[#777] bg-white"
                    }`}
                >
                  {isCompleted && (
                    <div className="h-[5px] w-[5px] rounded-full bg-white" />
                  )}
                </div>

                <span
                  className={`mt-3 px-1 text-center text-[9px] font-semibold leading-tight sm:text-[10px] md:text-[11px] ${isCurrent
                    ? "text-[#E52323]"
                    : isCompleted
                      ? "text-[#333]"
                      : "text-[#777]"
                    }`}
                >
                  {stageLabels[stage]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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

function OrderItem({ order, expanded, onToggle, onCancel, cancelling }) {
  const items = Array.isArray(order?.items) ? order.items : [];
  const canCancel = order?.displayStage !== "pending" && order?.displayStage !== "cancelled";
  const contentId = `order-${order?.id}-details`;

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
    <div className="overflow-hidden rounded-xl border border-border bg-card sm:rounded-2xl">
      {/* Order Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="w-full p-3 text-left active:bg-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:p-5"
      >
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface sm:h-11 sm:w-11 sm:rounded-xl">
              <Package className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="truncate text-xs font-bold text-text-primary sm:text-base">
                  {order?.orderNumber || `Order #${order?.id}`}
                </h3>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold sm:px-2.5 sm:text-xs ${getStatusClass(
                    order?.displayStage
                  )}`}
                >
                  {formatStatus(order?.displayStage)}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-text-secondary sm:mt-1.5 sm:gap-x-3 sm:text-xs">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  {formatDate(order?.createdAt)}
                </span>
                <span className="hidden sm:inline">·</span>
                <span>
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="w-full font-semibold text-text-primary sm:w-auto">
                  {formatCurrency(order?.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <ChevronRight
            className={`mt-1 h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 sm:h-5 sm:w-5 ${expanded ? "rotate-90" : ""
              }`}
          />
        </div>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
      >
        <div className="overflow-hidden">
          <div id={contentId} className="space-y-5 border-t border-border p-3 sm:space-y-6 sm:p-5">
            <section>
              <h4 className="mb-2.5 text-xs font-bold text-text-primary sm:mb-3 sm:text-sm">
                Items in this order
              </h4>

              <div className="space-y-2.5 sm:space-y-3">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const quantity = getItemQuantity(item);
                    const price = getItemPrice(item);
                    const image = getItemImage(item);

                    return (
                      <div
                        key={item?.id || item?.productId || `${order?.id}-${index}`}
                        className="flex gap-2.5 rounded-lg bg-surface p-2.5 sm:gap-3 sm:rounded-xl sm:p-4"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-card sm:h-20 sm:w-20">
                          <img
                            src={image}
                            alt={getItemName(item)}
                            className="h-full w-full object-contain p-1 sm:p-1.5"
                            onError={(event) => {
                              if (!event.currentTarget.src.includes("/placeholder-product.svg")) {
                                event.currentTarget.src = "/placeholder-product.svg";
                              }
                            }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h5 className="line-clamp-2 text-xs font-semibold leading-snug text-text-primary sm:text-sm">
                            {getItemName(item)}
                          </h5>

                          {item?.variantName && (
                            <p className="mt-0.5 text-[11px] text-text-secondary sm:text-xs">
                              {item.variantName}
                            </p>
                          )}

                          {(item?.variant?.flavour || item?.variant?.flavor || item?.variant?.size) && (
                            <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-text-secondary sm:gap-x-3 sm:text-xs">
                              {(item?.variant?.flavour || item?.variant?.flavor) && (
                                <span>{item?.variant?.flavour || item?.variant?.flavor}</span>
                              )}
                              {item?.variant?.size && <span>{item.variant.size}</span>}
                            </div>
                          )}

                          <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 sm:mt-2">
                            <span className="text-[11px] text-text-secondary sm:text-xs">
                              {formatCurrency(price)} × {quantity}
                            </span>
                            <span className="text-xs font-bold text-text-primary sm:text-sm">
                              {formatCurrency(price * quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-secondary sm:p-5 sm:text-sm">
                    No items found for this order.
                  </div>
                )}
              </div>
            </section>

            <OrderProgress status={order?.displayStage} />

            {/* Address + Payment stack on mobile, side by side from md up */}
            <section className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <h4 className="text-xs font-bold text-text-primary sm:text-sm">Delivery address</h4>
                </div>

                <div className="space-y-1 text-xs text-text-secondary sm:text-sm">
                  <p className="font-semibold text-text-primary">
                    {shippingAddress?.fullName || "N/A"}
                  </p>
                  <p className="break-words">{shippingAddress?.addressLine1 || "N/A"}</p>
                  {shippingAddress?.addressLine2 && (
                    <p className="break-words">{shippingAddress.addressLine2}</p>
                  )}
                  {shippingAddress?.landmark && <p className="break-words">{shippingAddress.landmark}</p>}
                  <p>
                    {shippingAddress?.city || "N/A"}, {shippingAddress?.state || "N/A"} -{" "}
                    {shippingAddress?.pincode || "N/A"}
                  </p>
                  <p>{shippingAddress?.country || "India"}</p>
                  {shippingAddress?.mobile && (
                    <p className="pt-1 font-medium text-text-primary">
                      Mobile: {shippingAddress.mobile}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
                  <CreditCard className="h-4 w-4 shrink-0 text-primary" />
                  <h4 className="text-xs font-bold text-text-primary sm:text-sm">Payment</h4>
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-secondary">Status</span>
                    <span className="font-semibold text-text-primary">
                      {formatStatus(order?.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-text-secondary">Shipment</span>
                    <span className="font-semibold text-text-primary">
                      {formatStatus(order?.shipmentStatus || "not_shipped")}
                    </span>
                  </div>
                  {order?.razorpayPaymentId && (
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <span className="text-text-secondary">Payment ID</span>
                      <span className="break-all text-[11px] font-medium text-text-primary sm:max-w-[220px] sm:text-right sm:text-xs">
                        {order.razorpayPaymentId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-lg bg-surface p-3 sm:rounded-xl sm:p-4">
              <h4 className="mb-2.5 text-xs font-bold text-text-primary sm:mb-3 sm:text-sm">
                Order summary
              </h4>

              <div className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Subtotal</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(order?.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-text-secondary">Shipping</span>
                  <span className="font-medium text-text-primary">
                    {formatCurrency(order?.shippingCost)}
                  </span>
                </div>

                {Number(order?.discountAmount || 0) > 0 && (
                  <div className="flex justify-between gap-4">
                    <span className="text-text-secondary">
                      Discount{order?.couponCode ? ` (${order.couponCode})` : ""}
                    </span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(order?.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between gap-4 border-t border-border pt-2">
                  <span className="font-bold text-text-primary">Total</span>
                  <span className="text-sm font-black text-text-primary sm:text-base">
                    {formatCurrency(order?.totalAmount)}
                  </span>
                </div>

                {order?.paymentStatus !== "pending" && (
                  <>
                    {Number(order?.advanceAmount || 0) > 0 && (
                      <div className="flex justify-between gap-4">
                        <span className="text-text-secondary">Advance paid</span>
                        <span className="font-medium text-text-primary">
                          {formatCurrency(order?.advanceAmount)}
                        </span>
                      </div>
                    )}
                    {Number(order?.remainingAmount || 0) > 0 && (
                      <div className="flex justify-between gap-4">
                        <span className="text-text-secondary">Remaining</span>
                        <span className="font-bold text-primary">
                          {formatCurrency(order?.remainingAmount)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[11px] text-text-secondary sm:text-xs">
                Last updated: {formatDateTime(order?.updatedAt)}
              </div>

              {canCancel && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCancel(order);
                  }}
                  disabled={cancelling}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 text-sm font-semibold text-red-600 transition active:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:w-auto sm:hover:bg-red-500/10"
                >
                  {cancelling ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Cancel order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderPagination({
  page,
  totalPages,
  total,
  count,
  loading,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const currentPage = Number(page || 1);
  const pages = [];


  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center text-xs text-text-secondary sm:text-left sm:text-sm">
          Showing{" "}
          <span className="font-semibold text-text-primary">
            {count}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-text-primary">
            {total}
          </span>{" "}
          orders
        </div>

        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            disabled={!hasPrevious || loading}
            onClick={() =>
              onPageChange(currentPage - 1)
            }
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
          >
            <ChevronLeft className="h-4 w-4" />

            <span className="ml-1 hidden sm:inline">
              Previous
            </span>
          </button>

          <div className="flex items-center gap-1">
            {pages.map((item, index) => {
              if (item === "...") {
                return (
                  <span
                    key={`dots-${index}`}
                    className="flex h-9 w-7 items-center justify-center text-sm text-text-secondary"
                  >
                    ...
                  </span>
                );
              }

              const isActive =
                item === currentPage;

              return (
                <button
                  key={item}
                  type="button"
                  disabled={loading}
                  onClick={() => onPageChange(item)}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${isActive
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-text-primary hover:bg-surface"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!hasNext || loading}
            onClick={() =>
              onPageChange(currentPage + 1)
            }
            className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-card px-2.5 text-sm font-semibold text-text-primary transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40 sm:px-3"
          >
            <span className="mr-1 hidden sm:inline">
              Next
            </span>

            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-secondary">
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Loading orders...
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

  const [currentPage, setCurrentPage] = useState(1);


  const orders = Array.isArray(reduxOrders?.orders)
    ? reduxOrders.orders
    : [];

  const apiPage = currentPage;

  const totalOrders = Number(
    reduxOrders?.total || 0
  );

  const totalPages = Number(
    reduxOrders?.totalPages || 1
  );

  const orderCount = Number(
    reduxOrders?.count ?? orders.length
  );


  useEffect(() => {
    dispatch(
      getOrder({
        page: currentPage,
        limit: ORDERS_PER_PAGE,
      })
    );
  }, [dispatch, currentPage]);


  const handlePageChange = (page) => {
    const nextPage = Number(page);

    if (
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    setExpandedOrder(null);
    setCurrentPage(nextPage);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleCancelOrder = async (order) => {
    if (!order?.id) {
      return;
    }

    const pageBeforeCancel = currentPage;

    try {
      setCancellingOrderId(order.id);

      await dispatch(orderCancel(order.id)).unwrap();

      await dispatch(
        getOrder({
          page: pageBeforeCancel,
          limit: ORDERS_PER_PAGE,
          refresh: true,
        })
      ).unwrap?.();

      setExpandedOrder(null);
    } catch (error) {
      console.error("Cancel order error:", error);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleToggleOrder = (orderId) => {
    setExpandedOrder((current) =>
      current === orderId ? null : orderId
    );
  };


  const handleRetry = () => {
    dispatch(
      getOrder({
        page: currentPage,
        limit: ORDERS_PER_PAGE,
        refresh: true,
      })
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
              onClick={handleRetry}
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
        orders.length === 0 &&
        totalOrders === 0 && (
          <EmptyOrders onBack={onBack} />
        )}

      {orders.length > 0 && (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderItem
                key={
                  order?.id ||
                  order?.orderNumber
                }
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

          <OrderPagination
            page={currentPage}
            totalPages={totalPages}
            total={totalOrders}
            count={orderCount}
            loading={loading}
            onPageChange={handlePageChange}
          />
        </>
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
