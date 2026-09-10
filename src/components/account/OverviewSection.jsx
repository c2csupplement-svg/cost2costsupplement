"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Truck,
  Package,
  MapPin,
  ArrowRight,
  User,
  Mail,
  Phone,
  Save,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  getProfile,
  updateProfile,
} from "@/redux/features/profile/profileAction";

import {
  getOrder,
  orderCancel,
} from "@/redux/features/order/orderActon";

const STATUS_CONFIG = {
  delivered: {
    badge: "bg-green-50 text-green-700 ring-1 ring-green-600/10",
    iconBg: "bg-green-50 text-green-600",
    bar: "bg-green-500",
    icon: CheckCircle2,
  },

  shipped: {
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/10",
    iconBg: "bg-blue-50 text-blue-600",
    bar: "bg-blue-500",
    icon: Truck,
  },

  processing: {
    badge: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10",
    iconBg: "bg-yellow-50 text-yellow-600",
    bar: "bg-yellow-500",
    icon: Clock3,
  },

  pending: {
    badge: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10",
    iconBg: "bg-yellow-50 text-yellow-600",
    bar: "bg-yellow-500",
    icon: Clock3,
  },

  cancelled: {
    badge: "bg-red-50 text-red-700 ring-1 ring-red-600/10",
    iconBg: "bg-red-50 text-red-600",
    bar: "bg-red-500",
    icon: Clock3,
  },

  completed: {
    badge: "bg-green-50 text-green-700 ring-1 ring-green-600/10",
    iconBg: "bg-green-50 text-green-600",
    bar: "bg-green-500",
    icon: CheckCircle2,
  },
};

