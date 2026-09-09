"use client";

import { use, useEffect, useState } from "react";
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
import { getProductFilter } from "@/redux/features/product/productAction";
import { getCategoryBySlug } from "@/apiService/api";
import ProductCard from "@/components/products/ProductCard";

const PAGE_SIZE = 12;

const createSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeCategoryResponse = (response) => {
  if (!response) {
    return null;
  }

  const source =
    response?.data?.category ||
    response?.category ||
    response?.data ||
    response;

  if (!source || typeof source !== "object") {
    return null;
  }

  const category = Array.isArray(source)
    ? source[0]
    : Array.isArray(source?.categories)
      ? source.categories[0]
      : source;

  if (!category || typeof category !== "object") {
    return null;
  }

  const categorySlug =
    category?.slug ||
    createSlug(
      category?.name ||
        category?.title ||
        category?.categoryName
    );

  return {
    id:
      category?.id ??
      category?.categoryId ??
      category?._id ??
      null,
    title:
      category?.name ||
      category?.title ||
      category?.categoryName ||
      "Unnamed Category",
    description:
      category?.description ||
      category?.shortDescription ||
      "",
    slug: categorySlug,
    image:
      category?.image ||
      category?.featuredimg ||
      category?.featuredImage ||
      category?.thumbnail ||
      null,
    children: Array.isArray(category?.children)
      ? category.children
      : [],
    productCount:
      category?.productCount ??
      category?.productsCount ??
      category?.count ??
      null,
  };
};

const normalizeCategories = (source) => {
  const apiCategories = Array.isArray(source)
    ? source
    : Array.isArray(source?.categories)
      ? source.categories
      : Array.isArray(source?.data)
        ? source.data
        : Array.isArray(source?.data?.categories)
          ? source.data.categories
          : [];

  return apiCategories
    .filter(Boolean)
    .map((category) => {
      const slug =
        category?.slug ||
        createSlug(
          category?.name ||
            category?.title ||
            category?.categoryName
        );

      return {
        id:
          category?.id ??
          category?.categoryId ??
          category?._id ??
          null,
        title:
          category?.name ||
          category?.title ||
          category?.categoryName ||
          "Unnamed Category",
        description:
          category?.description ||
          category?.shortDescription ||
          "",
        slug,
        image:
          category?.image ||
          category?.featuredimg ||
          category?.featuredImage ||
          category?.thumbnail ||
          null,
        productCount:
          category?.productCount ??
          category?.productsCount ??
          category?.count ??
          null,
      };
    })
    .filter((category) => category.slug);
};

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 1) {
    return [];
  }

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
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

  const sortedPages = [...pages]
    .filter(
      (page) => page >= 1 && page <= totalPages
    )
    .sort((a, b) => a - b);

  const result = [];

  sortedPages.forEach((page, index) => {
    if (index > 0) {
      const previous = sortedPages[index - 1];

      if (page - previous > 1) {
        result.push("ellipsis-" + page);
      }
    }

    result.push(page);
  });

  return result;
};

