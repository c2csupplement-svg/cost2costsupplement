"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const BANNERS_API =
  "https://cost2costsupplement-backend-2.onrender.com/api/banners/";

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(BANNERS_API);

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const data = await response.json();

        // Only show active banners and sort by order
        const activeBanners = (data.banners || [])
          .filter((banner) => banner.isActive)
          .sort((a, b) => a.order - b.order);

        setSlides(activeBanners);
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (isLoading) {
    return (
      <section className="h-[250px] w-full animate-pulse bg-[#101010] sm:h-[400px] lg:h-[600px]" />
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#101010]">
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
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
          setActiveSlide(swiper.realIndex);
        }}
        className="hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full">
              <picture className="block w-full">
                {/* Mobile */}
                <source
                  media="(max-width: 639px)"
                  srcSet={slide.mobileImage}
                />

                {/* Desktop + Tablet */}
                <img
                  src={slide.desktopImage}
                  alt={slide.title || `Cost2Cost banner ${slide.id}`}
                  className="block h-auto w-full"
                />
              </picture>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Controls */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-5 z-30 flex items-center gap-3 sm:bottom-6 sm:left-8 lg:bottom-8 lg:left-10 xl:left-16">
          <button
            type="button"
            className="hero-prev flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-[#E52323] hover:bg-[#E52323] sm:h-12 sm:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="hero-next flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-white backdrop-blur-md transition-all duration-300 hover:border-[#E52323] hover:bg-[#E52323] sm:h-12 sm:w-12"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Slide Number */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 right-5 z-30 sm:bottom-6 sm:right-8 lg:bottom-8 lg:right-10 xl:right-16">
          <div className="flex items-baseline">
            <span className="bebas text-4xl text-white sm:text-5xl">
              {String(activeSlide + 1).padStart(2, "0")}
            </span>

            <span className="bebas mx-2 text-xl text-white/40 sm:text-2xl">
              /
            </span>

            <span className="bebas text-xl text-white/40 sm:text-2xl">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}