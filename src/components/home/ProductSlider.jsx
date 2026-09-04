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
  sectionClassName="py-16 sm:py-20 lg:py-12",
}) {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || products.length === 0) return;

    const speed = 35;

    const animate = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (!pausedRef.current) {
        slider.scrollLeft += (delta / 1000) * speed;

        const halfWidth = slider.scrollWidth / 2;

        if (slider.scrollLeft >= halfWidth) {
          slider.scrollLeft -= halfWidth;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [products.length]);

  if (!products.length) return null;

  return (
    <section
      className={`relative overflow-hidden bg-background ${sectionClassName}`}
    >
      {/* Decorative red glow */}
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />

      <div className="mx-auto max-w-[1440px]">
        {/* SECTION HEADING */}
        <div className="relative z-10 mb-10 flex items-end justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />

              <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
                {eyebrow}
              </p>
            </div>

            <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
              {title}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary">
              {description}
            </p>
          </div>

          <Link
            href="/products"
            className="group hidden shrink-0 items-center gap-2 rounded-lg border-2 border-text-primary px-5 py-3 text-xs font-black uppercase tracking-wide text-text-primary transition-all duration-300 hover:bg-text-primary hover:text-white sm:flex"
          >
            View All Products

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* MARQUEE */}
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
            gap-5
            overflow-x-auto
            px-5
            pb-5
            cursor-grab
            active:cursor-grabbing
            sm:gap-6
            sm:px-8
            lg:gap-7
            lg:px-10
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* LEFT FADE */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-12 lg:w-20" />

          {/* FIRST SET */}
          {products.map((product) => (
            <div
              key={`first-${product.id}`}
              className="
                w-[calc((100vw-60px)/2)]
                min-w-[calc((100vw-60px)/2)]
                shrink-0
                [&>*]:w-full

                sm:w-[310px]
                sm:min-w-[310px]

                lg:w-[320px]
                lg:min-w-[320px]
              "
            >
              <ProductCard product={product} />
            </div>
          ))}

          {/* DUPLICATE SET */}
          {products.map((product) => (
            <div
              key={`duplicate-${product.id}`}
              className="
                w-[calc((100vw-60px)/2)]
                min-w-[calc((100vw-60px)/2)]
                shrink-0
                [&>*]:w-full

                sm:w-[310px]
                sm:min-w-[310px]

                lg:w-[320px]
                lg:min-w-[320px]
              "
            >
              <ProductCard product={product} />
            </div>
          ))}

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-12 lg:w-20" />
        </div>

        {/* SOCIAL PROOF */}
        <div className="mx-5 mt-5 flex items-center gap-3 sm:mx-8 lg:mx-10">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-3.5 w-3.5 fill-[#F7B84B] text-[#F7B84B]"
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-text-muted">
            Loved by thousands of customers
          </span>
        </div>

        {/* MOBILE VIEW ALL */}
        <div className="mt-7 px-5 sm:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-text-primary"
          >
            <span className="border-b-2 border-primary pb-1">
              View All Products
            </span>

            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}