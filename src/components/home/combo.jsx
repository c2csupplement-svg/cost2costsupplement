"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Star } from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

export default function ProductSlider({
  eyebrow,
  title,
  description,
  products = [],
  sectionClassName =
    "pt-8 pb-8 sm:pt-12 sm:pb-10 lg:pt-14 lg:pb-12",
  background = "beige",
}) {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  // Beige palette from the moodboard:
  // #E4DDCD (lightest) -> #D4C4B0 -> #C3A27C -> #A98862 (darkest)
  const backgrounds = {
    beige: {
      // Background fades from white (top, matches navbar) into the
      // lightest beige tone, so there's no hard seam.
      section: "bg-gradient-to-b from-white via-[#F3EFE7] to-[#E4DDCD]",
      edge: "#E4DDCD",
      accent: "#A98862",       // darkest - buttons
      accentDark: "#7A6548",   // hover state
      accentMid: "#C3A27C",    // underline, border
      accentSoft: "#D4C4B0",   // glow, subtle fills
      glow: "bg-[#D4C4B0]/40",
      text: "text-[#4A3B2A]",
      textMuted: "text-[#8A7862]",
      border: "border-[#D4C4B0]",
    },
  };

  const theme =
    backgrounds[background] || backgrounds.beige;

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || products.length <= 1) {
      return;
    }

    const speed = 35;

    const animate = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta =
        time - lastTimeRef.current;

      lastTimeRef.current = time;

      if (!pausedRef.current) {
        slider.scrollLeft +=
          (delta / 1000) * speed;

        const maxScroll =
          slider.scrollWidth -
          slider.clientWidth;

        if (
          maxScroll > 0 &&
          slider.scrollLeft >= maxScroll
        ) {
          slider.scrollLeft = 0;
        }
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      lastTimeRef.current = 0;
    };
  }, [products.length]);

  if (!products.length) {
    return null;
  }

  return (
    <section
      className={`
        relative
        overflow-hidden
        ${theme.section}
        ${sectionClassName}
      `}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute -right-32 -top-32 h-80 w-80 rounded-full blur-[110px] ${theme.glow}`}
        />

        <div
          className={`absolute -bottom-32 -left-32 h-72 w-72 rounded-full blur-[110px] ${theme.glow}`}
        />

        <div className={`absolute inset-x-0 bottom-0 h-px ${theme.border}`} />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div className="relative z-10 mb-6 flex items-end justify-between gap-4 px-5 sm:mb-8 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="h-[3px] w-9 rounded-full sm:w-11"
                style={{ backgroundColor: theme.accent }}
              />

              <p
                className="text-[10px] font-black uppercase tracking-[0.28em] sm:text-xs"
                style={{ color: theme.accentDark }}
              >
                {eyebrow}
              </p>
            </div>

            <h2 className={`text-3xl font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-4xl lg:text-5xl ${theme.text}`}>
              {title}
            </h2>

            {/* {description && (
              <p className={`mt-3 max-w-xl text-xs leading-5 sm:text-sm ${theme.textMuted}`}>
                {description}
              </p>
            )} */}
          </div>

          {/* <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition-colors duration-300 sm:flex"
            style={{ backgroundColor: theme.accent }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.accentDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.accent;
            }}
          >
            View All Products

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link> */}
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
            onTouchStart={() => {
              pausedRef.current = true;
            }}
            onTouchEnd={() => {
              pausedRef.current = false;
            }}
            className="
              relative
              flex
              cursor-grab
              items-start
              gap-3
              overflow-x-auto
              px-5
              pb-1
              active:cursor-grabbing
              sm:gap-4
              sm:px-8
              lg:gap-5
              lg:px-10
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >

             {products.map((product, index) => (
              <div
                key={
                  product.id ||
                  product.productId ||
                  product.slug ||
                  index
                }
                className="
                  w-[calc((100vw-60px)/2)]
                  min-w-[calc((100vw-60px)/2)]
                  shrink-0
                  [&>*]:w-full
                  sm:w-[290px]
                  sm:min-w-[290px]
                  lg:w-[310px]
                  lg:min-w-[310px]
                "
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-5 mt-4 flex items-center gap-2 sm:mx-8 lg:mx-10">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  className="h-3 w-3 fill-[#FFD166] text-[#FFD166]"
                />
              )
            )}
          </div>

          <span className={`text-[10px] font-semibold sm:text-xs ${theme.textMuted}`}>
            Loved by thousands of customers
          </span>
        </div>

        <div className="mt-3 px-5 sm:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide"
            style={{ color: theme.accentDark }}
          >
            <span
              className="border-b-2 pb-1"
              style={{ borderColor: theme.accent }}
            >
              View All Products
            </span>

            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: theme.accentDark }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}