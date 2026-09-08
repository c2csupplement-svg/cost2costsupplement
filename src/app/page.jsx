"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useDispatch, useSelector } from "react-redux";

import Hero from "@/components/home/New-Hero";
import ProductSlider from "@/components/home/ProductSlider";
import ShopByCategory from "@/components/home/ShopByCategory";
import BrandsSection from "@/components/home/BrandsSection";
import PromoBanner from "@/components/home/PromoBanner";
import WhyC2C from "@/components/home/WhyC2C";

import { productSections } from "@/data/productSections";
import { getAllProductAds } from "../redux/features/adProducts/adProductAction";
import { homePageSeo } from "@/apiService/api";

export default function Home() {
  const dispatch = useDispatch();

  const [seo, setSeo] = useState({
    metaTitle: "Cost2Cost Supplement",
    metaDescription: "Buy quality nutraceutical supplements online",
    keywords: "",
    robots: "index, follow",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    schemaJson: "",
  });

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const response = await homePageSeo();

        const data = response?.data?.pageSeo || response?.pageSeo || response?.data || response;

        if (data) {
          setSeo((prev) => ({
            ...prev,
            ...data,
            metaTitle: data.metaTitle || prev.metaTitle,
            metaDescription: data.metaDescription || prev.metaDescription,
            robots: data.robots || prev.robots,
          }));
        }
      } catch (err) {
        console.error("SEO Error:", err?.message || err);
      }
    };

    fetchSeo();
  }, []);

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
    <>
      <Head>
        <title>{seo.metaTitle}</title>

        <meta
          name="description"
          content={seo.metaDescription}
        />

        {seo.keywords && (
          <meta
            name="keywords"
            content={seo.keywords}
          />
        )}

        <meta
          name="robots"
          content={seo.robots || "index, follow"}
        />

        {seo.canonical && (
          <link
            rel="canonical"
            href={seo.canonical}
          />
        )}

        <meta
          property="og:title"
          content={seo.ogTitle || seo.metaTitle}
        />

        <meta
          property="og:description"
          content={seo.ogDescription || seo.metaDescription}
        />

        {seo.ogImage && (
          <meta
            property="og:image"
            content={seo.ogImage}
          />
        )}

        {seo.ogUrl && (
          <meta
            property="og:url"
            content={seo.ogUrl}
          />
        )}

        <meta
          name="twitter:card"
          content={seo.twitterCard || "summary_large_image"}
        />

        <meta
          name="twitter:title"
          content={seo.twitterTitle || seo.metaTitle}
        />

        <meta
          name="twitter:description"
          content={
            seo.twitterDescription || seo.metaDescription
          }
        />

        {(seo.twitterImage || seo.ogImage) && (
          <meta
            name="twitter:image"
            content={seo.twitterImage || seo.ogImage}
          />
        )}

        {seo.schemaJson && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html:
                typeof seo.schemaJson === "string"
                  ? seo.schemaJson
                  : JSON.stringify(seo.schemaJson),
            }}
          />
        )}
      </Head>

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
            eyebrow={"Trending"}
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

        {!isLoading && comboProducts.length > 0 && (
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
            eyebrow={"Popular"}
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
            eyebrow={"Top Rated"}
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

        <BrandsSection />

        <WhyC2C />
      </main>
    </>
  );
}