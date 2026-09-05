"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Hero from "@/components/home/New-Hero";
import ProductSlider from "@/components/home/ProductSlider";
import ShopByCategory from "@/components/home/ShopByCategory";
import BrandsSection from "@/components/home/BrandsSection";
import PromoBanner from "@/components/home/PromoBanner";
import WhyC2C from "@/components/home/WhyC2C";

import { productSections } from "@/data/productSections";
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
    recentProduct,
    comboProduct
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

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.data?.products)) {
      return data.data.products;
    }

    return [];
  };

  const trendingProducts = getProducts(trendProduct);
  const featuredProducts = getProducts(featuredProduct);
  const bestSellingProducts = getProducts(topSellingProduct);
  const popularProducts = getProducts(popularProduct);
  const topRatedProducts = getProducts(topRelateProduct);
  const recentProducts = getProducts(recentProduct);
  const comboProducts = getProducts(comboProduct);

  const isLoading = loading && !loaded;

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <Hero />

      {error && (
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-white/5 sm:h-72"
              />
            ))}
          </div>
        </div>
      )}

      {!isLoading && trendingProducts.length > 0 && (
        <ProductSlider
          eyebrow={
            productSections.trendingProducts?.eyebrow ||
            "Trending"
          }
          title={
            productSections.trendingProducts?.title ||
            "Trending Products"
          }
          description={
            productSections.trendingProducts?.description ||
            "Discover the products everyone is loving right now"
          }
          products={trendingProducts}
          background="dark"
        />
      )}


       {!isLoading && featuredProducts.length > 0 && (
        <ProductSlider
          eyebrow="Combo"
          title="Best Combo Offer"
          description="Handpicked supplements selected for you"
          products={comboProducts}
          background="charcoal"
        />
      )}

      <ShopByCategory />

      <PromoBanner />

      {!isLoading && featuredProducts.length > 0 && (
        <ProductSlider
          eyebrow="Featured"
          title="Featured Products"
          description="Handpicked supplements selected for you"
          products={featuredProducts}
          background="charcoal"
        />
      )}

      {!isLoading && bestSellingProducts.length > 0 && (
        <ProductSlider
          eyebrow="Best Sellers"
          title="Best Selling Products"
          description="Top-performing supplements loved by our customers"
          products={bestSellingProducts}
          background="red"
        />
      )}

      {!isLoading && popularProducts.length > 0 && (
        <ProductSlider
          eyebrow={
            productSections.popularProducts?.eyebrow ||
            "Popular"
          }
          title={
            productSections.popularProducts?.title ||
            "Popular Products"
          }
          description={
            productSections.popularProducts?.description ||
            "Popular supplements chosen by our customers"
          }
          products={popularProducts}
          background="soft"
        />
      )}

      {!isLoading && topRatedProducts.length > 0 && (
        <ProductSlider
          eyebrow={
            productSections.topRated?.eyebrow ||
            "Top Rated"
          }
          title={
            productSections.topRated?.title ||
            "Top Rated Products"
          }
          description={
            productSections.topRated?.description ||
            "Highly rated supplements from our collection"
          }
          products={topRatedProducts}
          background="dark"
        />
      )}

      {!isLoading && recentProducts.length > 0 && (
        <ProductSlider
          eyebrow="Recently Added"
          title="New Arrivals"
          description="Explore our latest products and supplements"
          products={recentProducts}
          background="charcoal"
        />
      )}

      <BrandsSection />

      <WhyC2C />
    </main>
  );
}