"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Hero from "@/components/home/New-Hero";
import ProductSlider from "@/components/home/ProductSlider";
import ShopByCategory from "@/components/home/ShopByCategory";
import BrandsSection from "@/components/home/BrandsSection";
import PromoBanner from "@/components/home/PromoBanner";
import WhyC2C from "@/components/home/WhyC2C";
import { ShortInform } from "@/components/home/ShortInform";

import { productSections } from "@/data/productSections";
import { getAllProductAds } from "../redux/features/adProducts/adProductAction";

export default function Home({ initialBanners }) {
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
    comboProduct,
  } = useSelector((state) => state.productAd || {});

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

  // Pehle render se hi true rehta hai, jab tak data na aa jaaye.
  // Error aane par false ho jaata hai, taaki skeleton hamesha na dikhe.
  const isLoading = !loaded && !error;

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* initialBanners agle step mein page.jsx se server par aayenge */}
      <Hero initialBanners={initialBanners} />
      <ShopByCategory />

      {error && (
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        </div>
      )}

      {/* Screen par sabse pehle dikhne waale do sections: loading ke dauraan
          inka apna skeleton dikhta hai, isliye neeche ka page nahi khisakta.
          Products na hon to ProductSlider khud null return kar deta hai. */}
      <ProductSlider
        eyebrow="Trending"
        title={
          productSections.trendingProducts?.title ||
          "Trending Products"
        }
        description={
          productSections.trendingProducts?.description ||
          "Discover the products everyone is loving right now"
        }
        products={trendingProducts}
        loading={isLoading}
        background="dark"
      />

      <ProductSlider
        eyebrow="Combo"
        title="Must-Have Combos"
        description="Handpicked supplements selected for you"
        products={comboProducts}
        loading={isLoading}
        background="charcoal"
      />

      

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
          eyebrow="Popular"
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
          eyebrow="Top Rated"
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
          eyebrow="Recent"
          title="New Arrivals"
          description="Explore our latest products and supplements"
          products={recentProducts}
          background="charcoal"
        />
      )}

      <ShortInform />

      <BrandsSection />

      <WhyC2C />
    </main>
  );
}