"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getBanner } from "@/redux/features/banner/bannerAction";

export default function PromoBanner() {
  const dispatch = useDispatch();

  const {
    featuredBannerList,
    loading,
    loaded,
    error,
  } = useSelector(
    (state) => state.banners || {}
  );

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getBanner());
    }
  }, [dispatch, loaded, loading]);

  const featuredData =
    featuredBannerList?.data ??
    featuredBannerList;

  const banner = Array.isArray(featuredData)
    ? featuredData[0]
    : featuredData?.banners?.[0] ??
      featuredData?.banner ??
      featuredData;

  const desktopSrc =
    banner?.image ||
    banner?.desktopImage ||
    banner?.mobileImage;

  const mobileSrc =
    banner?.mobileImage ||
    banner?.image ||
    banner?.desktopImage;

  if (
    loading ||
    error ||
    !banner ||
    !desktopSrc ||
    !mobileSrc
  ) {
    return null;
  }

  const altText =
    banner?.title ||
    banner?.name ||
    banner?.alt ||
    "Special Offers";

  return (
    <section className="bg-background py-5 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6 lg:px-10">
        <div className="group relative overflow-hidden rounded-2xl sm:rounded-[24px]">
          <div className="relative w-full">
            <Image
              src={desktopSrc}
              alt={altText}
              width={1440}
              height={500}
              priority
              sizes="(max-width: 639px) 0vw, 100vw"
              className="
                hidden
                h-auto
                w-full
                object-contain
                sm:block
                sm:rounded-[24px]
              "
            />

            <img
              src={mobileSrc}
              alt={altText}
              className="
                block
                w-full
               
                sm:hidden
                h-110
              "
            />

            <div className="pointer-events-none absolute inset-0 bg-black/5" />
          </div>

          <Link
            href="/products"
            className="
              group/cta
              absolute
              bottom-3
              left-3
              z-10
              inline-flex
              h-9
              items-center
              gap-1.5
              rounded-lg
              bg-primary
              px-3
              text-[9px]
              font-black
              uppercase
              tracking-wide
              text-white
              shadow-[0_6px_18px_rgba(0,0,0,0.25)]
              transition-all
              duration-300
              hover:bg-primary-hover

              sm:bottom-5
              sm:left-5
              sm:h-11
              sm:gap-2
              sm:px-5
              sm:text-[11px]

              lg:bottom-7
              lg:left-7
              lg:h-12
              lg:px-6
              lg:text-xs
            "
          >
            Shop Offers

            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-1 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}