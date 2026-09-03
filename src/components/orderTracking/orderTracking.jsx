"use client";

import { useState } from "react";
import { Search, PackageSearch } from "lucide-react";



export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e) => {
    e.preventDefault();

    if (!orderId.trim() || !email.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      /*
       * API WILL BE CONNECTED HERE LATER
       *
       * Example:
       *
       * const response = await fetch("/api/orders/track", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json",
       *   },
       *   body: JSON.stringify({
       *     orderId,
       *     email,
       *   }),
       * });
       *
       * const data = await response.json();
       *
       * setTrackingData(data);
       */

      // Temporary delay so the button behaves naturally
      await new Promise((resolve) => setTimeout(resolve, 700));

    } catch (error) {
      console.error("Order tracking error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">

      {/* =========================================
          BREADCRUMB
      ========================================= */}


      {/* =========================================
          TRACKING SECTION
      ========================================= */}

      <section className="px-5 py-24 sm:px-8 lg:px-10 lg:py-32">

        <div className="mx-auto w-full max-w-[750px]">

          {/* Header */}

          <div className="mb-8 text-center">

            <h1 className="bebas text-5xl uppercase tracking-wide text-[#050505] sm:text-6xl">
              Order Tracking
            </h1>

            <p className="oxanium mt-5 text-base text-[#555]">
              Tracking your order status
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleTrackOrder}
            className="space-y-5"
          >

            {/* Order ID */}

            <div>

              <label
                htmlFor="orderId"
                className="oxanium mb-2 block text-sm text-[#333]"
              >
                Order ID <span className="text-[#E52323]">*</span>
              </label>

              <div className="relative">

                <input
                  id="orderId"
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter the order ID"
                  required
                  className="oxanium h-[54px] w-full rounded-lg border border-[#E8E0F2] bg-white px-5 text-sm text-[#222] outline-none transition placeholder:text-[#888] focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                />

              </div>

            </div>

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="oxanium mb-2 block text-sm text-[#333]"
              >
                Email <span className="text-[#E52323]">*</span>
              </label>

              <div className="relative">

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="oxanium h-[54px] w-full rounded-lg border border-[#E8E0F2] bg-white px-5 text-sm text-[#222] outline-none transition placeholder:text-[#888] focus:border-[#E52323] focus:ring-1 focus:ring-[#E52323]"
                />

              </div>

            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={isLoading}
              className="oxanium flex h-[60px] w-full items-center justify-center gap-2 rounded-lg border border-[#E52323] bg-[#292929] text-sm font-semibold text-white transition hover:bg-[#E52323] disabled:cursor-not-allowed disabled:opacity-70"
            >

              {isLoading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Finding Order...
                </>
              ) : (
                <>
                  Find
                  <Search className="h-4 w-4" />
                </>
              )}

            </button>

          </form>

        </div>

      </section>

    </main>
  );
}