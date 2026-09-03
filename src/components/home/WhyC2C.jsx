"use client";

import {
  ShieldCheck,
  BadgeCheck,
  Truck,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Genuine",
    description: "Sourced from trusted brands only",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Brands",
    description: "Leading sports nutrition & wellness",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivered quickly to your doorstep",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "We help you pick the right products",
  },
];

export default function WhyC2C() {
  const marqueeFeatures = [...features, ...features];

  return (
    <section className="overflow-hidden bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="relative overflow-hidden">
          {/* Left fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent sm:w-16 lg:w-24" />

          {/* Right fade */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent sm:w-16 lg:w-24" />

          {/* Marquee */}
          <div className="why-c2c-marquee flex w-max gap-4 px-5 sm:gap-5 sm:px-8 lg:gap-6 lg:px-10">
            {marqueeFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={`${feature.title}-${index}`}
                  className="
                    flex
                    w-[280px]
                    min-w-[280px]
                    items-center
                    gap-4
                    rounded-xl
                    bg-[#F3F4F6]
                    p-5
                    sm:w-[300px]
                    sm:min-w-[300px]
                  "
                >
                  <Icon
                    className="h-8 w-8 shrink-0 text-primary"
                    strokeWidth={1.75}
                  />

                  <div>
                    <h3 className="text-base font-bold leading-tight text-text-primary">
                      {feature.title}
                    </h3>

                    <p className="mt-1 text-sm leading-snug text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}