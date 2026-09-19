"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

// Data aane tak card jaisa placeholder, taaki section ki height pehle se reserve rahe
function ProductCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white/80">
      <div className="aspect-square w-full animate-pulse bg-[#EAE4D9]" />

      <div className="flex min-h-[130px] flex-1 flex-col gap-2 p-3">
        <div className="h-2.5 w-1/3 animate-pulse rounded bg-[#EAE4D9]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#EAE4D9]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[#EAE4D9]" />

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <div className="h-4 w-14 animate-pulse rounded bg-[#EAE4D9]" />
          <div className="h-8 w-20 animate-pulse rounded-lg bg-[#EAE4D9]" />
        </div>
      </div>
    </div>
  );
}

const SKELETON_COUNT = 4;

const CARD_WRAPPER_CLASS = `
  flex
  h-auto
  min-w-0
  shrink-0
  snap-start
  items-stretch
  w-[calc((100vw-84px)/2)]
  sm:w-[290px]
  lg:w-[310px]
`;

export default function ProductSlider({
  eyebrow,
  title,
  description,
  products = [],
  loading = false,
  sectionClassName = "pt-8 pb-8 sm:pt-12 sm:pb-10 lg:pt-14 lg:pb-12",
  background = "beige",
}) {
  const sliderRef = useRef(null);

  const list = Array.isArray(products) ? products : [];

  const viewAllHref = `/products?search=${encodeURIComponent(eyebrow || "")}`;

  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const backgrounds = {
    beige: {
      section: "bg-gradient-to-b from-white via-[#F3EFE7] to-[#E4DDCD]",
      edge: "#E4DDCD",
      accent: "#DC2626",
      accentDark: "#B91C1C",
      accentMid: "#EF4444",
      accentSoft: "#FECACA",
      glow: "bg-[#D4C4B0]/40",
      text: "text-[#4A3B2A]",
      textMuted: "text-[#8A7862]",
      border: "border-[#D4C4B0]",
    },
  };

  const theme = backgrounds[background] || backgrounds.beige;

  const updateScrollState = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    const { scrollLeft, scrollWidth, clientWidth } = slider;

    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < maxScroll - 4);
    setScrollProgress(maxScroll > 0 ? scrollLeft / maxScroll : 0);
  };

  useEffect(() => {
    updateScrollState();

    const slider = sliderRef.current;

    if (!slider) return;

    slider.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [list.length, loading]);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    const firstCard = slider.querySelector("[data-product-card]");

    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;

    const gap =
      window.innerWidth >= 1024 ? 20 : window.innerWidth >= 640 ? 16 : 12;

    slider.scrollBy({
      left: direction === "left" ? -(cardWidth + gap) : cardWidth + gap,
      behavior: "smooth",
    });
  };

  // Loading khatam ho chuki hai aur koi product nahi hai, tabhi section hatao
  if (!loading && list.length === 0) {
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
          className={`
            absolute
            -right-32
            -top-32
            h-80
            w-80
            rounded-full
            blur-[110px]
            ${theme.glow}
          `}
        />

        <div
          className={`
            absolute
            -bottom-32
            -left-32
            h-72
            w-72
            rounded-full
            blur-[110px]
            ${theme.glow}
          `}
        />

        <div
          className={`
            absolute
            inset-x-0
            bottom-0
            h-px
            ${theme.border}
          `}
        />
      </div>

      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="
            relative
            z-10
            mb-6
            flex
            items-end
            justify-between
            gap-4
            px-5
            sm:mb-8
            sm:px-8
            lg:px-10
          "
        >
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span
                className="
                  h-[3px]
                  w-9
                  rounded-full
                  sm:w-11
                "
                style={{
                  backgroundColor: theme.accent,
                }}
              />

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.28em]
                  sm:text-xs
                "
                style={{
                  color: theme.accentDark,
                }}
              >
                {eyebrow}
              </p>
            </div>

            <h2
              className={`
                text-3xl
                font-black
                uppercase
                leading-[0.95]
                tracking-[-0.03em]
                sm:text-4xl
                lg:text-5xl
                ${theme.text}
              `}
            >
              {title}
            </h2>

            {description && (
              <p
                className={`
                  mt-3
                  max-w-2xl
                  text-sm
                  ${theme.textMuted}
                `}
              >
                {description}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="
              group
              hidden
              shrink-0
              items-center
              gap-2
              rounded-lg
              bg-red-600
              px-4
              py-3
              text-[10px]
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-red-700
              hover:shadow-lg
              hover:shadow-red-900/20
              sm:flex
            "
          >
            View All Products

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>

        <div className="relative px-0">
          {!loading && (
            <button
              type="button"
              onClick={() => scrollSlider("left")}
              aria-label="Previous products"
              disabled={!canScrollLeft}
              className="
                absolute
                left-2
                top-1/2
                z-30
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-red-600
                transition-all
                duration-200
                hover:scale-105
                hover:bg-red-600
                hover:text-white
                active:scale-95
                disabled:pointer-events-none
                disabled:opacity-0
                sm:left-3
                sm:h-11
                sm:w-11
                lg:left-4
                cursor-pointer
              "
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}

          <div
            ref={sliderRef}
            className="
              flex
              items-stretch
              gap-3
              overflow-x-auto
              px-12
              py-3
              sm:gap-4
              sm:px-16
              sm:py-4
              lg:gap-5
              lg:px-20
              lg:py-5
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden
              scroll-smooth
              snap-x
              snap-mandatory
              touch-pan-x
            "
          >
            {loading
              ? Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    aria-hidden="true"
                    className={CARD_WRAPPER_CLASS}
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : list.map((product, index) => (
                  <div
                    key={
                      product?.id ||
                      product?.productId ||
                      product?.slug ||
                      index
                    }
                    data-product-card
                    className={CARD_WRAPPER_CLASS}
                  >
                    <div
                      className="
                        flex
                        h-full
                        w-full
                        min-w-0
                        [&>*]:h-full
                        [&>*]:w-full
                      "
                    >
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
          </div>

          {!loading && (
            <button
              type="button"
              onClick={() => scrollSlider("right")}
              aria-label="Next products"
              disabled={!canScrollRight}
              className="
                absolute
                right-2
                top-1/2
                z-30
                flex
                h-9
                w-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-gray-200
                bg-white
                text-red-600
                transition-all
                duration-200
                hover:scale-105
                hover:bg-red-600
                hover:text-white
                active:scale-95
                disabled:pointer-events-none
                disabled:opacity-0
                sm:right-3
                sm:h-11
                sm:w-11
                lg:right-4
                cursor-pointer
              "
            >
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>

        <div
          className="
            mx-5
            mt-4
            flex
            items-center
            gap-2
            sm:mx-8
            lg:mx-10
          "
        >
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="
                  h-3
                  w-3
                  fill-[#FFD166]
                  text-[#FFD166]
                "
              />
            ))}
          </div>

          <span
            className={`
              text-[10px]
              font-semibold
              sm:text-xs
              ${theme.textMuted}
            `}
          >
            Loved by thousands of customers
          </span>
        </div>

        <div className="mt-3 px-5 sm:hidden">
          <Link
            href={viewAllHref}
            className="
              group
              inline-flex
              items-center
              gap-2
              text-xs
              font-black
              uppercase
              tracking-wide
              text-red-600
            "
          >
            <span
              className="
                border-b-2
                border-red-600
                pb-1
              "
            >
              View All Products
            </span>

            <ArrowRight
              className="
                mb-1
                h-4
                w-4
                text-red-600
                transition-transform
                duration-300
                group-hover:translate-x-1
                cursor-pointer
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}