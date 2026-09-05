"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight } from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";

export default function ShopByGoal() {
  const dispatch = useDispatch();

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  const {
    goal: goalsData,
    loading,
    loaded,
    error,
  } = useSelector((state) => state.productAd);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, loaded, loading]);

  const getGoals = () => {
    let apiGoals = [];

    if (Array.isArray(goalsData)) {
      apiGoals = goalsData;
    } else if (Array.isArray(goalsData?.goals)) {
      apiGoals = goalsData.goals;
    } else if (Array.isArray(goalsData?.data)) {
      apiGoals = goalsData.data;
    }

    return apiGoals
      .filter((goal) => goal?.isActive !== false)
      .sort(
        (a, b) =>
          (a?.displayOrder || 0) -
          (b?.displayOrder || 0)
      )
      .map((goal) => ({
        id: goal.id,
        title: goal.name || "",
        description: goal.description || "",
        slug: goal.slug || "",
        href: `/shop?goal=${goal.slug || ""}`,
        image: goal.image || null,
      }));
  };

  const goals = getGoals();

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || goals.length <= 1) {
      return;
    }

    const speed = 28;

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

        const halfWidth =
          slider.scrollWidth / 2;

        if (
          halfWidth > 0 &&
          slider.scrollLeft >= halfWidth
        ) {
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
        cancelAnimationFrame(
          animationRef.current
        );
      }

      lastTimeRef.current = 0;
    };
  }, [goals.length]);

  if (!loading && !error && goals.length === 0) {
    return null;
  }

  if (loading && !loaded) {
    return (
      <section className="bg-background py-4 sm:py-8">
        <div className="flex gap-3 overflow-hidden px-4 sm:gap-4 sm:px-8 lg:px-10">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                h-[170px]
                w-[calc((100vw-44px)/2)]
                min-w-[calc((100vw-44px)/2)]
                animate-pulse
                rounded-xl
                bg-black/5
                sm:h-[250px]
                sm:w-[280px]
                sm:min-w-[280px]
              "
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-background py-4 sm:py-8 lg:py-8">
      <div className="pointer-events-none absolute -right-40 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-primary/5 blur-[90px]" />

      <div className="mx-auto max-w-[1440px]">
        <div className="relative z-10 px-4 sm:px-8 lg:px-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />

                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary sm:text-xs">
                  Train with purpose
                </p>
              </div>

              <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.03em] text-text-primary sm:text-4xl lg:text-5xl">
                Shop By Goal
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-text-secondary sm:mt-3 sm:text-sm">
                Whatever you're working towards, find the right nutrition to help you get there.
              </p>
            </div>

            <Link
              href="/products"
              className="group hidden shrink-0 items-center gap-2 text-xs font-black uppercase tracking-wide text-text-primary sm:flex"
            >
              <span className="border-b-2 border-primary pb-1">
                Explore All Goals
              </span>

              <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="relative mt-4 sm:mt-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-5 bg-gradient-to-r from-background to-transparent sm:w-10 lg:w-16" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-5 bg-gradient-to-l from-background to-transparent sm:w-10 lg:w-16" />

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
              flex
              cursor-grab
              gap-3
              overflow-x-auto
              px-4
              pb-1
              active:cursor-grabbing
              sm:gap-4
              sm:px-8
              lg:px-10
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
              />
            ))}

            {goals.length > 1 &&
              goals.map((goal) => (
                <GoalCard
                  key={`duplicate-${goal.id}`}
                  goal={goal}
                />
              ))}
          </div>
        </div>

        <div className="mt-3 px-4 sm:hidden">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-text-primary"
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
        h-[170px]
        w-[calc((100vw-44px)/2)]
        min-w-[calc((100vw-44px)/2)]
        shrink-0
        flex-col
        justify-end
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-card
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
        sm:h-[250px]
        sm:w-[280px]
        sm:min-w-[280px]
        sm:p-6
      "
    >
      {goal.image && (
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
            transition-transform
            duration-700
            group-hover:scale-105
          "
          style={{
            backgroundImage: `url(${goal.image})`,
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

      <div className="relative">
        <p className="mb-1 text-[8px] font-black uppercase tracking-[0.2em] text-primary sm:text-[10px]">
          Goal
        </p>

        <h3 className="text-base font-black uppercase leading-tight tracking-tight text-white sm:text-xl">
          {goal.title}
        </h3>

        {/* {goal.description && (
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-white/70 sm:mt-2 sm:text-xs sm:leading-5">
            {goal.description}
          </p>
        )} */}
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}