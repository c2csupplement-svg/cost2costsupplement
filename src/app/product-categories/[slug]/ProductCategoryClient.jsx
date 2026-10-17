"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
} from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";
import { getCategoryBySlug } from "@/apiService/api";
import ProductCard from "@/components/products/ProductCard";

const PAGE_SIZE = 20;

const createSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategory = (category) => {
  if (!category || typeof category !== "object") return null;

  const slug =
    category?.slug ||
    createSlug(category?.name || category?.title || category?.categoryName);

  return {
    id: category?.id ?? category?.categoryId ?? category?._id ?? null,
    title:
      category?.name ||
      category?.title ||
      category?.categoryName ||
      "Unnamed Category",
    description: category?.description || category?.shortDescription || "",
    slug,
    image:
      category?.image ||
      category?.featuredimg ||
      category?.featuredImage ||
      category?.thumbnail ||
      null,
    children: Array.isArray(category?.children) ? category.children : [],
    productCount:
      category?.productCount ??
      category?.productsCount ??
      category?.count ??
      null,
  };
};

const normalizeCategoryResponse = (response) =>
  normalizeCategory(response?.category || response?.data?.category || null);

const normalizeCategories = (source) => {
  const list = Array.isArray(source)
    ? source
    : Array.isArray(source?.categories)
      ? source.categories
      : Array.isArray(source?.data)
        ? source.data
        : Array.isArray(source?.data?.categories)
          ? source.data.categories
          : [];

  return list
    .filter(Boolean)
    .map(normalizeCategory)
    .filter((c) => c?.slug);
};

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 1) return [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push(`ellipsis-${page}`);
    }
    result.push(page);
  });

  return result;
};

const readPagination = (response) => ({
  count: Number(response?.count) || 0,
  total: Number(response?.total) || 0,
  page: Number(response?.page) || 1,
  totalPages: Number(response?.totalPages) || 1,
});

export default function ProductDetailsCategory({
  initialCategory = null,
  initialSlug = "",
}) {
  const slug = initialSlug;
  const dispatch = useDispatch();

  const cacheRef = useRef(new Map());

  const [categoryData, setCategoryData] = useState(
    normalizeCategory(initialCategory?.category)
  );
  const [products, setProducts] = useState(
    Array.isArray(initialCategory?.products) ? initialCategory.products : []
  );
  const [pagination, setPagination] = useState(
    initialCategory
      ? readPagination(initialCategory)
      : { count: 0, total: 0, page: 1, totalPages: 1 }
  );
  const [currentPage, setCurrentPage] = useState(
    Number(initialCategory?.page) || 1
  );
  const [loading, setLoading] = useState(!initialCategory);
  const [error, setError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  const productAdState = useSelector((state) => state.productAd);
  const {
    productCateogry,
    productCategory,
    loading: adsLoading,
    loaded: adsLoaded,
  } = productAdState || {};

  useEffect(() => {
    if (!adsLoaded && !adsLoading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, adsLoaded, adsLoading]);

  const applyResponse = useCallback((response) => {
    const category = normalizeCategoryResponse(response);
    if (category) setCategoryData(category);

    setProducts(Array.isArray(response?.products) ? response.products : []);
    setPagination(readPagination(response));
  }, []);

  useEffect(() => {
    cacheRef.current = new Map();

    if (initialCategory) {
      const page = Number(initialCategory?.page) || 1;
      cacheRef.current.set(page, initialCategory);
      applyResponse(initialCategory);
      setCurrentPage(page);
      setLoading(false);
      setError(null);
    } else {
      setCurrentPage(1);
    }
  }, [slug, initialCategory, applyResponse]);

  useEffect(() => {
    if (!slug) {
      setCategoryData(null);
      setProducts([]);
      setLoading(false);
      setError("Category slug is missing.");
      return;
    }

    const cached = cacheRef.current.get(currentPage);
    if (cached) {
      applyResponse(cached);
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCategoryBySlug(slug, currentPage, PAGE_SIZE);
        if (!active) return;

        if (!normalizeCategoryResponse(response)) {
          setCategoryData(null);
          setProducts([]);
          setError("Category not found.");
          return;
        }

        cacheRef.current.set(currentPage, response);
        applyResponse(response);
      } catch (err) {
        if (!active) return;
        console.error("getCategoryBySlug:", err);
        setProducts([]);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load category"
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [slug, currentPage, retryKey, applyResponse]);

  const categories = normalizeCategories(productCateogry ?? productCategory);
  const normalizedSlug = String(slug || "").toLowerCase().trim();

  const fallbackCategory =
    slug && categories.length > 0
      ? categories.find(
          (item) => String(item.slug).toLowerCase() === normalizedSlug
        ) || null
      : null;

  const category = categoryData || fallbackCategory;

  const totalProducts = pagination.total || products.length;
  const totalPages = Math.max(1, pagination.totalPages);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage || loading) {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && !category) {
    return (
      <main className="min-h-screen bg-surface-muted px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-8 w-48 animate-pulse rounded bg-border" />
          <div className="mt-8 h-[260px] animate-pulse rounded-2xl bg-card" />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[320px] animate-pulse rounded-2xl bg-card"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!loading && !category) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted px-5">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Package className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-2xl font-black uppercase tracking-tight text-text-primary">
            Category Not Found
          </h1>

          <p className="mt-3 text-sm leading-6 text-text-secondary">
            The category you are looking for does not exist or is no longer
            available.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            View All Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-muted">
      <section className="relative overflow-hidden border-b border-border bg-black">
        {category?.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${category.image})` }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />

        <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
          <Link
            href="/products"
            className="mb-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-white/70 transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-[2px] w-10 bg-primary" />
              <span className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                Product Category
              </span>
            </div>

            <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
              {category?.title}
            </h1>

            {category?.description && (
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {category.description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {totalProducts} Products
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                Explore Products
              </p>
            </div>

            <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-text-primary sm:text-4xl">
              {category?.title} Products
            </h2>
          </div>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-wide text-text-primary"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[330px] animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <Package className="mx-auto h-10 w-10 text-primary" />

            <h3 className="mt-4 text-lg font-black uppercase text-text-primary">
              Unable to Load Products
            </h3>

            <p className="mt-2 text-sm text-text-secondary">{error}</p>

            <button
              type="button"
              onClick={() => setRetryKey((k) => k + 1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <Search className="mx-auto h-10 w-10 text-text-secondary" />

            <h3 className="mt-4 text-lg font-black uppercase text-text-primary">
              No Products Found
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              There are currently no products available in this category.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-xs font-black uppercase tracking-wide text-white"
            >
              Browse Products
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product?.id ?? product?._id ?? product?.slug ?? index}
                  product={product}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <>
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || loading}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-primary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {pageNumbers.map((page) => {
                    if (typeof page !== "number") {
                      return (
                        <span
                          key={page}
                          className="flex h-10 w-10 items-center justify-center text-sm font-bold text-text-secondary"
                        >
                          ...
                        </span>
                      );
                    }

                    const active = page === currentPage;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => handlePageChange(page)}
                        disabled={loading}
                        aria-current={active ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-black transition ${
                          active
                            ? "bg-primary text-white"
                            : "border border-border bg-card text-text-primary hover:border-primary hover:text-primary"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || loading}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-primary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Page {currentPage} of {totalPages}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </main>
  );
}