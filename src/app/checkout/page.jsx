"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useShop } from "@/context/ShopContext";

export default function CheckoutPage() {
  const { cart, cartTotal, updateCartQuantity } = useShop();

  const formatPrice = (price) => `₹ ${price.toLocaleString("en-IN")}`;

  // Prevent checkout with empty cart
  if (cart.length === 0) {
    return (
      <>
        <Header />

        <main className="min-h-screen bg-background text-text-primary">
          <div className="mx-auto flex min-h-[650px] max-w-[1440px] flex-col items-center justify-center px-5 text-center sm:px-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-9 w-9 text-text-muted" />
            </div>

            <h1 className="bebas mt-6 text-4xl uppercase tracking-wide sm:text-5xl">
              Your Cart Is Empty
            </h1>

            <p className="oxanium mt-3 max-w-md text-sm leading-6 text-text-muted">
              Add some products to your cart before proceeding to checkout.
            </p>

            <Link
              href="/shop"
              className="oxanium mt-7 flex items-center gap-2 bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background text-text-primary">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
          
          {/* Breadcrumb */}
          <div className="oxanium mb-10 flex items-center gap-3 border-b border-border pb-6 text-sm">
            <Link
              href="/"
              className="text-text-muted transition hover:text-primary"
            >
              Home
            </Link>

            <span className="text-text-muted">›</span>

            <Link
              href="/cart"
              className="text-text-muted transition hover:text-primary"
            >
              Cart
            </Link>

            <span className="text-text-muted">›</span>

            <span className="text-text-muted">
              Checkout
            </span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <p className="oxanium mb-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Secure Checkout
            </p>

            <h1 className="bebas text-5xl uppercase tracking-wide sm:text-6xl">
              Checkout
            </h1>

            <p className="oxanium mt-3 text-sm text-text-muted">
              Complete your information to place your order.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_430px]">
            
            {/* LEFT - CUSTOMER INFORMATION */}
            <section className="space-y-7">
              
              {/* Contact */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="bebas text-2xl uppercase tracking-wide">
                  Contact Information
                </h2>

                <p className="oxanium mt-2 text-sm text-text-muted">
                  We'll use this information to contact you about your order.
                </p>

                <div className="mt-7">
                  <label className="oxanium mb-2 block text-sm font-semibold">
                    Email Address
                  </label>

                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="oxanium h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="mt-5">
                  <label className="oxanium mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="oxanium h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <h2 className="bebas text-2xl uppercase tracking-wide">
                  Shipping Address
                </h2>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="First Name"
                    placeholder="First name"
                  />

                  <FormField
                    label="Last Name"
                    placeholder="Last name"
                  />

                  <div className="sm:col-span-2">
                    <FormField
                      label="Address"
                      placeholder="House number and street name"
                    />
                  </div>

                  <FormField
                    label="City"
                    placeholder="City"
                  />

                  <FormField
                    label="State"
                    placeholder="State"
                  />

                  <FormField
                    label="PIN Code"
                    placeholder="PIN code"
                  />

                  <FormField
                    label="Country"
                    placeholder="India"
                  />
                </div>

                <div className="mt-5">
                  <label className="oxanium mb-2 block text-sm font-semibold">
                    Order Notes
                    <span className="ml-2 font-normal text-text-muted">
                      (Optional)
                    </span>
                  </label>

                  <textarea
                    rows={4}
                    placeholder="Notes about your order..."
                    className="oxanium w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-4 w-4 text-primary" />
                  </div>

                  <div>
                    <h2 className="bebas text-2xl uppercase tracking-wide">
                      Payment
                    </h2>

                    <p className="oxanium mt-2 text-sm leading-6 text-text-muted">
                      Secure payment options will be available when payment
                      integration is connected.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* RIGHT - ORDER SUMMARY */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                
                <h2 className="bebas text-2xl uppercase tracking-wide">
                  Your Order
                </h2>

                {/* Products */}
                <div className="mt-6 space-y-5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4"
                    >
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                        <Image
                          src={
                            item.images?.[0] ||
                            item.image ||
                            "/placeholder-product.png"
                          }
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />

                        <span className="oxanium absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                          {item.quantity}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${item.slug}`}
                          className="oxanium line-clamp-2 text-sm font-semibold leading-5 transition hover:text-primary"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.quantity - 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-muted transition hover:border-primary hover:text-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="oxanium text-xs font-medium text-text-muted">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(
                                item.id,
                                item.quantity + 1
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-text-muted transition hover:border-primary hover:text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <span className="oxanium shrink-0 text-sm font-bold">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="my-7 h-px bg-border" />

                {/* Coupon */}
                <div>
                  <label className="oxanium mb-2 block text-sm font-semibold">
                    Coupon Code
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="oxanium h-11 min-w-0 flex-1 rounded-lg border border-border bg-background px-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />

                    <button
                      type="button"
                      className="oxanium rounded-lg border border-border px-4 text-sm font-semibold transition hover:border-primary hover:text-primary"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="my-7 h-px bg-border" />

                {/* Totals */}
                <div className="oxanium space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">
                      Shipping
                    </span>

                    <span className="text-text-muted">
                      Calculated at checkout
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="bebas text-2xl uppercase tracking-wide">
                    Total
                  </span>

                  <span className="oxanium text-2xl font-bold text-primary">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Place Order */}
                <button
                  type="button"
                  className="oxanium mt-7 flex h-14 w-full items-center justify-center bg-primary text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                >
                  Place Order
                </button>

                <p className="oxanium mt-4 text-center text-xs leading-5 text-text-muted">
                  By placing your order, you agree to our terms and conditions.
                </p>
              </div>

              {/* Back to Cart */}
              <Link
                href="/cart"
                className="oxanium mt-5 flex items-center justify-center gap-2 text-sm text-text-muted transition hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to cart
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* =================================
   FORM FIELD
================================= */

function FormField({
  label,
  placeholder,
}) {
  return (
    <div>
      <label className="oxanium mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="oxanium h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}