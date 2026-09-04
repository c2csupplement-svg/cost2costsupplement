"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
  Search,
} from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";
import { getBrandBySlug } from "@/apiService/api";
import ProductCard from "@/components/products/ProductCard";

const PAGE_SIZE = 12;

function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBrands(brands) {
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
        brand.id ??
        brand.brandId ??
        brand._id ??
        `brand-${index}`;

      const name =
        brand.name ??
        brand.title ??
        brand.brandName ??
        "";

      const slug =
        brand.slug ||
        createSlug(name);

      return {
        id,
        name: String(name).trim(),
        slug: String(slug).trim(),
        logo:
          brand.logo ||
          brand.image ||
          brand.imageUrl ||
          brand.logoUrl ||
          "",
        description:
          brand.description || "",
        productCount:
          brand.productCount ??
          brand.productsCount ??
          brand.totalProducts ??
          brand._count?.products ??
          null,
      };
    })
    .filter(
      (brand) =>
        brand &&
        brand.name &&
        brand.slug
    );
}

/* -------------------------------------------------------------------------- */
/* Other Brands                                                               */
/* -------------------------------------------------------------------------- */

function OtherBrands({
  brands,
  currentSlug,
}) {
  const otherBrands = useMemo(() => {
    const current = String(
      currentSlug || ""
    )
      .trim()
      .toLowerCase();

    return brands.filter(
      (brand) =>
        String(brand.slug || "")
          .trim()
          .toLowerCase() !== current
    );
  }, [brands, currentSlug]);

  if (!otherBrands.length) {
    return null;
  }

  return (
    <section className="border-b border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Explore Brands
            </p>

            <h2 className="mt-1 text-sm font-black uppercase tracking-tight text-text-primary sm:text-base">
              Other Brands
            </h2>
          </div>

          <Link
            href="/brands"
            className="shrink-0 text-[10px] font-black uppercase tracking-wide text-primary transition hover:underline sm:text-xs"
          >
            View All
          </Link>
        </div>

        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {otherBrands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${encodeURIComponent(
                brand.slug
              )}`}
              className="group flex h-[82px] min-w-[160px] shrink-0 items-center gap-3 rounded-xl border border-border bg-surface-muted px-3 transition-all duration-300 hover:border-primary hover:shadow-[0_10px_25px_rgba(229,35,35,0.08)] sm:h-[90px] sm:min-w-[190px] sm:px-4"
            >
              {/* Logo */}
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-1.5 sm:h-14 sm:w-14">
                {brand.logo ? (
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span className="px-1 text-center text-[8px] font-black uppercase text-text-primary">
                    {brand.name}
                  </span>
                )}
              </div>

              {/* Brand Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-black uppercase tracking-tight text-text-primary transition-colors group-hover:text-primary sm:text-sm">
                  {brand.name}
                </p>

                {brand.productCount !== null &&
                  brand.productCount !== undefined && (
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-wide text-text-secondary sm:text-[10px]">
                      {brand.productCount}{" "}
                      {Number(
                        brand.productCount
                      ) === 1
                        ? "Product"
                        : "Products"}
                    </p>
                  )}
              </div>

              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-text-secondary transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-square animate-pulse bg-surface-muted" />

      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-4 animate-pulse rounded bg-surface-muted" />

        <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />

        <div className="h-5 w-1/3 animate-pulse rounded bg-surface-muted" />
      </div>
    </div>
  );
}

function BrandPageSkeleton() {
  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Brands Skeleton */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-[82px] min-w-[160px] animate-pulse rounded-xl bg-surface-muted sm:h-[90px] sm:min-w-[190px]"
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* Header Skeleton */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-3 w-36 animate-pulse rounded bg-border" />

            <div className="mx-auto mt-6 h-28 w-44 animate-pulse rounded-2xl bg-border" />

            <div className="mx-auto mt-6 h-12 w-64 animate-pulse rounded bg-border sm:h-14 sm:w-80" />

            <div className="mx-auto mt-5 h-5 w-full max-w-xl animate-pulse rounded bg-border" />
          </div>
        </div>
      </section>

      {/* Products Skeleton */}
      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-8 h-7 w-48 animate-pulse rounded bg-border" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <ProductSkeleton key={index} />
            )
          )}
        </div>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Pagination                                                                 */
/* -------------------------------------------------------------------------- */

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  if (totalPages <= 7) {
    for (
      let page = 1;
      page <= totalPages;
      page += 1
    ) {
      pages.push(page);
    }
  } else {
    pages.push(1);

    if (currentPage > 3) {
      pages.push("start-dots");
    }

    const start = Math.max(
      2,
      currentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      currentPage + 1
    );

    for (
      let page = start;
      page <= end;
      page += 1
    ) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("end-dots");
    }

    pages.push(totalPages);
  }

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {/* Previous */}
      <button
        type="button"
        disabled={
          currentPage <= 1 ||
          loading
        }
        onClick={() =>
          onPageChange(
            currentPage - 1
          )
        }
        className="flex h-10 items-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-black uppercase tracking-wide text-text-primary transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />

        <span className="hidden sm:inline">
          Previous
        </span>
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (
          page === "start-dots" ||
          page === "end-dots"
        ) {
          return (
            <span
              key={`${page}-${index}`}
              className="flex h-10 w-10 items-center justify-center text-sm font-bold text-text-secondary"
            >
              ...
            </span>
          );
        }

        const active =
          page === currentPage;

        return (
          <button
            key={page}
            type="button"
            disabled={loading}
            onClick={() =>
              onPageChange(page)
            }
            aria-current={
              active
                ? "page"
                : undefined
            }
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-xs font-black transition-all ${
              active
                ? "border-primary bg-primary text-white"
                : "border-border bg-card text-text-primary hover:border-primary hover:text-primary"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        type="button"
        disabled={
          currentPage >= totalPages ||
          loading
        }
        onClick={() =>
          onPageChange(
            currentPage + 1
          )
        }
        className="flex h-10 items-center gap-1 rounded-lg border border-border bg-card px-3 text-xs font-black uppercase tracking-wide text-text-primary transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">
          Next
        </span>

        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function BrandsPage({
  params,
}) {
  const { slug } = use(params);

  const dispatch = useDispatch();

  const [brandData, setBrandData] =
    useState(null);

  const [brandLoading, setBrandLoading] =
    useState(true);

  const [brandError, setBrandError] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [search, setSearch] =
    useState("");

  const productAdState = useSelector(
    (state) => state.productAd || {}
  );

  const brands = useMemo(
    () =>
      normalizeBrands(
        productAdState.brands
      ),
    [productAdState.brands]
  );

  const adsLoading = Boolean(
    productAdState.loading
  );

  const adsLoaded = Boolean(
    productAdState.loaded
  );

  useEffect(() => {
    if (!adsLoaded && !adsLoading) {
      dispatch(getAllProductAds());
    }
  }, [
    dispatch,
    adsLoaded,
    adsLoading,
  ]);

  useEffect(() => {
    setCurrentPage(1);
    setSearch("");
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let active = true;

    const fetchBrand = async () => {
      try {
        setBrandLoading(true);
        setBrandError(null);

        const response =
          await getBrandBySlug(
            slug,
            currentPage,
            PAGE_SIZE
          );

        if (!active) {
          return;
        }

        const data =
          response?.data ?? response;

        setBrandData(data);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "getBrandBySlug:",
          error
        );

        setBrandError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load brand"
        );

        setBrandData(null);
      } finally {
        if (active) {
          setBrandLoading(false);
        }
      }
    };

    fetchBrand();

    return () => {
      active = false;
    };
  }, [slug, currentPage]);


  const brand =
    brandData?.brand || null;

  const displayName =
    brand?.name ||
    brand?.title ||
    brand?.brandName ||
    slug;

  const displayLogo =
    brand?.logo ||
    brand?.image ||
    brand?.imageUrl ||
    brand?.logoUrl ||
    "";

  const displayDescription =
    brand?.description || "";

  const products = useMemo(() => {
    return Array.isArray(
      brandData?.products
    )
      ? brandData.products
      : [];
  }, [brandData]);

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter(
      (product) => {
        const name = String(
          product?.name ||
            product?.title ||
            product?.productName ||
            ""
        ).toLowerCase();

        const sku = String(
          product?.sku || ""
        ).toLowerCase();

        const productSlug = String(
          product?.slug || ""
        ).toLowerCase();

        return (
          name.includes(query) ||
          sku.includes(query) ||
          productSlug.includes(query)
        );
      }
    );
  }, [products, search]);

  const total =
    Number(
      brandData?.total ??
        brandData?.count ??
        0
    ) || 0;

  const totalPages = Math.max(
    1,
    Number(
      brandData?.totalPages ??
        Math.ceil(
          total / PAGE_SIZE
        ) ??
        1
    ) || 1
  );

  const serverPage =
    Number(
      brandData?.page ??
        brandData?.currentPage ??
        currentPage
    ) || currentPage;

  const handlePageChange = (
    pageNumber
  ) => {
    const nextPage =
      Number(pageNumber);

    if (
      !Number.isInteger(nextPage) ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage ||
      brandLoading
    ) {
      return;
    }

    setSearch("");
    setCurrentPage(nextPage);

    if (
      typeof window !== "undefined"
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (
    brandLoading &&
    !brandData
  ) {
    return <BrandPageSkeleton />;
  }

  if (
    brandError &&
    !brandData
  ) {
    return (
      <main className="min-h-screen bg-surface-muted">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
          <div className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PackageOpen className="h-7 w-7 text-primary" />
            </div>

            <h1 className="mt-5 text-2xl font-black uppercase tracking-tight text-text-primary">
              Unable to Load Brand
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-secondary">
              {brandError}
            </p>

            <button
              type="button"
              onClick={() => {
                setCurrentPage(1);
                setBrandError(null);
                setBrandData(null);
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

  if (!brand) {
    return (
      <main className="min-h-screen bg-surface-muted">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-5 py-16">
          <div className="text-center">
            <PackageOpen className="mx-auto h-14 w-14 text-text-secondary" />

            <h1 className="mt-5 text-3xl font-black uppercase text-text-primary">
              Brand Not Found
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              We couldn't find the brand "
              {slug}".
            </p>

            <Link
              href="/brands"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-wide text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Brands
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-muted">

      <section className="relative overflow-hidden border-b border-border bg-surface-muted">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
          <div className="flex items-center gap-2 overflow-hidden text-xs font-bold uppercase tracking-wide text-text-secondary">
            <Link
              href="/"
              className="shrink-0 transition-colors hover:text-primary"
            >
              Home
            </Link>

            <ChevronRight className="h-4 w-4 shrink-0" />

            <Link
              href="/brands"
              className="shrink-0 transition-colors hover:text-primary"
            >
              Brands
            </Link>

            <ChevronRight className="h-4 w-4 shrink-0" />

            <span className="truncate text-primary">
              {displayName}
            </span>
          </div>
        </div>
      </section>

      <OtherBrands
        brands={brands}
        currentSlug={slug}
      />

      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
          <div className="flex flex-col items-center justify-center gap-5 text-center sm:flex-row sm:text-left">
            {/* Logo */}
            <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-sm sm:h-28 sm:w-40">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  alt={displayName}
                  loading="eager"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="px-3 text-center text-sm font-black uppercase text-text-primary">
                  {displayName}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
              {displayName}
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-text-primary sm:text-3xl">
              Products
            </h2>

            <p className="mt-2 text-sm text-text-secondary">
              Showing{" "}
              {filteredProducts.length}{" "}
              of {total} products
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search products..."
              className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-10 text-sm font-medium text-text-primary outline-none transition-all placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
            />

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary transition hover:bg-surface-muted hover:text-primary"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Loading Current Page */}
        {brandLoading &&
          brandData && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-xs font-bold text-text-secondary">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />

              Loading products...
            </div>
          )}

        {/* No Products */}
        {filteredProducts.length === 0 &&
          !brandLoading && (
            <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
                <PackageOpen className="h-7 w-7 text-text-secondary" />
              </div>

              <h2 className="mt-5 text-xl font-black uppercase text-text-primary">
                {search
                  ? "No Products Found"
                  : "No Products Available"}
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                {search
                  ? `No products match "${search}".`
                  : `There are currently no products available from ${displayName}.`}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="mt-6 rounded-xl bg-primary px-6 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {/* Products Grid */}
        {filteredProducts.length > 0 && (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-secondary">
                Page {serverPage} of{" "}
                {totalPages}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="text-xs font-black uppercase tracking-wide text-primary hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {filteredProducts.map(
                (product, index) => (
                  <ProductCard
                    key={
                      product?.id ||
                      product?._id ||
                      product?.slug ||
                      `product-${index}`
                    }
                    product={product}
                  />
                )
              )}
            </div>

            <Pagination
              currentPage={serverPage}
              totalPages={totalPages}
              onPageChange={
                handlePageChange
              }
              loading={brandLoading}
            />
          </>
        )}
      </section>
    </main>
  );
}
