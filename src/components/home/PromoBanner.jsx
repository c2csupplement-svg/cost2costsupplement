"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useGetFeaturedBannerQuery } from "@/services/productsApi";

export default function PromoBanner() {
  const { data, isLoading } = useGetFeaturedBannerQuery();

  // Use the first active banner, if any.
  const banner = data?.banners?.[0];

  // Fall back to whichever image exists if only one of the two was set,
  // so a single uploaded image still shows on every screen size.
  const desktopSrc = banner?.image || banner?.mobileImage;
  const mobileSrc = banner?.mobileImage || banner?.image;

  // No banner data yet, or an empty/incomplete banner - render nothing.
  if (isLoading || !banner || (!desktopSrc && !mobileSrc)) {
    return null;
  }

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[20px]
            sm:rounded-[28px]
          "
        >
          {/* Banner Image */}
          <div className="relative w-full">
            {/* Desktop image */}
            <Image
              src={desktopSrc}
              alt="Special Offers"
              width={1440}
              height={500}
              priority
              className="
                hidden
                h-auto
                w-full
                rounded-[20px]
                object-contain
                sm:block
                sm:rounded-[28px]
              "
            />

            {/* Mobile image */}
            <Image
              src={mobileSrc}
              alt="Special Offers"
              width={750}
              height={1000}
              priority
              className="
                block
                h-auto
                w-full
                rounded-[20px]
                object-contain
                sm:hidden
              "
            />

            {/* Optional dark overlay for button visibility */}
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* CTA Button - Bottom Left */}
          <Link
            href="/shop"
            className="
              group/cta
              absolute
              bottom-4
              left-4
              z-10
              inline-flex
              h-10
              items-center
              gap-2
              rounded-lg
              bg-primary
              px-4
              text-[11px]
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-[0_8px_25px_rgba(0,0,0,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-primary-hover

              sm:bottom-6
              sm:left-6
              sm:h-12
              sm:gap-3
              sm:px-6
              sm:text-xs

              lg:bottom-8
              lg:left-8
            "
          >
            Shop Offers

            <ArrowRight
              className="
                h-4
                w-4
                transition-transform
                duration-300
                group-hover/cta:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}