"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight } from "lucide-react";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";

function CategoryCard({ category }) {
  return (
    <Link
      href={category.href}
      className="
        group
        relative
        flex
        h-[165px]
        flex-col
        justify-end
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-card
        p-4

        sm:h-[190px]
        sm:rounded-2xl
        sm:p-5

        lg:h-[210px]
        lg:p-6
      "
    >
      {category.image ? (
        <div
          className="
            absolute
            inset-0
            bg-cover
            bg-center
          "
          style={{
            backgroundImage: `url(${category.image})`,
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-card" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5" />

      <div className="relative z-10">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="
                line-clamp-2
                text-sm
                font-black
                uppercase
                leading-tight
                tracking-tight
                text-white

                sm:text-base

                lg:text-lg
              "
            >
              {category.title}
            </h3>

            {/* {category.description && (
              <p
                className="
                  mt-1
                  line-clamp-2
                  text-[10px]
                  leading-4
                  text-white/70

                  sm:mt-2
                  sm:text-xs
                  sm:leading-5
                "
              >
                {category.description}
              </p>
            )} */}
          </div>

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-white/30
              bg-black/20
              text-white

              sm:h-9
              sm:w-9
            "
          >
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-primary" />
    </Link>
  );
}

export default function ShopByCategory() {
  const dispatch = useDispatch();

  const {
    productCateogry,
    loading,
    loaded,
    error,
  } = useSelector(
    (state) => state.productAd || {}
  );

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, loaded, loading]);

  const categories = useMemo(() => {
    const apiCategories = Array.isArray(productCateogry)
      ? productCateogry
      : Array.isArray(productCateogry?.categories)
      ? productCateogry.categories
      : Array.isArray(productCateogry?.data)
      ? productCateogry.data
      : Array.isArray(productCateogry?.data?.categories)
      ? productCateogry.data.categories
      : [];

    return apiCategories
      .filter(Boolean)
      .map((category) => {
        const slug =
          category?.slug ||
          category?.name
            ?.toLowerCase()
            ?.trim()
            ?.replace(/[^a-z0-9]+/g, "-")
            ?.replace(/^-+|-+$/g, "");

        return {
          id:
            category?.id ||
            slug ||
            Math.random(),
          title:
            category?.name ||
            category?.title ||
            "Unnamed Category",
          description:
            category?.description || "",
          slug: slug || "",
          href: `/product-categories/${slug}`,
          image:
            category?.image ||
            category?.featuredimg ||
            category?.featuredImage ||
            category?.thumbnail ||
            null,
          children:
            category?.children || [],
        };
      });
  }, [productCateogry]);

  return (
    <section className="relative overflow-hidden bg-surface-muted py-8 sm:py-12 lg:py-14">
      <div className="pointer-events-none absolute -left-40 top-10 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <div className="mb-7 flex items-end justify-between gap-5 sm:mb-9">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />

              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary sm:text-xs">
                Find what you need
              </p>
            </div>

            <h2
              className="
                text-3xl
                font-black
                uppercase
                leading-none
                tracking-[-0.03em]
                text-text-primary

                sm:text-4xl

                lg:text-5xl
              "
            >
              Category
            </h2>
          </div>

          <Link
            href="/products"
            className="
              group
              hidden
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-text-primary
              px-4
              py-2.5
              text-[10px]
              font-black
              uppercase
              tracking-wide
              text-text-primary

              sm:inline-flex
            "
          >
            View All

            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {loading && (
          <div
            className="
              grid
              grid-cols-2
              gap-3

              sm:grid-cols-3
              sm:gap-4

              lg:grid-cols-4
              lg:gap-5
            "
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={`
                  h-[165px]
                  animate-pulse
                  rounded-xl
                  border
                  border-border
                  bg-card

                  sm:h-[190px]
                  sm:rounded-2xl

                  lg:h-[210px]

                  ${index >= 4 ? "hidden sm:block" : ""}
                  ${index >= 6 ? "sm:hidden lg:block" : ""}
                `}
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-border bg-card px-5 py-6 text-center">
            <p className="text-sm text-text-secondary">
              Unable to load categories right now.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          categories.length === 0 && (
            <div className="rounded-xl border border-border bg-card px-5 py-6 text-center">
              <p className="text-sm text-text-secondary">
                No categories available right now.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          categories.length > 0 && (
            <div
              className="
                grid
                grid-cols-2
                gap-3

                sm:grid-cols-3
                sm:gap-4

                lg:grid-cols-4
                lg:gap-5
              "
            >
              {categories.map((category, index) => {
                const hiddenOnMobile =
                  index >= 4;

                const hiddenOnTablet =
                  index >= 6;

                const hiddenOnDesktop =
                  index >= 8;

                return (
                  <div
                    key={category.id}
                    className={`
                      ${hiddenOnMobile ? "hidden sm:block" : ""}
                      ${
                        hiddenOnTablet
                          ? "sm:hidden lg:block"
                          : ""
                      }
                      ${
                        hiddenOnDesktop
                          ? "lg:hidden"
                          : ""
                      }
                    `}
                  >
                    <CategoryCard
                      category={category}
                    />
                  </div>
                );
              })}
            </div>
          )}

        <div className="mt-6 sm:hidden">
          <Link
            href="/product-categories"
            className="
              inline-flex
              items-center
              gap-2
              text-xs
              font-black
              uppercase
              tracking-wide
              text-text-primary
            "
          >
            <span className="border-b-2 border-primary pb-1">
              View All Categories
            </span>

            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}