export default function OverviewSection({
  setActiveSection,
}) {
  const dispatch = useDispatch();

  const [showProfileEdit, setShowProfileEdit] =
    useState(false);

  const profileState = useSelector(
    (state) => state.profile || {}
  );

  const orderState = useSelector(
    (state) => state.order || {}
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getOrder());
  }, [dispatch]);

  const profileData =
    profileState?.profileDetails?.profile ||
    profileState?.profileDetails?.data?.profile ||
    profileState?.profileDetails?.data ||
    profileState?.profileDetails?.user ||
    profileState?.profileDetails ||
    {};

  const ordersData =
    orderState?.orderLists?.orders ||
    [];

  const orders = Array.isArray(ordersData)
    ? ordersData
    : [];

  const profileLoading =
    profileState?.loading || false;

  const orderLoading =
    orderState?.loading || false;

  const loading =
    profileLoading || orderLoading;

  const userName =
    profileData?.name ||
    profileData?.fullName ||
    profileData?.username ||
    "User";

  const firstLetter =
    userName?.charAt(0)?.toUpperCase() || "U";

  const totalOrders = orderState?.orderLists?.total;

  const shippedOrders = orders.filter((order) => {
    const status = String(
      order?.status ||
      order?.displayStage ||
      ""
    )
      .trim()
      .toLowerCase();

    return [
      "shipped",
      "out_for_delivery",
      "out for delivery",
    ].includes(status);
  }).length;

  const deliveredOrders = orders.filter((order) => {
    const status = String(
      order?.status ||
      order?.displayStage ||
      ""
    )
      .trim()
      .toLowerCase();

    return [
      "delivered",
      "completed",
    ].includes(status);
  }).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b?.createdAt || 0) -
        new Date(a?.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {/* Hero / Welcome card */}
        <div className="relative overflow-hidden rounded-3xl bg-[#111] text-white shadow-lg shadow-black/10">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#e52323]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

          <div className="relative p-5 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#e52323] bg-white text-[#111] shadow-lg sm:h-[72px] sm:w-[72px]">
                  <span className="bebas text-3xl sm:text-4xl">
                    {firstLetter}
                  </span>
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#e52323] ring-2 ring-[#111]">
                    <Sparkles className="h-3 w-3 text-white" />
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-[#e52323]">
                    My Account
                  </p>

                  <h1 className="bebas mt-1 break-words text-3xl uppercase leading-none sm:text-5xl">
                    Welcome, {userName}
                  </h1>

                  <p className="oxanium mt-2 max-w-xl text-xs leading-5 text-white/50 sm:text-sm">
                    Manage your account, orders and saved
                    addresses — all in one place.
                  </p>
                </div>
              </div>

              <div className="flex w-full gap-2.5 sm:w-auto ">
                <button
                  type="button"
                  onClick={() =>
                    setShowProfileEdit(true)
                  }
                  className="oxanium cursor-pointer inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.08] px-5 text-sm font-bold text-white backdrop-blur transition hover:border-white/30 hover:bg-white hover:text-[#111] sm:w-auto"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </button>

                <Link
                  href="/products"
                  className="oxanium cursor-pointer inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e52323] px-5 text-sm font-bold text-white shadow-md shadow-[#e52323]/30 transition hover:bg-white hover:text-[#111] sm:w-auto"
                >
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="bebas text-2xl uppercase tracking-wide sm:text-3xl">
              Quick Access
            </h2>
          </div>

          <div className="flex flex-row gap-2 sm:gap-3">
            <QuickAction
              dark
              icon={Package}
              title="Track Orders"
              description="Check your order status and delivery updates."
              button="View Orders"
              onClick={() => setActiveSection("Orders")}
            />

            <QuickAction
              icon={MapPin}
              title="Saved Addresses"
              description="Manage your delivery addresses."
              button="Manage Addresses"
              onClick={() => setActiveSection("Addresses")}
            />
          </div>
        </div>


        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-black/10 bg-gray-50/60 p-4 sm:p-5">
            <h2 className="bebas text-2xl uppercase tracking-wide sm:text-3xl">
              Recent Orders
            </h2>

            <button
              type="button"
              onClick={() =>
                setActiveSection("Orders")
              }
              className="oxanium cursor-pointer inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#111] transition hover:bg-black/5 sm:text-sm"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loading ? (
            <OrderSkeleton />
          ) : recentOrders.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>

              <h3 className="bebas mt-4 text-2xl uppercase">
                No Orders Yet
              </h3>

              <p className="oxanium mt-1 text-xs text-gray-500">
                Your recent orders will appear here.
              </p>

              <Link
                href="/products"
                className="oxanium mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#111] px-5 text-xs font-bold text-white transition hover:bg-[#e52323]"
              >
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-black/5 cursor-pointer" onClick={() =>
                setActiveSection("Orders")
              }>
              {recentOrders.map((order) => (
                <OrderRow
                  key={order?.id}
                  order={order}
                />
              ))}
            </div>
          )}
        </div>

        {/* Promo banner */}
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#e52323] p-5 text-white shadow-lg shadow-[#e52323]/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <h2 className="bebas text-2xl uppercase tracking-wide sm:text-3xl">
              Find Your Next Favourite
            </h2>

            <p className="oxanium mt-1 max-w-lg text-xs leading-5 text-white/80 sm:text-sm">
              Explore sports nutrition and wellness
              products from trusted brands.
            </p>
          </div>

          <Link
            href="/products"
            className="oxanium relative inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#111] px-5 text-sm font-bold text-white transition hover:bg-white hover:text-[#111] sm:w-auto"
          >
            Browse Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {showProfileEdit && (
        <ProfileEditModal
          profile={profileData}
          onClose={() =>
            setShowProfileEdit(false)
          }
          onUpdated={async () => {
            await dispatch(getProfile());
            setShowProfileEdit(false);
          }}
        />
      )}
    </>
  );
}

