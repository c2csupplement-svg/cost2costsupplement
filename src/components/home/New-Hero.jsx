"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";
import {
  Autoplay,
  Navigation,
  EffectFade,
} from "swiper/modules";

import { getBanner } from "@/redux/features/banner/bannerAction";

import "swiper/css";
import "swiper/css/effect-fade";

export default function Hero() {
  const dispatch = useDispatch();

  const {
    bannerList,
    loading,
    loaded,
    error,
  } = useSelector(
    (state) => state.banners || {}
  );

  const [activeSlide, setActiveSlide] =
    useState(0);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getBanner());
    }
  }, [dispatch, loaded, loading]);

  const getBanners = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.banners)) {
      return data.banners;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.data?.banners)) {
      return data.data.banners;
    }

    return [];
  };

  const slides = getBanners(bannerList)
    .filter((banner) => {
      return (
        banner?.isActive === true ||
        banner?.isActive === 1 ||
        banner?.isActive === "true"
      );
    })
    .sort(
      (a, b) =>
        Number(a?.order || 0) -
        Number(b?.order || 0)
    );

  if (loading && !loaded) {
    return (
      <section className="w-full bg-[#101010]">
        <div
          className="
            h-[190px]
            w-full
            animate-pulse
            bg-[#151515]
            sm:h-[280px]
            md:h-[360px]
            lg:h-[500px]
          "
        />
      </section>
    );
  }

  if (error && !slides.length) {
    return null;
  }

  if (!slides.length) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#101010]">
      <Swiper
        modules={[
          Autoplay,
          Navigation,
          EffectFade,
        ]}
        effect="fade"
        fadeEffect={{
          crossFade: true,
        }}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={700}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        onSlideChange={(swiper) => {
          setActiveSlide(
            swiper.realIndex
          );
        }}
        className="hero-swiper w-full"
      >
        {slides.map((slide) => {
          const mobileImage =
            slide?.mobileImage ||
            slide?.image ||
            slide?.desktopImage;

          const desktopImage =
            slide?.desktopImage ||
            slide?.image ||
            slide?.mobileImage;

          if (
            !mobileImage &&
            !desktopImage
          ) {
            return null;
          }

          return (
            <SwiperSlide
              key={slide?.id}
            >
              <div className="relative w-full overflow-hidden">
                <picture className="block w-full">
                  <source
                    media="(max-width: 639px)"
                    srcSet={mobileImage}
                  />

                  <img
                    src={desktopImage}
                    alt={
                      slide?.title ||
                      `Cost2Cost banner ${
                        slide?.id || ""
                      }`
                    }
                    className="
                      block
                      h-auto
                      w-full
                      object-contain
                      object-center
                    "
                  />
                </picture>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {slides.length > 1 && (
        <>
          <div
            className="
              absolute
              bottom-4
              left-4
              z-30
              flex
              items-center
              gap-2
              sm:bottom-6
              sm:left-8
              sm:gap-3
              lg:bottom-8
              lg:left-10
              xl:left-16
            "
          >
            <button
              type="button"
              className="
                hero-prev
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-white/30
                bg-black/40
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-[#E52323]
                hover:bg-[#E52323]
                sm:h-12
                sm:w-12
              "
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <button
              type="button"
              className="
                hero-next
                flex
                h-9
                w-9
                items-center
                justify-center
                border
                border-white/30
                bg-black/40
                text-white
                backdrop-blur-md
                transition-all
                duration-300
                hover:border-[#E52323]
                hover:bg-[#E52323]
                sm:h-12
                sm:w-12
              "
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div
            className="
              absolute
              bottom-4
              right-4
              z-30
              sm:bottom-6
              sm:right-8
              lg:bottom-8
              lg:right-10
              xl:right-16
            "
          >
            <div className="flex items-baseline">
              <span className="bebas text-3xl text-white sm:text-5xl">
                {String(
                  activeSlide + 1
                ).padStart(2, "0")}
              </span>

              <span className="bebas mx-1.5 text-lg text-white/40 sm:mx-2 sm:text-2xl">
                /
              </span>

              <span className="bebas text-lg text-white/40 sm:text-2xl">
                {String(
                  slides.length
                ).padStart(2, "0")}
              </span>
            </div>
          </div>
        </>
      )}
    </section>
  );
}