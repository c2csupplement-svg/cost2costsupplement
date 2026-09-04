import { Suspense } from "react";
import ShopPage from "@/components/shop/ShopPage";
import WhyC2C from "@/components/home/WhyC2C";

function ShopPageLoading() {
  return (
    <div className="min-h-[600px] bg-[#FAFAFA]">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
        <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 h-12 w-full animate-pulse rounded bg-gray-200" />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] animate-pulse rounded-xl border border-[#E5E5E5] bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] text-white">
      <Suspense fallback={<ShopPageLoading />}>
        <ShopPage />
      </Suspense>

      <WhyC2C />
    </main>
  );
}