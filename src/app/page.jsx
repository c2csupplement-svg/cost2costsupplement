"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Hero from "@/components/home/New-Hero";
import ShopByGoal from "@/components/home/ShopByGoal";
import ProductSlider from "@/components/home/ProductSlider";
import { productSections } from "@/data/productSections";
import ShopByCategory from "@/components/home/ShopByCategory";
import BrandsSection from "@/components/home/BrandsSection";
import PromoBanner from "@/components/home/PromoBanner";
import BlogSection from "@/components/home/BlogSection";
import WhyC2C from "@/components/home/WhyC2C";

import { getAllProductAds } from "../redux/features/adProducts/adProductAction";

export default function Home() {
  const dispatch = useDispatch();

  const {
    loading,
    loaded,
    error,
    trendProduct,
    featuredProduct,
    topRelateProduct,
    popularProduct,
    topSellingProduct,
  } = useSelector((state) => state.productAd);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, loaded, loading]);

  const getProducts = (data) => {
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.products)) {
      return data.products;
    }

    return [];
  };

  const bestSellingProducts = getProducts(topSellingProduct);
  const featuredProducts = getProducts(featuredProduct);
  const popularProducts = getProducts(popularProduct);
  const topRatedProducts = getProducts(topRelateProduct);
  const trendingProducts = getProducts(trendProduct);

  const isLoading = loading && !loaded;

  return (
    <main className="min-h-screen bg-[#0B0B0B]">

      <Hero />

      <ShopByGoal />

      {error && (
        <div className="mx-auto w-full max-w-7xl px-4 py-4">
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-xl bg-white/5"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && bestSellingProducts.length > 0 && (
        <ProductSlider
          eyebrow="Best Sellers"
          title="Best Selling Products"
          description="Top-performing supplements loved by our customers"
          products={bestSellingProducts}
        />
      )}

      {!isLoading && featuredProducts.length > 0 && (
        <ProductSlider
          eyebrow="Featured"
          title="Featured Products"
          description="Handpicked supplements selected for you"
          products={featuredProducts}
        />
      )}

      {!isLoading && popularProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.popularProducts.eyebrow}
          title={productSections.popularProducts.title}
          description={productSections.popularProducts.description}
          products={popularProducts}
        />
      )}

      <ShopByCategory />

      {!isLoading && topRatedProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.topRated.eyebrow}
          title={productSections.topRated.title}
          description={productSections.topRated.description}
          products={topRatedProducts}
        />
      )}

      {!isLoading && trendingProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.trendingProducts.eyebrow}
          title={productSections.trendingProducts.title}
          description={productSections.trendingProducts.description}
          products={trendingProducts}
        />
      )}

      <BrandsSection />

      <PromoBanner />

      <BlogSection />

      <WhyC2C />

    </main>
  );
}