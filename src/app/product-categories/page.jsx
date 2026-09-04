"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight, Search } from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";

function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CategoryCard({ category }) {
  return (
    <Link
      href={
        category.slug
          ? `/product-categories/${encodeURIComponent(category.slug)}`
          : "/product-categories"
      }
      className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-black p-5 shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-[0_18px_40px_rgba(229,35,35,0.12)] sm:min-h-[280px] sm:p-7"
    >
      {category.image ? (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{
            backgroundImage: `url(${category.image})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 transition-all duration-500 group-hover:from-black/85 group-hover:via-black/45" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />

      <div className="relative z-10">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black uppercase leading-tight tracking-tight text-white transition-colors duration-300 group-hover:text-primary sm:text-2xl">
              {category.title}
            </h2>

            {category.description && (
              <p className="mt-2 line-clamp-3 max-w-md text-xs leading-5 text-white/75 sm:text-sm">
                {category.description}
              </p>
            )}

            {category.productCount !== undefined &&
              category.productCount !== null && (
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60 sm:text-xs">
                  {category.productCount} Products
                </p>
              )}
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 text-white/80 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:h-11 sm:w-11">
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:h-5 sm:w-5" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}

export default function ProductCategoriesPage() {
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const productAdState = useSelector(
    (state) => state.productAd
  );

  const {
    productCateogry,
    loading,
    loaded,
    error,
  } = productAdState || {};

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, loaded, loading]);

  const categories = useMemo(() => {
    const source = productCateogry;

    let apiCategories = [];

    if (Array.isArray(source)) {
      apiCategories = source;
    } else if (Array.isArray(source?.categories)) {
      apiCategories = source.categories;
    } else if (Array.isArray(source?.data)) {
      apiCategories = source.data;
    } else if (Array.isArray(source?.data?.categories)) {
      apiCategories = source.data.categories;
    }

    return apiCategories
      .filter(Boolean)
      .map((category, index) => {
        const name =
          category?.name ||
          category?.title ||
          category?.categoryName ||
          "Unnamed Category";

        const slug =
          category?.slug ||
          createSlug(name);

        return {
          id:
            category?.id ||
            category?.categoryId ||
            category?._id ||
            slug ||
            index,
          title: name,
          slug,
          description:
            category?.description ||
            category?.shortDescription ||
            "",
          image:
            category?.image ||
            category?.featuredimg ||
            category?.featuredImage ||
            category?.thumbnail ||
            category?.imageUrl ||
            null,
          productCount:
            category?.productCount ??
            category?.productsCount ??
            category?.count ??
            null,
        };
      });
  }, [productCateogry]);

  const filteredCategories = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.title
          .toLowerCase()
          .includes(value) ||
        category.description
          .toLowerCase()
          .includes(value)
      );
    });
  }, [categories, search]);

  return (
    <main className="min-h-screen bg-surface-muted py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <section className="mb-10 sm:mb-14">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-8 bg-primary" />

            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
              Explore Our Collection
            </p>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.04em] text-text-primary sm:text-5xl lg:text-6xl">
                Product Categories
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
                Explore our complete range of sports nutrition,
                wellness, and performance products organized by
                category.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />

              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                placeholder="Search categories..."
                className="h-12 w-full rounded-xl border border-border bg-card pl-11 pr-4 text-sm font-medium text-text-primary outline-none transition-all placeholder:text-text-secondary focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </div>
          </div>
        </section>

        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="min-h-[220px] animate-pulse rounded-2xl border border-border bg-card sm:min-h-[280px]"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-xl font-black uppercase text-text-primary">
              Unable to Load Categories
            </h2>

            <p className="mt-3 text-sm text-text-secondary">
              Something went wrong while loading the product
              categories.
            </p>

            <button
              type="button"
              onClick={() => {
                dispatch(getAllProductAds());
              }}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredCategories.length === 0 && (
            <div className="rounded-2xl border border-border bg-card px-6 py-16 text-center">
              <h2 className="text-xl font-black uppercase text-text-primary">
                No Categories Found
              </h2>

              <p className="mt-3 text-sm text-text-secondary">
                {search
                  ? `No category matches "${search}".`
                  : "There are currently no product categories available."}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                  }}
                  className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-black uppercase tracking-wide text-white"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

        {!loading &&
          !error &&
          filteredCategories.length > 0 && (
            <>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-secondary">
                  {filteredCategories.length}{" "}
                  {filteredCategories.length === 1
                    ? "Category"
                    : "Categories"}
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                    }}
                    className="text-xs font-black uppercase tracking-wide text-primary hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                  />
                ))}
              </div>
            </>
          )}
      </div>
    </main>
  );
}