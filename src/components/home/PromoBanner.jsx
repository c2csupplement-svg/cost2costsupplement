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
  } = useSelector((state) => state.banners || {});

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getBanner());
    }
  }, [dispatch, loaded, loading]);

  const featuredData =
    featuredBannerList?.data ?? featuredBannerList;

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
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[28px]">
          <div className="relative w-full">
            <Image
              src={desktopSrc}
              alt={altText}
              width={1440}
              height={500}
              priority
              sizes="(max-width: 639px) 0vw, 100vw"
              className="hidden h-auto w-full rounded-[20px] object-contain sm:block sm:rounded-[28px]"
            />

            <Image
              src={mobileSrc}
              alt={altText}
              width={750}
              height={1000}
              priority
              sizes="100vw"
              className="block h-auto w-full rounded-[20px] object-contain sm:hidden"
            />

            <div className="absolute inset-0 bg-black/10" />
          </div>

          <Link
            href="/products"
            className="group/cta absolute bottom-4 left-4 z-10 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-[11px] font-black uppercase tracking-wide text-white shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-primary-hover sm:bottom-6 sm:left-6 sm:h-12 sm:gap-3 sm:px-6 sm:text-xs lg:bottom-8 lg:left-8"
          >
            Shop Offers

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}