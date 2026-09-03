"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight } from "lucide-react";

import { useGetGoalsQuery } from "@/services/productsApi";

export default function ShopByGoal() {
  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const {
    data: goalsData,
    isLoading,
    isError,
  } = useGetGoalsQuery();

  const goals = useMemo(() => {
    const apiGoals = goalsData?.goals || [];

    return apiGoals
      .filter((goal) => goal.isActive !== false)
      .sort(
        (a, b) =>
          (a.displayOrder || 0) - (b.displayOrder || 0)
      )
      .map((goal) => ({
        id: goal.id,
        title: goal.name || "",
        description: goal.description || "",
        slug: goal.slug || "",
        href: `/shop?goal=${goal.slug}`,
        image: goal.image || null,
      }));
  }, [goalsData]);

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || goals.length === 0) return;

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

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [goals.length]);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-12">
      {/* Background accents */}
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/5 blur-[110px]" />

      <div className="mx-auto max-w-[1440px]">
        {/* =====================================================
            HEADING
        ===================================================== */}

        <div className="relative z-10 px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />

                <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
                  Train with purpose
                </p>
              </div>

              <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.03em] text-text-primary sm:text-5xl lg:text-6xl">
                Shop By Goal
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-text-secondary">
                Whatever you're working towards, find the right nutrition to
                help you get there.
              </p>
            </div>

            <Link
              href="/shop"
              className="group hidden items-center gap-2 text-xs font-black uppercase tracking-wide text-text-primary sm:flex"
            >
              <span className="border-b-2 border-primary pb-1">
                Explore All Goals
              </span>

              <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* =====================================================
            GOAL MARQUEE
        ===================================================== */}

        <div className="relative mt-10">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-8 bg-gradient-to-r from-background to-transparent sm:w-12 lg:w-20" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-8 bg-gradient-to-l from-background to-transparent sm:w-12 lg:w-20" />

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-4 overflow-hidden px-5 pb-5 sm:gap-5 sm:px-8 lg:px-10">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="
                    h-[210px]
                    w-[calc((100vw-60px)/2)]
                    min-w-[calc((100vw-60px)/2)]
                    animate-pulse
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    sm:h-[290px]
                    sm:w-[310px]
                    sm:min-w-[310px]
                  "
                />
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && isError && (
            <div className="px-5 pb-5 text-sm text-text-secondary sm:px-8 lg:px-10">
              Unable to load goals right now.
            </div>
          )}

          {/* Empty State */}
          {!isLoading &&
            !isError &&
            goals.length === 0 && (
              <div className="px-5 pb-5 text-sm text-text-secondary sm:px-8 lg:px-10">
                No goals available right now.
              </div>
            )}

          {/* Goals */}
          {!isLoading &&
            !isError &&
            goals.length > 0 && (
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
                  c2c-marquee
                  flex
                  cursor-grab
                  gap-4
                  overflow-x-auto
                  px-5
                  pb-5
                  active:cursor-grabbing
                  sm:gap-5
                  sm:px-8
                  lg:px-10
                "
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                {/* First Set */}
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                  />
                ))}

                {/* Duplicate Set for Infinite Scroll */}
                {goals.length > 1 &&
                  goals.map((goal) => (
                    <GoalCard
                      key={`duplicate-${goal.id}`}
                      goal={goal}
                    />
                  ))}
              </div>
            )}
        </div>

        {/* Mobile CTA */}
        <div className="mt-3 px-5 sm:hidden">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-text-primary"
          >
            <span className="border-b-2 border-primary pb-1">
              Explore All Goals
            </span>

            <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function GoalCard({ goal }) {
  return (
    <Link
      href={goal.href}
      className="
        group
        relative
        flex

        h-[210px]
        w-[calc((100vw-60px)/2)]
        min-w-[calc((100vw-60px)/2)]

        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        p-4
        shadow-[0_6px_25px_rgba(0,0,0,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        hover:shadow-[0_18px_40px_rgba(229,35,35,0.12)]

        sm:h-[290px]
        sm:w-[310px]
        sm:min-w-[310px]
        sm:p-7
      "
    >
      {/* Background Image */}
      {goal.image && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${goal.image})`,
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
          via-black/45
          to-black/10
          transition-all
          duration-500
          group-hover:from-black/80
          group-hover:via-primary/30
        "
      />

      {/* Red glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-primary/0
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-primary/10
        "
      />

      {/* Icon + Arrow */}
      <div className="relative flex items-center justify-between" />

      {/* Content */}
      <div className="relative">
        <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-primary sm:mb-2 sm:text-[10px] sm:tracking-[0.25em]">
          Goal
        </p>

        <h3 className="text-base font-black uppercase leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-primary sm:text-xl">
          {goal.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-text-muted sm:mt-2 sm:max-w-[245px] sm:text-xs sm:leading-5">
          {goal.description}
        </p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}