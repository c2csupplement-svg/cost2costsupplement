"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingBag,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";

import OverviewSection from "@/components/account/OverviewSection";
import OrdersSection from "@/components/account/OrdersSection";
import AddressesSection from "@/components/account/AddressesSection";

import { useAuth } from "@/context/AuthContext";

const menuItems = [
  {
    label: "Overview",
    icon: Home,
  },
  {
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    label: "Addresses",
    icon: MapPin,
  },
];

const orders = [
  {
    id: "#C2C-10248",
    date: "26 Aug 2026",
    status: "Delivered",
    statusColor: "green",
    total: "₹2,503",
    items: "2 items",
  },
  {
    id: "#C2C-10231",
    date: "21 Aug 2026",
    status: "Shipped",
    statusColor: "blue",
    total: "₹1,906",
    items: "1 item",
  },
  {
    id: "#C2C-10194",
    date: "15 Aug 2026",
    status: "Processing",
    statusColor: "yellow",
    total: "₹3,399",
    items: "3 items",
  },
];

export default function AccountPage() {
  const router = useRouter();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuth();

  const [activeSection, setActiveSection] = useState("Overview");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-black/10 border-t-[#e52323]" />

          <p className="oxanium mt-4 text-sm text-gray-500">
            Loading your account...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#f7f7f7] text-[#111]">
        {/* Breadcrumb */}
        <div className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="oxanium flex items-center gap-2 text-sm">
              <Link
                href="/"
                className="font-medium transition hover:text-[#e52323]"
              >
                Home
              </Link>

              <ChevronRight className="h-4 w-4 text-gray-400" />

              <span className="text-gray-500">My Account</span>
            </div>
          </div>
        </div>

        {/* Login Required */}
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-10">
          <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 text-center sm:p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#111]">
              <LogOut className="h-6 w-6 text-white" />
            </div>

            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Login Required
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              Please login to access your account, orders, addresses and
              account settings.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="oxanium h-11 rounded-xl bg-[#111] px-5 text-sm font-semibold text-white transition hover:bg-[#e52323]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="oxanium h-11 rounded-xl border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-[#e52323] hover:text-[#e52323]"
              >
                Create Account
              </button>
            </div>

            <Link
              href="/products"
              className="oxanium mt-5 inline-block text-sm text-gray-500 underline underline-offset-4 hover:text-[#e52323]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-[#111]">
      {/* Breadcrumb */}
      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="oxanium flex items-center gap-2 text-sm">
            <Link
              href="/"
              className="font-medium transition hover:text-[#e52323]"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4 text-gray-400" />

            <span className="text-gray-500">My Account</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-7">
          {/* Sidebar */}
          <aside className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              {/* Profile */}
              <div className="bg-[#111] p-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#e52323]">
                    <span className="bebas text-3xl">
                      {firstLetter}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="oxanium truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="oxanium mt-1 truncate text-xs text-white/50">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-white/10 px-3 py-2">
                  <p className="oxanium text-xs text-white/70">
                    {orders.length} recent orders
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex gap-2 overflow-x-auto p-3 lg:block">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.label;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setActiveSection(item.label)}
                      className={`oxanium flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition lg:mb-1 lg:w-full lg:justify-start ${
                        active
                          ? "bg-[#e52323] text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-black"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />

                      <span>{item.label}</span>
                    </button>
                  );
                })}

                <div className="hidden border-t border-black/10 lg:my-2 lg:block" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="oxanium flex min-w-max flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 transition hover:bg-red-50 hover:text-[#e52323] lg:w-full lg:justify-start"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            {activeSection === "Overview" && (
              <OverviewSection
                user={user}
                firstLetter={firstLetter}
                orders={orders}
                setActiveSection={setActiveSection}
              />
            )}

            {activeSection === "Orders" && (
              <OrdersSection
                orders={orders}
                onBack={() => setActiveSection("Overview")}
              />
            )}

            {activeSection === "Addresses" && (
              <AddressesSection />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}