export default function ProductDetailsCategory({ initialCategory = null,initialSlug = "",}) {
  const slug = initialSlug;

  const dispatch = useDispatch();

  const [categoryData, setCategoryData] =
    useState(initialCategory);

  const [categoryApiLoading, setCategoryApiLoading] =
    useState(!initialCategory);

  const [categoryApiError, setCategoryApiError] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const productAdState = useSelector(
    (state) => state.productAd
  );

  const productState = useSelector(
    (state) => state.products
  );

  const {
    productCateogry,
    productCategory,
    loading: adsLoading,
    loaded: adsLoaded,
  } = productAdState || {};

  const {
    productList,
    loading: productLoading,
    error: productError,
  } = productState || {};

  /*
   * Load product ads/categories.
   */
  useEffect(() => {
    if (!adsLoaded && !adsLoading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, adsLoaded, adsLoading]);

  /*
   * Category data:
   *
   * 1. Use server-provided category first.
   * 2. Only call the API from the client when
   *    the server did not provide category data.
   *
   * This prevents an unnecessary duplicate request
   * on the normal page load.
   */
  useEffect(() => {
    if (initialCategory) {
      setCategoryData(initialCategory);
      setCategoryApiLoading(false);
      setCategoryApiError(null);

      return;
    }

    if (!slug) {
      setCategoryData(null);
      setCategoryApiLoading(false);
      setCategoryApiError(
        "Category slug is missing."
      );

      return;
    }

    let active = true;

    const loadCategory = async () => {
      try {
        setCategoryApiLoading(true);
        setCategoryApiError(null);

        const response =
          await getCategoryBySlug(slug);

        if (!active) {
          return;
        }

        const normalized =
          normalizeCategoryResponse(response);

        if (!normalized) {
          setCategoryData(null);
          setCategoryApiError(
            "Category not found."
          );

          return;
        }

        setCategoryData(normalized);
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "getCategoryBySlug:",
          error
        );

        setCategoryData(null);

        setCategoryApiError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load category"
        );
      } finally {
        if (active) {
          setCategoryApiLoading(false);
        }
      }
    };

    loadCategory();

    return () => {
      active = false;
    };
  }, [slug, initialCategory]);

  /*
   * Categories available from Redux.
   */
  const categories = normalizeCategories(
    productCateogry ?? productCategory
  );

  /*
   * Normalize current slug for comparisons.
   */
  const normalizedSlug = String(slug || "")
    .toLowerCase()
    .trim();

  /*
   * Fallback category from Redux.
   */
  const fallbackCategory =
    slug && categories.length > 0
      ? categories.find(
          (item) =>
            String(item.slug).toLowerCase() ===
            normalizedSlug
        ) || null
      : null;

  /*
   * Server category has priority.
   * Redux category is only the fallback.
   */
  const category =
    categoryData || fallbackCategory;

  /*
   * Resolve category ID.
   */
  const categoryId =
    category?.id ??
    categoryData?.categoryId ??
    categoryData?._id ??
    null;

  /*
   * Reset pagination whenever the category changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  /*
   * Load products for the selected category.
   */
  useEffect(() => {
    if (!categoryId) {
      return;
    }

    dispatch(
      getProductFilter(
        {
          categoryId,
        },
        currentPage,
        PAGE_SIZE
      )
    );
  }, [
    dispatch,
    categoryId,
    currentPage,
  ]);

  /*
   * Normalize products from different API response shapes.
   */
  let products = [];

  if (Array.isArray(productList)) {
    products = productList;
  } else if (
    Array.isArray(productList?.products)
  ) {
    products = productList.products;
  } else if (
    Array.isArray(productList?.data)
  ) {
    products = productList.data;
  } else if (
    Array.isArray(
      productList?.data?.products
    )
  ) {
    products =
      productList.data.products;
  }

  /*
   * Calculate total product count.
   */
  const totalProducts =
    productList?.total ??
    productList?.count ??
    productList?.totalProducts ??
    category?.productCount ??
    products.length;

  /*
   * Calculate total pages.
   */
  const totalPages =
    Number(productList?.totalPages) ||
    Math.ceil(
      Number(totalProducts) / PAGE_SIZE
    ) ||
    1;

  /*
   * Current page returned by the API.
   */
  const serverPage =
    productList?.page ??
    currentPage;

  /*
   * Other categories.
   *
   * Kept here in case this list is used elsewhere
   * in the component/UI.
   */
  const otherCategories =
    categories.filter(
      (item) =>
        item.slug &&
        String(item.slug).toLowerCase() !==
          normalizedSlug
    );

  /*
   * Pagination buttons.
   */
  const pageNumbers = getPageNumbers(
    Number(serverPage) || currentPage,
    Number(totalPages) || 1
  );

  /*
   * Handle pagination.
   */
  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > Number(totalPages) ||
      page === currentPage ||
      productLoading
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Category loading state.
   */
  if (
    categoryApiLoading &&
    !category
  ) {
    return (
      <main className="min-h-screen bg-surface-muted px-5 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-8 w-48 animate-pulse rounded bg-border" />

          <div className="mt-8 h-[260px] animate-pulse rounded-2xl bg-card" />

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <div
                key={index}
                className="h-[320px] animate-pulse rounded-2xl bg-card"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /*
   * Category not found.
   */
  if (
    !categoryApiLoading &&
    !category &&
    (
      categoryApiError ||
      categories.length === 0
    )
  ) {
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
            The category you are looking for does not
            exist or is no longer available.
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

  /*
   * Main category page.
   */
  return (
    <main className="min-h-screen bg-surface-muted">
      {/* Category Hero */}
      <section className="relative overflow-hidden border-b border-border bg-black">
        {category?.image && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: `url(${category.image})`,
            }}
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

      {/* Products */}
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

            <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Product Loading */}
        {productLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {Array.from({
              length: PAGE_SIZE,
            }).map((_, index) => (
              <div
                key={index}
                className="h-[330px] animate-pulse rounded-2xl border border-border bg-card"
              />
            ))}
          </div>
        )}

        {/* Product Error */}
        {!productLoading &&
          productError && (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Package className="mx-auto h-10 w-10 text-primary" />

              <h3 className="mt-4 text-lg font-black uppercase text-text-primary">
                Unable to Load Products
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                Please try again later.
              </p>
            </div>
          )}

        {/* No Products */}
        {!productLoading &&
          !productError &&
          products.length === 0 && (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Search className="mx-auto h-10 w-10 text-text-secondary" />

              <h3 className="mt-4 text-lg font-black uppercase text-text-primary">
                No Products Found
              </h3>

              <p className="mt-2 text-sm text-text-secondary">
                There are currently no products available
                in this category.
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

        {/* Product Grid */}
        {!productLoading &&
          !productError &&
          products.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                {products.map(
                  (product, index) => (
                    <ProductCard
                      key={
                        product?.id ??
                        product?._id ??
                        product?.slug ??
                        index
                      }
                      product={product}
                    />
                  )
                )}
              </div>

              {/* Pagination */}
              {Number(totalPages) > 1 && (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage <= 1 ||
                      productLoading
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-primary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {pageNumbers.map(
                    (page) => {
                      if (
                        typeof page !==
                        "number"
                      ) {
                        return (
                          <span
                            key={page}
                            className="flex h-10 w-10 items-center justify-center text-sm font-bold text-text-secondary"
                          >
                            ...
                          </span>
                        );
                      }

                      const active =
                        page ===
                        currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              page
                            )
                          }
                          disabled={
                            productLoading
                          }
                          className={`flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-black transition ${
                            active
                              ? "bg-primary text-white"
                              : "border border-border bg-card text-text-primary hover:border-primary hover:text-primary"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage >=
                        Number(
                          totalPages
                        ) ||
                      productLoading
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-text-primary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Page Indicator */}
              {Number(totalPages) > 1 && (
                <div className="mt-4 text-center text-xs font-bold uppercase tracking-wide text-text-secondary">
                  Page {currentPage} of{" "}
                  {totalPages}
                </div>
              )}
            </>
          )}
      </section>
    </main>
  );
}
