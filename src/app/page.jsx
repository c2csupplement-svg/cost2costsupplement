"use client";

import Header from "@/components/layout/Header";
import {useGetBestSellingProductsQuery, useGetFeaturedProductsQuery , useGetRecentProductsQuery ,useGetTrendingProductsQuery,useGetTopRatedProductsQuery , useGetPopularProductsQuery  } from "@/services/productsApi";
import Hero from "@/components/home/New-Hero";
import ShopByGoal from "@/components/home/ShopByGoal";
import ProductSlider from "@/components/home/ProductSlider";
import { productSections } from "@/data/productSections";
import ShopByCategory from "@/components/home/ShopByCategory";
import BrandsSection from "@/components/home/BrandsSection";
import PromoBanner from "@/components/home/PromoBanner";
import BlogSection from "@/components/home/BlogSection";
import WhyC2C from "@/components/home/WhyC2C";
import Footer from "@/components/layout/Footer";

export default function Home() {

  const {
    data: bestSellingData,
    isLoading: isBestSellingLoading,
  } = useGetBestSellingProductsQuery();
  
  const bestSellingProducts = bestSellingData?.products || [];
  const {
    data: featuredData,
    isLoading: isFeaturedLoading,
  } = useGetFeaturedProductsQuery();

  const featuredProducts = featuredData?.products || [];

  const {
    data: popularData,
    isLoading: isPopularLoading,
  } = useGetPopularProductsQuery();

  const popularProducts = popularData?.products || [];

  const {
    data: topRatedData,
    isLoading: isTopRatedLoading,
  } = useGetTopRatedProductsQuery();

  const topRatedProducts = topRatedData?.products || [];

  const {
    data: trendingData,
    isLoading: isTrendingLoading,
  } = useGetTrendingProductsQuery();

  const trendingProducts = trendingData?.products || [];

  const {
    data: recentData,
    isLoading: isRecentLoading,
  } = useGetRecentProductsQuery();

  const recentProducts = recentData?.products || [];

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      <Header />

      <Hero />

      <ShopByGoal />

      {!isBestSellingLoading && bestSellingProducts.length > 0 && (
        <ProductSlider
          eyebrow="Best Sellers"
          title="Best Selling Products"
          description="Top-performing supplements loved by our customers"
          products={bestSellingProducts}
        />
      )}

      {!isFeaturedLoading && featuredProducts.length > 0 && (
        <ProductSlider
          eyebrow="Featured"
          title="Featured Products"
          description="Handpicked supplements selected for you"
          products={featuredProducts}
        />
      )}

      {!isPopularLoading && popularProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.popularProducts.eyebrow}
          title={productSections.popularProducts.title}
          description={productSections.popularProducts.description}
          products={popularProducts}
        />
      )}

      <ShopByCategory />

      {!isTopRatedLoading && topRatedProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.topRated.eyebrow}
          title={productSections.topRated.title}
          description={productSections.topRated.description}
          products={topRatedProducts}
        />
      )}

      {!isTrendingLoading && trendingProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.trendingProducts.eyebrow}
          title={productSections.trendingProducts.title}
          description={productSections.trendingProducts.description}
          products={trendingProducts}
        />
      )}

      {!isRecentLoading && recentProducts.length > 0 && (
        <ProductSlider
          eyebrow={productSections.recentlyAdded.eyebrow}
          title={productSections.recentlyAdded.title}
          description={productSections.recentlyAdded.description}
          products={recentProducts}
        />
      )}

      <BrandsSection />

      <PromoBanner />

      <BlogSection />

      <WhyC2C />

      <Footer />
    </main>
  );
}