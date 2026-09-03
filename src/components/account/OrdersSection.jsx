"use client";

import {
  ShoppingBag,
  Package,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function OrdersSection({ orders, onBack }) {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
            Your activity
          </p>

          <h2 className="bebas text-4xl uppercase tracking-wide sm:text-5xl">
            Your Orders
          </h2>

          <p className="oxanium mt-2 text-sm text-[#777]">
            View and track all your recent orders.
          </p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="oxanium inline-flex items-center gap-2 self-start rounded-lg bg-[#111] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#E52323]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </button>

      </div>

      {/* Orders Card */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

        {/* Header */}
        <div className="border-b border-black/10 bg-[#111] px-6 py-5 text-white sm:px-7">

          <div className="flex items-center justify-between">

            <div>
              <p className="oxanium text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
                Order History
              </p>

              <h3 className="bebas mt-1 text-3xl uppercase tracking-wide">
                All Orders
              </h3>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E52323]">
              <ShoppingBag className="h-5 w-5" />
            </div>

          </div>

        </div>

        {/* Orders */}
        <div className="divide-y divide-black/10">

          {orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
            />
          ))}

        </div>

      </div>

    </div>
  );
}


/* =============================================
   ORDER ITEM
============================================= */

function OrderItem({ order }) {
  const statusStyles = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  return (
    <div className="p-5 transition hover:bg-[#FAFAFA] sm:p-7">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        {/* Order Info */}
        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F3F3F3] text-[#222]">
            <Package className="h-6 w-6" />
          </div>

          <div>

            <p className="oxanium text-sm font-bold text-[#111]">
              {order.id}
            </p>

            <p className="oxanium mt-1 text-xs text-[#888]">
              {order.date}
            </p>

            <p className="oxanium mt-1 text-xs text-[#888]">
              {order.items}
            </p>

          </div>

        </div>

        {/* Order Details */}
        <div className="flex flex-wrap items-center gap-5 sm:gap-8">

          <div>
            <p className="oxanium text-[11px] uppercase tracking-wide text-[#999]">
              Total
            </p>

            <p className="bebas mt-1 text-2xl">
              {order.total}
            </p>
          </div>

          <div>
            <p className="oxanium text-[11px] uppercase tracking-wide text-[#999]">
              Status
            </p>

            <span
              className={`oxanium mt-1 inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
                statusStyles[order.statusColor]
              }`}
            >
              {order.status}
            </span>
          </div>

          <button
            type="button"
            className="oxanium inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2.5 text-xs font-bold transition hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
          >
            View Order
            <ChevronRight className="h-4 w-4" />
          </button>

        </div>

      </div>

    </div>
  );
}