function ProfileEditModal({
  profile,
  onClose,
  onUpdated,
}) {
  const dispatch = useDispatch();

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name:
      profile?.name ||
      profile?.fullName ||
      profile?.username ||
      "",

    email:
      profile?.email || "",

    mobile:
      profile?.mobile ||
      profile?.phone ||
      "",
  });

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleMobileChange = (event) => {
    const value =
      event.target.value.replace(
        /\D/g,
        ""
      );

    setFormData((previous) => ({
      ...previous,
      mobile: value.slice(0, 10),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    const mobile =
      formData.mobile.trim();

    if (!name) {
      toast.error(
        "Please enter your name."
      );
      return;
    }

    if (!email) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (
      mobile &&
      !/^\d{10}$/.test(mobile)
    ) {
      toast.error(
        "Mobile number must contain exactly 10 digits."
      );
      return;
    }

    try {
      setSaving(true);

      await dispatch(
        updateProfile({
          name,
          email,
          mobile,
        })
      );

      toast.success(
        "Profile updated successfully."
      );

      if (onUpdated) {
        await onUpdated();
      } else {
        onClose();
      }
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to update profile.";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-black/10 p-5 sm:p-6">
          <div>
            <p className="oxanium text-[10px] font-bold uppercase tracking-widest text-[#e52323]">
              Account
            </p>

            <h2 className="bebas mt-1 text-2xl uppercase sm:text-3xl">
              Edit Profile
            </h2>

            <p className="oxanium mt-1 text-xs text-gray-500">
              Update your personal information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-gray-500 transition hover:border-[#e52323] hover:bg-[#e52323] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5 sm:p-6"
        >
          <div>
            <label
              htmlFor="profile-name"
              className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#111]"
            >
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="profile-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={saving}
                className="oxanium h-12 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#e52323] focus:ring-2 focus:ring-[#e52323]/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#111]"
            >
              Email
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="profile-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={saving}
                className="oxanium h-12 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#e52323] focus:ring-2 focus:ring-[#e52323]/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="profile-mobile"
              className="oxanium mb-2 block text-xs font-bold uppercase tracking-wide text-[#111]"
            >
              Mobile Number
            </label>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="profile-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.mobile}
                onChange={handleMobileChange}
                placeholder="Enter 10 digit mobile number"
                disabled={saving}
                className="oxanium h-12 w-full rounded-xl border border-black/10 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#e52323] focus:ring-2 focus:ring-[#e52323]/10 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="oxanium inline-flex h-11 w-full items-center justify-center rounded-xl border border-black/10 px-5 text-sm font-bold text-[#111] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="oxanium inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#e52323] px-5 text-sm font-bold text-white shadow-md shadow-[#e52323]/30 transition hover:bg-[#c91d1d] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5 border-r border-white/10 px-2 py-5 text-center transition hover:bg-white/[0.04] last:border-r-0 sm:py-6">
      <Icon className="h-4 w-4 text-[#e52323]" />

      <p className="bebas text-2xl leading-none sm:text-3xl">
        {value}
      </p>

      <p className="oxanium truncate text-[9px] uppercase tracking-wide text-white/50 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  button,
  onClick,
  dark = false,
}) {
  return (
    <div
      className={`group flex min-w-0 flex-1 flex-col rounded-xl border p-3 transition sm:rounded-2xl sm:p-6 ${
        dark
          ? "border-[#111] bg-[#111] text-white hover:shadow-lg hover:shadow-black/10"
          : "border-black/10 bg-white text-[#111] hover:border-black/20 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition group-hover:scale-105 sm:h-11 sm:w-11 sm:rounded-xl ${
            dark ? "bg-white/10 text-[#e52323]" : "bg-[#111] text-white"
          }`}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <h3 className="bebas min-w-0 truncate text-sm uppercase leading-tight sm:text-2xl">
          {title}
        </h3>
      </div>

      <p
        className={`oxanium mt-2 line-clamp-2 text-[11px] leading-4 sm:mt-3 sm:text-sm sm:leading-6 ${
          dark ? "text-white/50" : "text-gray-500"
        }`}
      >
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className={`oxanium cursor-pointer mt-auto inline-flex min-h-[36px] items-center gap-1.5 pt-3 text-xs font-bold transition active:opacity-70 sm:min-h-0 sm:gap-2 sm:pt-4 sm:text-sm sm:group-hover:gap-3 ${
          dark ? "text-white" : "text-[#111]"
        }`}
      >
        <span className="truncate">{button}</span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
      </button>
    </div>
  );
}

function getOrderThumbnail(items) {
  const firstItem =
    Array.isArray(items) && items.length > 0
      ? items[0]
      : null;

  const image =
    firstItem?.product?.featuredimg ||
    firstItem?.variant?.image ||
    null;

  const name =
    firstItem?.product?.name ||
    firstItem?.variant?.name ||
    "Product";

  return { image, name };
}

function OrderRow({ order }) {
  const rawStatus = String(
    order?.displayStage ||
    "pending"
  )
    .trim()
    .toLowerCase();

  const status =
    rawStatus === "out_for_delivery"
      ? "shipped"
      : rawStatus;

  const config =
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.pending;

  const StatusIcon = config.icon;

  const orderNumber =
    order?.orderNumber ||
    `Order #${order?.id || ""}`;

  const total = Number(
    order?.totalAmount || 0
  );

  const itemCount = Array.isArray(
    order?.items
  )
    ? order.items.reduce(
      (total, item) =>
        total +
        Number(
          item?.quantity || 1
        ),
      0
    )
    : 0;

  const {
    image: thumbnail,
    name: firstItemName,
  } = getOrderThumbnail(order?.items);

  const extraItems =
    itemCount > 1 ? itemCount - 1 : 0;

  const createdDate =
    order?.createdAt
      ? new Date(
        order.createdAt
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
      : "—";

  return (
    <div className="relative flex items-center gap-3 p-3 transition hover:bg-gray-50/70 active:bg-gray-100/70 sm:gap-4 sm:p-5">
      <span
        className={`absolute inset-y-0 left-0 w-1 ${config.bar}`}
      />

      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5 sm:h-14 sm:w-14">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={firstItemName}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center ${config.iconBg}`}
          >
            <StatusIcon className="h-5 w-5" />
          </div>
        )}

        {extraItems > 0 && (
          <span className="oxanium absolute bottom-0 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-tl-md bg-black/70 px-1 text-[9px] font-bold text-white">
            +{extraItems}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="oxanium truncate text-[13px] font-bold sm:text-sm">
            {orderNumber}
          </p>

          <p className="oxanium mt-0.5 truncate text-[11px] text-gray-500 sm:text-xs">
            {createdDate}

            {itemCount > 0
              ? ` · ${itemCount} ${itemCount === 1
                ? "item"
                : "items"
              }`
              : ""}
          </p>

          <span
            className={`oxanium mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase sm:hidden ${config.badge}`}
          >
            <StatusIcon className="h-2.5 w-2.5" />
            {formatStatus(status)}
          </span>
        </div>

        <div className="shrink-0 text-right">
          <p className="oxanium text-[13px] font-bold sm:text-sm">
            ₹
            {total.toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}
          </p>

          <span
            className={`oxanium mt-1 hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase sm:inline-flex ${config.badge}`}
          >
            {formatStatus(status)}
          </span>
        </div>
      </div>
    </div>
  );
}

function OrderSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-black/5">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-3 sm:p-5"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-12 w-12 shrink-0 rounded-xl bg-gray-100 sm:h-14 sm:w-14" />

            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-28 rounded bg-gray-100 sm:w-32" />
                <div className="h-2.5 w-20 rounded bg-gray-100 sm:w-24" />
              </div>

              <div className="shrink-0 space-y-2 text-right">
                <div className="ml-auto h-3 w-14 rounded bg-gray-100 sm:w-16" />
                <div className="ml-auto h-4 w-16 rounded-full bg-gray-100 sm:h-5 sm:w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatStatus(status) {
  if (!status) {
    return "Pending";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}