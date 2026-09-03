"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Filter,
  ListFilter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

import {
  useGetProductsQuery,
  useGetSearchProductsQuery,
  useGetBrandsQuery,
} from "@/services/productsApi";

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlSearchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] =
    useState("All Products");

  const [selectedBrand, setSelectedBrand] =
    useState("All Brands");

  const [sortBy, setSortBy] = useState("Featured");

  const [searchQuery, setSearchQuery] =
    useState(urlSearchQuery);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // =====================================================
  // SEARCH MODE
  // =====================================================

  const shouldSearch =
    urlSearchQuery.trim().length > 0;

  // =====================================================
  // NORMAL PRODUCTS API
  // =====================================================

  const {
    data: normalProductsData,
    isLoading: isNormalProductsLoading,
    isFetching: isNormalProductsFetching,
    isError: isNormalProductsError,
    error: normalProductsError,
    refetch: refetchNormalProducts,
  } = useGetProductsQuery(currentPage, {
    skip: shouldSearch,
  });

  // =====================================================
  // SEARCH PRODUCTS API
  // =====================================================

  const {
    data: searchProductsData,
    isLoading: isSearchProductsLoading,
    isFetching: isSearchProductsFetching,
    isError: isSearchProductsError,
    error: searchProductsError,
    refetch: refetchSearchProducts,
  } = useGetSearchProductsQuery(
    {
      searchQuery: urlSearchQuery,
      page: currentPage,
    },
    {
      skip: !shouldSearch,
    }
  );

  // =====================================================
  // ACTIVE PRODUCTS API DATA
  // =====================================================

  const productsData = shouldSearch
    ? searchProductsData
    : normalProductsData;

  const isProductsLoading = shouldSearch
    ? isSearchProductsLoading
    : isNormalProductsLoading;

  const isProductsFetching = shouldSearch
    ? isSearchProductsFetching
    : isNormalProductsFetching;

  const isProductsError = shouldSearch
    ? isSearchProductsError
    : isNormalProductsError;

  const productsError = shouldSearch
    ? searchProductsError
    : normalProductsError;

  const refetchProducts = shouldSearch
    ? refetchSearchProducts
    : refetchNormalProducts;

  // =====================================================
  // BRANDS API
  // =====================================================

  const {
    data: brandsData,
    isLoading: isBrandsLoading,
    isError: isBrandsError,
    error: brandsError,
    refetch: refetchBrands,
  } = useGetBrandsQuery();

  // =====================================================
  // SYNCHRONIZE URL SEARCH WITH INPUT
  // =====================================================

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setCurrentPage(1);
  }, [urlSearchQuery]);

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const isInitialLoading =
    isProductsLoading || isBrandsLoading;

  const isError =
    isProductsError || isBrandsError;

  const error =
    productsError || brandsError;

  const refetch = () => {
    refetchProducts();
    refetchBrands();
  };

  // =====================================================
  // NORMALIZE API PRODUCTS
  // =====================================================

  const products = useMemo(() => {
    const apiProducts = productsData?.products || [];

    return apiProducts.map((product) => {
      const price = Number(product.price) || 0;

      const salePrice =
        product.salePrice !== null &&
        product.salePrice !== undefined
          ? Number(product.salePrice)
          : null;

      const originalPrice =
        salePrice !== null && salePrice < price
          ? price
          : 0;

      const displayPrice =
        salePrice !== null && salePrice > 0
          ? salePrice
          : price;

      const discount =
        originalPrice > 0 &&
        salePrice !== null
          ? Math.round(
              ((originalPrice - salePrice) /
                originalPrice) *
                100
            )
          : 0;

      let images = [];

      if (Array.isArray(product.images)) {
        images = product.images.filter(Boolean);
      } else if (product.images) {
        images = [product.images];
      }

      if (
        product.featuredimg &&
        !images.includes(product.featuredimg)
      ) {
        images.unshift(product.featuredimg);
      }

      return {
        id: product.id,

        slug: product.slug || "",

        name: product.name || "",

        brand: product.brand?.name || "",

        category: product.category?.name || "",

        images,

        price: displayPrice,

        originalPrice,

        discount,

        rating: 0,

        reviewCount:
          product._count?.reviews ||
          product.reviews?.length ||
          0,

        isFeatured:
          product.isFeatured || false,

        isPopular:
          product.isPopular || false,

        isTrending:
          product.isTrending || false,

        isTopRated:
          product.isTopRated || false,

        isRecent:
          product.isRecent || false,

        viewCount:
          Number(product.viewCount) || 0,

        stock:
          Number(product.stock) || 0,

        createdAt: product.createdAt,

        variants:
          product.variants || [],
      };
    });
  }, [productsData]);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return [
      "All Products",
      ...uniqueCategories,
    ];
  }, [products]);

  // =====================================================
  // BRANDS
  // =====================================================

  const brands = useMemo(() => {
    const apiBrands =
      brandsData?.brands || [];

    return [
      {
        id: "all",
        name: "All Brands",
        slug: "all",
        productCount:
          productsData?.total || 0,
      },

      ...apiBrands.map((brand) => ({
        id: brand.id,

        name: brand.name,

        slug: brand.slug,

        logo: brand.logo,

        productCount:
          brand._count?.products || 0,
      })),
    ];
  }, [brandsData, productsData?.total]);

  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY

    if (
      selectedCategory !==
      "All Products"
    ) {
      result = result.filter(
        (product) =>
          product.category ===
          selectedCategory
      );
    }

    // BRAND

    if (
      selectedBrand !==
      "All Brands"
    ) {
      result = result.filter(
        (product) =>
          product.brand === selectedBrand
      );
    }

    // FEATURED

    if (sortBy === "Featured") {
      result.sort(
        (a, b) =>
          Number(b.isFeatured) -
          Number(a.isFeatured)
      );
    }

    // NEWEST

    if (sortBy === "Newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    // PRICE LOW → HIGH

    if (
      sortBy ===
      "Price: Low to High"
    ) {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    // PRICE HIGH → LOW

    if (
      sortBy ===
      "Price: High to Low"
    ) {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    // DISCOUNT

    if (sortBy === "Discount") {
      result.sort(
        (a, b) =>
          b.discount - a.discount
      );
    }

    // RATING

    if (sortBy === "Rating") {
      result.sort(
        (a, b) =>
          b.rating - a.rating
      );
    }

    return result;
  }, [
    products,
    selectedCategory,
    selectedBrand,
    sortBy,
  ]);

  // =====================================================
  // BACKEND PAGINATION
  // =====================================================

  const totalPages =
    productsData?.totalPages || 1;

  const totalProducts =
    productsData?.total || 0;

  // =====================================================
  // SEARCH HANDLER
  // =====================================================

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchQuery.trim();

    setCurrentPage(1);

    if (query) {
      router.push(
        `/shop?search=${encodeURIComponent(query)}`
      );
    } else {
      router.push("/shop");
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/shop");
  };

  // =====================================================
  // FILTER HANDLERS
  // =====================================================

  const clearAllFilters = () => {
    setSelectedCategory("All Products");

    setSelectedBrand("All Brands");

    setSortBy("Featured");

    setCurrentPage(1);

    router.push("/shop");
  };

  const hasActiveFilters =
    selectedCategory !== "All Products" ||
    selectedBrand !== "All Brands" ||
    shouldSearch;

  // =====================================================
  // PAGE CHANGE
  // =====================================================

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CLOSE MOBILE FILTER ON PAGE CHANGE
  // =====================================================

  useEffect(() => {
    setMobileFiltersOpen(false);
  }, [currentPage]);

  return (
    <section className="min-h-screen bg-[#FAFAFA]">
      {/* BREADCRUMB */}

      <div className="border-b border-[#E5E5E5]">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em]">
            <span className="text-[#E52323]">
              Home
            </span>

            <ChevronRight className="h-3.5 w-3.5 text-[#A3A3A3]" />

            <span className="text-[#525252]">
              Shop
            </span>
          </div>
        </div>
      </div>

      {/* HEADER */}

      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-10 sm:px-8 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#E52323]">
            C2C Supplement Store
          </p>

          <h1 className="text-4xl font-black uppercase tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
            Shop Supplements
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252] sm:text-base">
            Discover premium sports nutrition,
            supplements, vitamins and wellness
            products from trusted brands.
          </p>
        </div>
      </div>

      {/* CATEGORY BAR */}

      <div className="border-y border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-[1440px] overflow-x-auto px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-max items-center gap-2 py-4">
            {categories.map((category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                    active
                      ? "border-[#E52323] bg-[#E52323] text-white"
                      : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323] hover:text-[#E52323]"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        {/* TOP CONTROLS */}

        <div className="mb-7 flex flex-col gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[#737373]">
                Showing{" "}

                <span className="font-semibold text-[#111111]">
                  {filteredProducts.length}
                </span>{" "}

                of{" "}

                <span className="font-semibold text-[#111111]">
                  {totalProducts}
                </span>{" "}

                products
              </p>

              {hasActiveFilters && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selectedCategory !==
                    "All Products" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(
                          "All Products"
                        );
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-primary"
                    >
                      {selectedCategory}

                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {selectedBrand !==
                    "All Brands" && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand(
                          "All Brands"
                        );
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs"
                    >
                      {selectedBrand}

                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {shouldSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-primary"
                    >
                      "{urlSearchQuery}"

                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* SEARCH */}

            <form
              onSubmit={handleSearch}
              className="relative w-full lg:max-w-xs"
            >
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search products, brands..."
                className="h-11 w-full rounded-md border border-[#D4D4D4] bg-white pl-10 pr-9 text-sm text-[#111111] placeholder:text-[#737373] outline-none focus:border-[#E52323]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* FILTER + SORT */}

          <div className="flex items-center gap-3 overflow-x-auto lg:justify-end">
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(true)
              }
              className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#D4D4D4] bg-white px-4 text-sm font-medium text-[#111111] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />

              Filters
            </button>

            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="h-11 appearance-none rounded-md border border-[#D4D4D4] bg-white pl-4 pr-10 text-sm text-[#111111] outline-none focus:border-[#E52323]"
              >
                <option>Featured</option>
                <option>Newest</option>
                <option>Rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Discount</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* PRODUCTS + SIDEBAR */}

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </aside>

          <div>
            {isInitialLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[360px] animate-pulse rounded-xl border border-[#E5E5E5] bg-white"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 text-center">
                <h3 className="text-xl font-bold">
                  Unable to load products
                </h3>

                <p className="mt-2 text-sm text-[#737373]">
                  {error?.data?.message ||
                    error?.message ||
                    "Something went wrong."}
                </p>

                <button
                  type="button"
                  onClick={refetch}
                  className="mt-5 rounded-md bg-[#E52323] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="relative">
                {isProductsFetching && (
                  <div className="absolute inset-0 z-20 flex items-start justify-center bg-white/40 pt-10 backdrop-blur-[1px]">
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111111] shadow">
                      Loading products...
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 text-center">
                <Filter className="mb-4 h-8 w-8 text-[#A3A3A3]" />

                <h3 className="text-xl font-bold text-black">
                  No products found
                </h3>

                {shouldSearch && (
                  <p className="mt-2 text-sm text-[#737373]">
                    No products found for "
                    {urlSearchQuery}".
                  </p>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-5 rounded-md bg-[#E52323] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}

        {!isInitialLoading &&
          !isError &&
          totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#E5E5E5] pt-8">
              <button
                type="button"
                onClick={() =>
                  goToPage(currentPage - 1)
                }
                disabled={
                  currentPage === 1 ||
                  isProductsFetching
                }
                className="flex h-10 items-center justify-center rounded-md border border-[#D4D4D4] bg-white px-4 text-sm text-[#111111] disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    goToPage(page)
                  }
                  disabled={isProductsFetching}
                  className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold ${
                    currentPage === page
                      ? "border-[#E52323] bg-[#E52323] text-white"
                      : "border-[#D4D4D4] bg-white text-primary"
                  } disabled:opacity-40`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  goToPage(currentPage + 1)
                }
                disabled={
                  currentPage === totalPages ||
                  isProductsFetching
                }
                className="flex h-10 items-center justify-center rounded-md border border-[#D4D4D4] bg-white px-4 text-sm text-[#111111] disabled:opacity-40"
              >
                Next

                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}
      </div>

      {/* MOBILE FILTER DRAWER */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-black/70"
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto border-l border-[#E5E5E5] bg-white p-5 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#E52323]">
                  Shop
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedBrand={selectedBrand}
              setSelectedBrand={setSelectedBrand}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function FilterSidebar({
  categories,
  brands,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex items-center gap-2">
        <ListFilter className="h-4 w-4 text-[#E52323]" />

        <h2 className="text-sm font-bold uppercase tracking-[0.12em]">
          Filters
        </h2>
      </div>

      {/* CATEGORIES */}

      <div className="border-b border-[#E5E5E5] pb-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#AAAAAA]">
          Categories
        </h3>

        <div className="space-y-2">
          {categories.slice(1).map(
            (category) => {
              const active =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#E52323]/10 text-[#E52323]"
                      : "text-[#525252] hover:bg-[#F5F5F5] hover:text-[#E52323]"
                  }`}
                >
                  <span>{category}</span>

                  {active && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* BRANDS */}

      <div className="pt-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#AAAAAA]">
          Brands
        </h3>

        <div className="space-y-2">
          {brands.map((brand) => {
            const active =
              selectedBrand === brand.name;

            return (
              <button
                key={brand.id}
                type="button"
                onClick={() =>
                  setSelectedBrand(
                    brand.name
                  )
                }
                className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-sm text-[#525252] transition hover:text-[#E52323]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      active
                        ? "border-[#E52323] bg-[#E52323]"
                        : "border-[#A3A3A3]"
                    }`}
                  >
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>

                  <span>
                    {brand.name}
                  </span>
                </div>

                {brand.productCount > 0 && (
                  <span className="text-xs text-[#A3A3A3]">
                    {brand.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CLEAR FILTERS */}

      <button
        type="button"
        onClick={() => {
          setSelectedCategory(
            "All Products"
          );

          setSelectedBrand(
            "All Brands"
          );
        }}
        className="mt-7 w-full rounded-md border border-[#333333] py-2.5 text-xs font-semibold uppercase tracking-wide text-[#737373] transition hover:border-[#E52323] hover:text-[#E52323]"
      >
        Clear All Filters
      </button>
    </div>
  );
}