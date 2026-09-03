"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { useGetBrandsQuery } from "@/services/productsApi";

export default function BrandsSection() {
  const {
    data: brandsData,
    isLoading,
    isError,
  } = useGetBrandsQuery();

  const brands = useMemo(() => {
    return (brandsData?.brands || [])
      .filter((brand) => brand.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }, [brandsData]);

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || brands.length === 0) return;

    const speed = 28;

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
  }, [brands.length]);

  // Don't show the section until brands are loaded
  if (isLoading) {
    return (
      <section className="relative overflow-hidden bg-surface-muted py-10">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto h-3 w-40 animate-pulse rounded bg-border" />

            <div className="mx-auto mt-4 h-10 w-64 animate-pulse rounded bg-border" />

            <div className="mx-auto mt-4 h-5 w-full max-w-lg animate-pulse rounded bg-border" />
          </div>

          <div className="mt-10 flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[100px] w-[180px] min-w-[180px] animate-pulse rounded-2xl bg-border"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide section if API fails or there are no brands
  if (isError || brands.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface-muted py-10 sm:py-10 lg:py-10">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* HEADING */}
        <div className="mx-auto max-w-2xl px-5 text-center sm:px-8">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-primary" />

            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
              Trusted by athletes
            </p>

            <span className="h-[2px] w-8 bg-primary" />
          </div>

          <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.03em] text-text-primary sm:text-5xl">
            Top Brands
          </h2>

          <p className="mt-4 text-sm leading-6 text-text-secondary">
            Shop genuine products from some of the biggest names in sports
            nutrition and wellness.
          </p>
        </div>

        {/* BRAND MARQUEE */}
        <div className="relative mt-10">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-10 bg-gradient-to-r from-surface-muted to-transparent sm:w-16 lg:w-24" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-10 bg-gradient-to-l from-surface-muted to-transparent sm:w-16 lg:w-24" />

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
            className="c2c-marquee flex cursor-grab gap-4 overflow-x-auto px-5 pb-4 active:cursor-grabbing sm:gap-5 sm:px-8 lg:gap-6 lg:px-10"
          >
            {/* First set */}
            {brands.map((brand) => (
              <BrandCard
                key={`first-${brand.id}`}
                brand={brand}
                
              />
            ))}

            {/* Duplicate set for infinite marquee */}
            {brands.map((brand) => (
              <BrandCard
                key={`duplicate-${brand.id}`}
                brand={brand}
                
              />
            ))}
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/brands"
            className="group inline-flex items-center gap-2 rounded-lg border-2 border-text-primary px-6 py-3 text-xs font-black uppercase tracking-wide text-text-primary transition-all duration-300 hover:bg-text-primary hover:text-white"
          >
            Explore All Brands

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function BrandCard({ brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      style={{ backgroundColor: brand.bgColor || '#ffffff' }}
      
      className="
        group
        relative
        flex
        h-[100px]
        w-[180px]
        min-w-[180px]
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-border
        px-8
        shadow-[0_6px_25px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-[0_16px_35px_rgba(229,35,35,0.10)]
        sm:h-[105px]
        sm:w-[180px]
        sm:min-w-[180px]
      "
    >
      {/* Red corner accent */}
      <div className="absolute right-0 top-0 h-12 w-12 translate-x-6 -translate-y-6 rotate-45 bg-primary/0 transition-all duration-300 group-hover:bg-primary" />

      {brand.logo ? (
        <img
          src={brand.logo}
          alt={brand.name}
          className="
            max-h-14
            max-w-[165px]
            object-contain
            transition-all
            duration-500
            group-hover:scale-105
            sm:max-h-16
            sm:max-w-[180px]
          "
        />
      ) : (
        <span className="text-center text-sm font-black uppercase text-text-primary transition-colors group-hover:text-primary">
          {brand.name}
        </span>
      )}

      {/* Bottom hover line */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}