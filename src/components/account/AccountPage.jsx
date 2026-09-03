"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  Home,
  ShoppingBag,
  Star,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

import OverviewSection from "@/components/account/OverviewSection";
import OrdersSection from "@/components/account/OrdersSection";
import AccountSettingsSection from "@/components/account/AccountSettingsSection";
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
    label: "Reviews",
    icon: Star,
  },
  {
    label: "Addresses",
    icon: MapPin,
  },
  {
    label: "Account Settings",
    icon: Settings,
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

  /*
   * Wait for AuthContext to restore authentication
   * from localStorage.
   */
  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }
  }, [authLoading, isAuthenticated]);

  /*
   * Auth is still being restored.
   */
  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F7F7]">
        <p className="text-sm text-[#777]">
          Loading account...
        </p>
      </main>
    );
  }

  /*
   * Guest user
   *
   * Do NOT render the account dashboard.
   * Show a proper login-required page instead.
   */
  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#F7F7F7] text-[#111]">
        <div className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
            <div className="oxanium flex items-center gap-3 text-sm">
              <Link
                href="/"
                className="font-medium text-[#111] transition hover:text-[#E52323]"
              >
                Home
              </Link>

              <ChevronRight className="h-4 w-4 text-[#999]" />

              <span className="text-[#777]">My Account</span>
            </div>
          </div>
        </div>

        <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
          <div className="w-full max-w-[500px] rounded-2xl border border-black/10 bg-white p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#111]">
              <LogOut className="h-7 w-7 text-white" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-[#111] sm:text-3xl">
              Login Required
            </h1>

            <p className="mt-4 text-sm leading-6 text-[#666] sm:text-base">
              Please login to access your account, orders, addresses and
              account settings.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex h-12 items-center justify-center rounded-xl border border-[#E52323] bg-[#292929] px-7 text-sm font-medium text-white transition hover:bg-[#E52323]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="flex h-12 items-center justify-center rounded-xl border border-[#222] bg-white px-7 text-sm font-medium text-[#222] transition hover:border-[#E52323] hover:text-[#E52323]"
              >
                Create Account
              </button>
            </div>

            <Link
              href="/shop"
              className="mt-6 inline-block text-sm text-[#777] underline underline-offset-2 transition hover:text-[#E52323]"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </main>
    );
  }

  /*
   * Now it is safe to access user.name
   */
  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "?";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-[#F7F7F7] text-[#111]">

      {/* =========================================
          TOP BREADCRUMB
      ========================================= */}

      <div className="border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
          <div className="oxanium flex items-center gap-3 text-sm">

            <Link
              href="/"
              className="font-medium text-[#111] transition hover:text-[#E52323]"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4 text-[#999]" />

            <span className="text-[#777]">
              My Account
            </span>

          </div>
        </div>
      </div>

      {/* =========================================
          PAGE
      ========================================= */}

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">

        <div className="grid gap-8 lg:grid-cols-[270px_1fr]">

          {/* =====================================
              SIDEBAR
          ===================================== */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

              {/* Sidebar Profile */}

              <div className="border-b border-black/10 bg-[#111] p-6 text-white">

                <div className="flex items-center gap-4">

                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E52323]">
                    <span className="bebas text-3xl leading-none">
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
              </div>

              {/* Navigation */}

              <nav className="p-3">

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    activeSection === item.label;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() =>
                        setActiveSection(item.label)
                      }
                      className={`oxanium mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                        active
                          ? "bg-[#E52323] text-white shadow-[0_5px_18px_rgba(229,35,35,0.2)]"
                          : "text-[#555] hover:bg-[#F3F3F3] hover:text-[#111]"
                      }`}
                    >
                      <Icon className="h-[18px] w-[18px]" />

                      <span>
                        {item.label}
                      </span>

                      {active && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </button>
                  );
                })}

                <div className="my-3 h-px bg-black/10" />

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="oxanium flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold text-[#777] transition hover:bg-red-50 hover:text-[#E52323]"
                >
                  <LogOut className="h-[18px] w-[18px]" />

                  <span>
                    Logout
                  </span>
                </button>

              </nav>
            </div>
          </aside>

          {/* =====================================
              MAIN CONTENT
          ===================================== */}

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
                onBack={() =>
                  setActiveSection("Overview")
                }
              />
            )}

            {activeSection === "Account Settings" && (
              <AccountSettingsSection
                user={user}
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