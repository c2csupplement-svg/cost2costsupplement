"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  Settings,
  ArrowRight,
  ChevronRight,
  Camera,
} from "lucide-react";

export default function OverviewSection({
  user,
  firstLetter,
  orders,
  setActiveSection,
}) {
  return (
    <>
      {/* ===================================
          WELCOME CARD
      =================================== */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#111] p-7 text-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] sm:p-9">

        {/* Decorative circles */}
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[35px] border-[#E52323]/20" />

        <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full border-[25px] border-white/5" />

        <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-center">

          <div className="flex items-center gap-5">

            {/* Avatar */}
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#E52323] bg-white text-[#111]">
                <span className="bebas text-5xl leading-none">
                  {firstLetter}
                </span>
              </div>

              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#111] bg-[#E52323] text-white transition hover:bg-white hover:text-[#111]"
                aria-label="Change profile photo"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
                My Account
              </p>

              <h1 className="bebas text-4xl uppercase tracking-wide sm:text-5xl">
                Welcome back, {user.name}!
              </h1>

              <p className="oxanium mt-2 max-w-xl text-sm leading-6 text-white/55">
                Manage your account, track your orders and keep your C2C
                shopping experience organized.
              </p>
            </div>

          </div>

          <div className="relative shrink-0">
            <Link
              href="/shop"
              className="oxanium inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-[#111] transition hover:bg-[#E52323] hover:text-white"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>
      </div>

      {/* ===================================
          STATS
      =================================== */}
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">

        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value="12"
        />

        <StatCard
          icon={Clock3}
          label="Processing"
          value="1"
        />

        <StatCard
          icon={Truck}
          label="Shipped"
          value="2"
        />

        <StatCard
          icon={CheckCircle2}
          label="Delivered"
          value="9"
        />

      </div>

      {/* ===================================
          QUICK ACTIONS
      =================================== */}
      <div className="mb-8">

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
              Quick access
            </p>

            <h2 className="bebas text-3xl uppercase tracking-wide">
              Manage Your Account
            </h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">

          <QuickAction
            icon={Package}
            title="Your Orders"
            description="Track and manage your recent purchases."
            button="View Orders"
            onClick={() => setActiveSection("Orders")}
          />

          <QuickAction
            icon={MapPin}
            title="Your Addresses"
            description="Manage your shipping and billing addresses."
            button="Manage Addresses"
            onClick={() => setActiveSection("Addresses")}
          />

          <QuickAction
            icon={Settings}
            title="Account Settings"
            description="Update your profile and account details."
            button="Edit Account"
            onClick={() => setActiveSection("Account Settings")}
          />

        </div>
      </div>

      {/* ===================================
          RECENT ORDERS
      =================================== */}
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">

        <div className="flex flex-col gap-3 border-b border-black/10 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="oxanium mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#E52323]">
              Your activity
            </p>

            <h2 className="bebas text-3xl uppercase tracking-wide">
              Recent Orders
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveSection("Orders")}
            className="oxanium inline-flex items-center gap-2 text-sm font-bold text-[#111] transition hover:text-[#E52323]"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>

        </div>

        <div className="divide-y divide-black/10">

          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
            />
          ))}

        </div>

      </div>

      {/* ===================================
          SHOPPING CTA
      =================================== */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-[#E52323] p-7 text-white sm:p-8">

        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">

          <div>
            <p className="oxanium text-xs font-bold uppercase tracking-[0.2em] text-white/70">
              Ready for your next order?
            </p>

            <h2 className="bebas mt-1 text-4xl uppercase tracking-wide">
              Find Your Next Favourite
            </h2>

            <p className="oxanium mt-2 max-w-xl text-sm leading-6 text-white/75">
              Explore authentic sports nutrition and wellness products from
              trusted global brands.
            </p>
          </div>

          <Link
            href="/shop"
            className="oxanium flex shrink-0 items-center gap-2 rounded-lg bg-[#111] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white hover:text-[#111]"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>

        </div>

      </div>
    </>
  );
}


/* =============================================
   STAT CARD
============================================= */

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#E52323]/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">

      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-[#E52323]/10 text-[#E52323]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="oxanium text-xs font-medium uppercase tracking-wide text-[#888]">
        {label}
      </p>

      <p className="bebas mt-1 text-4xl leading-none">
        {value}
      </p>

    </div>
  );
}


/* =============================================
   QUICK ACTION
============================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:-translate-y-1 hover:border-[#E52323]/30 hover:shadow-[0_12px_35px_rgba(0,0,0,0.07)]">

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#111] text-white transition group-hover:bg-[#E52323]">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="bebas text-2xl uppercase tracking-wide">
        {title}
      </h3>

      <p className="oxanium mt-2 min-h-[48px] text-sm leading-6 text-[#777]">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="oxanium mt-5 flex items-center gap-2 text-sm font-bold text-[#111] transition hover:text-[#E52323]"
      >
        {button}

        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>

    </div>
  );
}


/* =============================================
   ORDER ROW
============================================= */

function OrderRow({ order }) {
  const statusStyles = {
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
  };

  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-[#FAFAFA] sm:flex-row sm:items-center sm:justify-between sm:p-6">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F2F2F2] text-[#222]">
          <Package className="h-5 w-5" />
        </div>

        <div>
          <p className="oxanium text-sm font-bold">
            {order.id}
          </p>

          <p className="oxanium mt-1 text-xs text-[#888]">
            {order.date} · {order.items}
          </p>
        </div>

      </div>

      <div className="flex items-center justify-between gap-5 sm:justify-end">

        <div className="text-left sm:text-right">

          <p className="oxanium text-sm font-bold">
            {order.total}
          </p>

          <span
            className={`oxanium mt-1 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
              statusStyles[order.statusColor]
            }`}
          >
            {order.status}
          </span>

        </div>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition hover:border-[#E52323] hover:bg-[#E52323] hover:text-white"
          aria-label={`View ${order.id}`}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}