"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowRight,
  Search,
  ChevronRight,
  Grid3X3,
} from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";

export default function BrandsPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const productAdState = useSelector(
    (state) => state.productAd || {}
  );

  const brands = productAdState?.brands;
  const loading = Boolean(productAdState?.loading);
  const loaded = Boolean(productAdState?.loaded);
  const error = productAdState?.error;

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, loaded, loading]);

  const normalizedBrands = useMemo(() => {
    const source = Array.isArray(brands)
      ? brands
      : Array.isArray(brands?.brands)
      ? brands.brands
      : Array.isArray(brands?.data)
      ? brands.data
      : Array.isArray(brands?.data?.brands)
      ? brands.data.brands
      : [];

    return source
      .map((brand, index) => {
        if (!brand || typeof brand !== "object") {
          return null;
        }

        const id =
          brand?.id ??
          brand?.brandId ??
          brand?._id ??
          `brand-${index}`;

        const name =
          brand?.name ??
          brand?.title ??
          brand?.brandName ??
          "";

        const slug =
          brand?.slug ||
          createSlug(name);

        const logo =
          brand?.logo ??
          brand?.image ??
          brand?.imageUrl ??
          brand?.logoUrl ??
          "";

        const bgColor =
          brand?.bgColor ??
          brand?.backgroundColor ??
          "#ffffff";

        const productCount =
          brand?.productCount ??
          brand?.productsCount ??
          brand?.totalProducts ??
          null;

        return {
          id,
          name: String(name).trim(),
          slug: String(slug).trim(),
          logo,
          bgColor,
          productCount,
        };
      })
      .filter(
        (brand) =>
          brand &&
          brand.name &&
          brand.slug
      );
  }, [brands]);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return normalizedBrands;
    }

    return normalizedBrands.filter((brand) =>
      brand.name.toLowerCase().includes(query)
    );
  }, [normalizedBrands, search]);

  if (
    loading &&
    normalizedBrands.length === 0
  ) {
    return <BrandsPageSkeleton />;
  }

  if (
    error &&
    normalizedBrands.length === 0
  ) {
    return (
      <main className="min-h-screen bg-surface-muted">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
          <div className="w-full rounded-3xl border border-border bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Grid3X3 className="h-7 w-7 text-primary" />
            </div>

            <h1 className="mt-5 text-2xl font-black uppercase tracking-tight text-text-primary">
              Unable to Load Brands
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              {error ||
                "We couldn't load brands right now."}
            </p>

            <button
              type="button"
              onClick={() => {
                dispatch(getAllProductAds());
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Try Again
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="relative overflow-hidden border-b border-border bg-surface-muted">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-10 lg:pb-20">
          <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
            <Link
              href="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="text-primary">
              Brands
            </span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />

              <p className="text-xs font-black uppercase tracking-[0.28em] text-primary">
                Our Brands
              </p>

              <span className="h-[2px] w-8 bg-primary" />
            </div>

            <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-6xl">
              Explore Brands
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-text-secondary sm:text-base">
              Discover products from trusted brands
              available in our store.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-secondary" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search brands..."
                className="h-14 w-full rounded-2xl border border-border bg-white pl-12 pr-5 text-sm font-medium text-text-primary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-text-primary sm:text-2xl">
              {search.trim()
                ? "Search Results"
                : "All Brands"}
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              {filteredBrands.length}{" "}
              {filteredBrands.length === 1
                ? "brand"
                : "brands"}{" "}
              available
            </p>
          </div>

          {search.trim() && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="self-start text-xs font-black uppercase tracking-wide text-primary transition hover:opacity-80 sm:self-auto"
            >
              Clear Search
            </button>
          )}
        </div>

        {filteredBrands.length === 0 ? (
          <div className="rounded-3xl border border-border bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
              <Search className="h-7 w-7 text-text-secondary" />
            </div>

            <h2 className="mt-5 text-xl font-black uppercase text-text-primary">
              No Brands Found
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Try searching with a different brand
              name.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90"
            >
              Show All Brands
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredBrands.map((brand) => (
              <BrandCard
                key={brand.id}
                brand={brand}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function BrandCard({ brand }) {
  const href = brand.slug
    ? `/brands/${encodeURIComponent(
        brand.slug
      )}`
    : "/brands";

  return (
    <Link
      href={href}
      style={{
        backgroundColor:
          brand.bgColor || "#ffffff",
      }}
      className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-border px-5 py-6 shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_35px_rgba(229,35,35,0.10)] sm:min-h-[165px] sm:px-6"
    >
      <div className="absolute right-0 top-0 h-16 w-16 translate-x-8 -translate-y-8 rotate-45 bg-primary/0 transition-all duration-300 group-hover:bg-primary/10" />

      <div className="flex h-20 w-full items-center justify-center sm:h-24">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.name}
            loading="lazy"
            className="max-h-16 max-w-full object-contain transition-all duration-500 group-hover:scale-105 sm:max-h-20"
          />
        ) : (
          <span className="text-center text-sm font-black uppercase text-text-primary transition-colors group-hover:text-primary">
            {brand.name}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-1 text-center">
        <span className="text-xs font-black uppercase tracking-wide text-text-primary transition-colors group-hover:text-primary sm:text-sm">
          {brand.name}
        </span>

        <ArrowRight className="h-3.5 w-3.5 translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
      </div>

      {brand.productCount !== null &&
        brand.productCount !== undefined && (
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
            {brand.productCount}{" "}
            {Number(brand.productCount) === 1
              ? "Product"
              : "Products"}
          </span>
        )}

      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}

function BrandsPageSkeleton() {
  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="border-b border-border bg-surface-muted">
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-3 w-40 animate-pulse rounded bg-border" />

            <div className="mx-auto mt-5 h-12 w-64 animate-pulse rounded bg-border sm:h-14 sm:w-80" />

            <div className="mx-auto mt-5 h-5 w-full max-w-xl animate-pulse rounded bg-border" />

            <div className="mx-auto mt-8 h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-border" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="mb-7">
          <div className="h-7 w-40 animate-pulse rounded bg-border" />

          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-border" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 18 }).map(
            (_, index) => (
              <div
                key={index}
                className="h-[150px] animate-pulse rounded-2xl bg-border sm:h-[165px]"
              />
            )
          )}
        </div>
      </section>
    </main>
  );
}

function createSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}