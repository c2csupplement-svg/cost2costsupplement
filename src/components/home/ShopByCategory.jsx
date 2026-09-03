"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { useGetCategoriesQuery } from "@/services/productsApi";

function CategoryCard({ category }) {
  return (
    <Link
      href={category.href}
      className="
        group
        relative
        flex
        h-[165px]
        flex-col
        justify-between
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-black
        p-4
        shadow-[0_6px_25px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1.5
        hover:border-primary
        hover:shadow-[0_18px_40px_rgba(229,35,35,0.10)]

        sm:h-[210px]
        sm:rounded-2xl
        sm:p-7
      "
    >
      {/* Background Image */}
      {category.image && (
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            transition-transform
            duration-700
            group-hover:scale-110
          "
          style={{
            backgroundImage: `url(${category.image})`,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-black/10
          transition-all
          duration-500
          group-hover:from-black/80
          group-hover:via-primary/30
          group-hover:to-black/20
        "
      />

      {/* Red hover glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          h-32
          w-32
          rounded-full
          bg-primary/0
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-primary/10

          sm:h-40
          sm:w-40
        "
      />

      {/* Content */}
      <div className="relative mt-auto">
        <div className="flex items-end justify-between gap-2 sm:gap-4">
          <div className="min-w-0">
            <h3
              className="
                text-sm
                font-black
                uppercase
                leading-tight
                tracking-tight
                text-white
                transition-colors
                duration-300
                group-hover:text-primary

                sm:text-lg
              "
            >
              {category.title}
            </h3>

            {category.description && (
              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[10px]
                  leading-4
                  text-white/75

                  sm:mt-2
                  sm:max-w-[210px]
                  sm:text-xs
                  sm:leading-5
                "
              >
                {category.description}
              </p>
            )}
          </div>

          {/* Arrow */}
          <div
            className="
              flex
              h-7
              w-7
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-border
              text-white/75
              transition-all
              duration-300
              group-hover:border-primary
              group-hover:bg-primary
              group-hover:text-white

              sm:h-9
              sm:w-9
            "
          >
            <ArrowUpRight
              className="
                h-3
                w-3
                transition-transform
                duration-300
                group-hover:rotate-12

                sm:h-4
                sm:w-4
              "
            />
          </div>
        </div>
      </div>

      {/* Bottom red accent */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-[3px]
          w-0
          bg-primary
          transition-all
          duration-500
          group-hover:w-full
        "
      />
    </Link>
  );
}

export default function ShopByCategory() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const {
    data: categoriesData,
    isLoading,
    isError,
  } = useGetCategoriesQuery();

  const categories = useMemo(() => {
    const apiCategories = categoriesData?.categories || [];

    return apiCategories.map((category) => ({
      id: category.id,
      title: category.name || "Unnamed Category",
      description: category.description || "",
      slug: category.slug || "",
      href: `/shop?category=${category.slug}`,
      image: category.image || null,

      // Keeping children available for future use
      children: category.children || [],
    }));
  }, [categoriesData]);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || categories.length === 0) return;

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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [categories.length]);

  return (
    <section className="relative overflow-hidden bg-surface-muted py-14 sm:py-20 lg:py-18">
      {/* Background accent */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="mb-10 flex items-end justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />

              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                Find what you need
              </p>
            </div>

            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.03em] text-text-primary sm:text-4xl lg:text-5xl">
              Shop By Category
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-text-secondary">
              Explore our complete range of sports nutrition and wellness
              products designed to support every stage of your fitness journey.
            </p>
          </div>

          <Link
            href="/shop"
            className="
              group
              hidden
              shrink-0
              items-center
              gap-2
              rounded-lg
              border-2
              border-text-primary
              px-5
              py-3
              text-xs
              font-black
              uppercase
              tracking-wide
              text-text-primary
              transition-all
              duration-300
              hover:bg-text-primary
              hover:text-white
              sm:flex
            "
          >
            View All

            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* =====================================================
            CATEGORY MARQUEE
        ===================================================== */}

        <div className="relative">
          {/* LEFT FADE */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-surface-muted to-transparent sm:w-12 lg:w-20" />

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-surface-muted to-transparent sm:w-12 lg:w-20" />

          {/* Loading */}
          {isLoading && (
            <div
              className="
                flex
                gap-3
                overflow-hidden
                px-5
                pb-5

                sm:gap-5
                sm:px-8

                lg:gap-6
                lg:px-10
              "
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-[165px]
                    w-[calc((100vw-60px)/2)]
                    min-w-[calc((100vw-60px)/2)]
                    shrink-0
                    animate-pulse
                    rounded-xl
                    border
                    border-border
                    bg-card

                    sm:h-[210px]
                    sm:w-[280px]
                    sm:min-w-[280px]
                    sm:rounded-2xl

                    lg:w-[300px]
                    lg:min-w-[300px]
                  "
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="px-5 pb-5 text-sm text-text-secondary sm:px-8 lg:px-10">
              Unable to load categories right now.
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            !isError &&
            categories.length === 0 && (
              <div className="px-5 pb-5 text-sm text-text-secondary sm:px-8 lg:px-10">
                No categories available right now.
              </div>
            )}

          {/* Categories */}
          {!isLoading &&
            !isError &&
            categories.length > 0 && (
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
                  gap-3
                  overflow-x-auto
                  px-5
                  pb-5
                  cursor-grab
                  active:cursor-grabbing

                  sm:gap-5
                  sm:px-8

                  lg:gap-6
                  lg:px-10
                "
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {/* FIRST SET */}
                {categories.map((category) => (
                  <div
                    key={`first-${category.id}`}
                    className="
                      w-[calc((100vw-60px)/2)]
                      min-w-[calc((100vw-60px)/2)]
                      shrink-0
                      [&>*]:w-full

                      sm:w-[280px]
                      sm:min-w-[280px]

                      lg:w-[300px]
                      lg:min-w-[300px]
                    "
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}

                {/* DUPLICATE SET FOR INFINITE SCROLL */}
                {categories.length > 1 &&
                  categories.map((category) => (
                    <div
                      key={`duplicate-${category.id}`}
                      className="
                        w-[calc((100vw-60px)/2)]
                        min-w-[calc((100vw-60px)/2)]
                        shrink-0
                        [&>*]:w-full

                        sm:w-[280px]
                        sm:min-w-[280px]

                        lg:w-[300px]
                        lg:min-w-[300px]
                      "
                    >
                      <CategoryCard category={category} />
                    </div>
                  ))}
              </div>
            )}
        </div>

        {/* =====================================================
            MOBILE VIEW ALL
        ===================================================== */}

        <div className="mt-7 px-5 sm:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-black"
          >
            <span className="border-b-2 border-primary pb-1">
              View All Categories
            </span>

            <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}