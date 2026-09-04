"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

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
  getProduct,
  getProductFilter,
} from "@/redux/features/product/productAction";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";
import { getProductSearchApi } from "@/apiService/api"

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const urlSearchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    name: "All Products",
  });

  const [selectedBrand, setSelectedBrand] = useState({
    id: null,
    name: "All Brands",
  });

  const [sortBy, setSortBy] = useState("Featured");

  const [searchQuery, setSearchQuery] =
    useState(urlSearchQuery);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [searchProducts, setSearchProducts] = useState([]);
  const [searchMeta, setSearchMeta] = useState({
    total: 0,
    count: 0,
    totalPages: 1,
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const pageSize = 20;

  const productState = useSelector(
    (state) => state.products || {}
  );

  const productAdState = useSelector(
    (state) => state.productAd || {}
  );

  const productData =
    productState.productList ??
    productState.products ??
    productState.product ??
    productState.data ??
    productState;

  const productLoading = Boolean(
    productState.loading
  );

  const productError =
    productState.error || null;

  const adsLoading = Boolean(
    productAdState.loading
  );

  const adsLoaded = Boolean(
    productAdState.loaded
  );

  const adsError =
    productAdState.error || null;

  const productCategory =
    productAdState.productCateogry ??
    productAdState.productCategory ??
    null;

  const productBrands =
    productAdState.brands ?? null;

  const allProducts = useMemo(() => {
    if (urlSearchQuery.trim()) {
      return searchProducts;
    }

    if (Array.isArray(productData)) {
      return productData;
    }

    if (Array.isArray(productData?.products)) {
      return productData.products;
    }

    if (Array.isArray(productData?.data)) {
      return productData.data;
    }

    if (
      Array.isArray(
        productData?.data?.products
      )
    ) {
      return productData.data.products;
    }

    return [];
  }, [
    productData,
    searchProducts,
    urlSearchQuery,
  ]);

  useEffect(() => {
    const query = urlSearchQuery.trim();

    if (query) {
      return;
    }

    const filters = {};

    if (selectedCategory.id !== null) {
      filters.categoryId =
        selectedCategory.id;
    }

    if (selectedBrand.id !== null) {
      filters.brandId =
        selectedBrand.id;
    }

    if (Object.keys(filters).length > 0) {
      dispatch(
        getProductFilter(
          filters,
          currentPage,
          pageSize
        )
      );
    } else {
      dispatch(
        getProduct(
          currentPage,
          pageSize
        )
      );
    }
  }, [
    dispatch,
    currentPage,
    selectedCategory.id,
    selectedBrand.id,
    urlSearchQuery,
  ]);

  useEffect(() => {
    const query = urlSearchQuery.trim();

    if (!query) {
      setSearchProducts([]);
      setSearchMeta({
        total: 0,
        count: 0,
        totalPages: 1,
      });
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    let active = true;

    const fetchSearchProducts = async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const response = await getProductSearchApi(
          query,
          currentPage,
          pageSize
        );

        const data =
          response?.data ?? response;

        if (!data?.success) {
          throw new Error(
            data?.message ||
              "Failed to search products"
          );
        }

        const results = Array.isArray(
          data?.products
        )
          ? data.products
          : Array.isArray(
              data?.data?.products
            )
          ? data.data.products
          : Array.isArray(
              data?.data
            )
          ? data.data
          : [];

        if (!active) {
          return;
        }

        setSearchProducts(results);

        setSearchMeta({
          total:
            Number(
              data?.total ??
                data?.data?.total
            ) || results.length,
          count:
            Number(
              data?.count ??
                data?.data?.count
            ) || results.length,
          totalPages:
            Math.max(
              Number(
                data?.totalPages ??
                  data?.data?.totalPages
              ) || 1,
              1
            ),
        });
      } catch (error) {
        if (!active) {
          return;
        }

        console.error(
          "Product search API:",
          error
        );

        setSearchProducts([]);
        setSearchMeta({
          total: 0,
          count: 0,
          totalPages: 1,
        });

        setSearchError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to search products"
        );
      } finally {
        if (active) {
          setSearchLoading(false);
        }
      }
    };

    fetchSearchProducts();

    return () => {
      active = false;
    };
  }, [
    urlSearchQuery,
    currentPage,
  ]);

  useEffect(() => {
    if (
      !adsLoaded &&
      !adsLoading
    ) {
      dispatch(
        getAllProductAds()
      );
    }
  }, [
    dispatch,
    adsLoaded,
    adsLoading,
  ]);

  useEffect(() => {
    setSearchQuery(
      urlSearchQuery
    );

    setCurrentPage(1);
  }, [urlSearchQuery]);

  const categories = useMemo(() => {
    const apiCategories = Array.isArray(
      productCategory
    )
      ? productCategory
      : Array.isArray(
          productCategory?.categories
        )
      ? productCategory.categories
      : Array.isArray(
          productCategory?.data
        )
      ? productCategory.data
      : Array.isArray(
          productCategory?.data?.categories
        )
      ? productCategory.data.categories
      : [];

    const normalizedCategories =
      apiCategories
        .map((category) => {
          const id =
            category?.id ??
            category?.categoryId ??
            category?._id ??
            null;

          const name =
            category?.name ??
            category?.title ??
            category?.categoryName ??
            "";

          return {
            id,
            name:
              typeof name ===
              "string"
                ? name.trim()
                : String(
                    name || ""
                  ).trim(),
          };
        })
        .filter(
          (category) =>
            category.id !== null &&
            category.name
        );

    const uniqueCategories =
      normalizedCategories.filter(
        (category, index, array) =>
          array.findIndex(
            (item) =>
              String(item.id) ===
              String(category.id)
          ) === index
      );

    return [
      {
        id: null,
        name: "All Products",
      },
      ...uniqueCategories.sort(
        (a, b) =>
          a.name.localeCompare(
            b.name
          )
      ),
    ];
  }, [productCategory]);

  const brands = useMemo(() => {
    const apiBrands = Array.isArray(
      productBrands
    )
      ? productBrands
      : Array.isArray(
          productBrands?.brands
        )
      ? productBrands.brands
      : Array.isArray(
          productBrands?.data
        )
      ? productBrands.data
      : Array.isArray(
          productBrands?.data?.brands
        )
      ? productBrands.data.brands
      : [];

    const normalizedBrands =
      apiBrands
        .map((brand) => {
          const id =
            brand?.id ??
            brand?.brandId ??
            brand?._id ??
            null;

          const name =
            brand?.name ??
            brand?.title ??
            brand?.brandName ??
            "";

          return {
            id,
            name:
              typeof name ===
              "string"
                ? name.trim()
                : String(
                    name || ""
                  ).trim(),

            slug:
              brand?.slug ||
              brand?.name
                ?.toLowerCase()
                ?.trim()
                ?.replace(
                  /[^a-z0-9]+/g,
                  "-"
                )
                ?.replace(
                  /^-+|-+$/g,
                  ""
                ) ||
              "",

            logo:
              brand?.logo ||
              brand?.image ||
              brand?.imageUrl ||
              null,

            productCount:
              Number(
                brand?.productCount
              ) ||
              Number(
                brand?._count?.products
              ) ||
              0,
          };
        })
        .filter(
          (brand) =>
            brand.id !== null &&
            brand.name
        );

    const uniqueBrands =
      normalizedBrands.filter(
        (brand, index, array) =>
          array.findIndex(
            (item) =>
              String(item.id) ===
              String(brand.id)
          ) === index
      );

    return [
      {
        id: null,
        name: "All Brands",
        slug: "all",
        productCount:
          Number(
            productData?.total
          ) ||
          allProducts.length ||
          0,
      },
      ...uniqueBrands.sort(
        (a, b) =>
          a.name.localeCompare(
            b.name
          )
      ),
    ];
  }, [
    productBrands,
    productData?.total,
    allProducts.length,
  ]);

  const products = useMemo(() => {
    const result = [
      ...allProducts,
    ];

    return result.map(
      (product) => {
        const price =
          Number(
            product?.price
          ) || 0;

        const salePrice =
          product?.salePrice !==
            null &&
          product?.salePrice !==
            undefined
            ? Number(
                product.salePrice
              )
            : null;

        const originalPrice =
          salePrice !== null &&
          salePrice < price
            ? price
            : Number(
                product?.originalPrice
              ) || 0;

        const displayPrice =
          salePrice !== null &&
          salePrice > 0
            ? salePrice
            : price;

        const discount =
          originalPrice > 0 &&
          salePrice !== null &&
          salePrice <
            originalPrice
            ? Math.round(
                ((originalPrice -
                  salePrice) /
                  originalPrice) *
                  100
              )
            : Number(
                product?.discount
              ) || 0;

        let images = [];

        if (
          Array.isArray(
            product?.images
          )
        ) {
          images =
            product.images.filter(
              Boolean
            );
        } else if (
          product?.images
        ) {
          images = [
            product.images,
          ];
        }

        if (
          product?.featuredimg &&
          !images.includes(
            product.featuredimg
          )
        ) {
          images.unshift(
            product.featuredimg
          );
        }

        return {
          id: product?.id,

          slug:
            product?.slug || "",

          name:
            product?.name || "",

          brand:
            product?.brand?.name ||
            product?.brand ||
            "",

          category:
            product?.category?.name ||
            product?.category ||
            "",

          images,

          price:
            displayPrice,

          originalPrice,

          discount,

          rating:
            Number(
              product?.rating
            ) ||
            Number(
              product?.averageRating
            ) ||
            0,

          reviewCount:
            product?._count?.reviews ||
            product?.reviews
              ?.length ||
            Number(
              product?.reviewCount
            ) ||
            0,

          isFeatured:
            Boolean(
              product?.isFeatured
            ),

          isPopular:
            Boolean(
              product?.isPopular
            ),

          isTrending:
            Boolean(
              product?.isTrending
            ),

          isTopRated:
            Boolean(
              product?.isTopRated
            ),

          isRecent:
            Boolean(
              product?.isRecent
            ),

          viewCount:
            Number(
              product?.viewCount
            ) || 0,

          stock:
            Number(
              product?.stock
            ) || 0,

          createdAt:
            product?.createdAt ||
            product?.created_at ||
            null,

          variants:
            product?.variants || [],
        };
      }
    );
  }, [
    allProducts,
  ]);

  const filteredProducts =
    useMemo(() => {
      const result = [
        ...products,
      ];

      if (
        sortBy ===
        "Featured"
      ) {
        result.sort(
          (a, b) =>
            Number(
              b.isFeatured
            ) -
            Number(
              a.isFeatured
            )
        );
      }

      if (
        sortBy ===
        "Newest"
      ) {
        result.sort(
          (a, b) => {
            const dateA =
              a.createdAt
                ? new Date(
                    a.createdAt
                  ).getTime()
                : 0;

            const dateB =
              b.createdAt
                ? new Date(
                    b.createdAt
                  ).getTime()
                : 0;

            return (
              dateB - dateA
            );
          }
        );
      }

      if (
        sortBy ===
        "Price: Low to High"
      ) {
        result.sort(
          (a, b) =>
            a.price -
            b.price
        );
      }

      if (
        sortBy ===
        "Price: High to Low"
      ) {
        result.sort(
          (a, b) =>
            b.price -
            a.price
        );
      }

      if (
        sortBy ===
        "Discount"
      ) {
        result.sort(
          (a, b) =>
            b.discount -
            a.discount
        );
      }

      if (
        sortBy ===
        "Rating"
      ) {
        result.sort(
          (a, b) =>
            b.rating -
            a.rating
        );
      }

      return result;
    }, [
      products,
      sortBy,
    ]);

  const isSearchMode =
    Boolean(urlSearchQuery.trim());

  const totalProducts = isSearchMode
    ? searchMeta.total
    : Number(
        productData?.total
      ) ||
      Number(
        productData?.data?.total
      ) ||
      filteredProducts.length ||
      0;

  const totalPages = isSearchMode
    ? searchMeta.totalPages
    : Number(
        productData?.totalPages
      ) ||
      Number(
        productData?.data?.totalPages
      ) ||
      Math.max(
        1,
        Math.ceil(
          totalProducts /
            pageSize
        )
      );

  const paginatedProducts =
    filteredProducts;

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const paginationPages =
    useMemo(() => {
      if (
        totalPages <= 7
      ) {
        return Array.from(
          {
            length:
              totalPages,
          },
          (_, index) =>
            index + 1
        );
      }

      const pages = [1];

      if (
        currentPage > 4
      ) {
        pages.push("...");
      }

      const start =
        Math.max(
          2,
          currentPage - 1
        );

      const end =
        Math.min(
          totalPages - 1,
          currentPage + 1
        );

      for (
        let page = start;
        page <= end;
        page += 1
      ) {
        pages.push(
          page
        );
      }

      if (
        currentPage <
        totalPages - 3
      ) {
        pages.push("...");
      }

      pages.push(
        totalPages
      );

      return pages;
    }, [
      currentPage,
      totalPages,
    ]);

  const isProductsLoading =
    isSearchMode
      ? searchLoading
      : productLoading;

  const isProductsFetching =
    isSearchMode
      ? searchLoading
      : productLoading;

  const isProductsError =
    isSearchMode
      ? Boolean(searchError)
      : Boolean(productError);

  const isBrandsLoading =
    adsLoading &&
    !adsLoaded;

  const isBrandsError =
    Boolean(
      adsError
    );

  const isInitialLoading =
    isProductsLoading ||
    isBrandsLoading;

  const isError =
    isProductsError ||
    isBrandsError;

  const error =
    isSearchMode
      ? searchError || adsError
      : productError || adsError;

  const refetch = () => {
    if (isSearchMode) {
      const query = urlSearchQuery.trim();

      if (!query) {
        return;
      }

      setSearchError(null);
      setSearchLoading(true);

      getProductSearchApi(
        query,
        currentPage,
        pageSize
      )
        .then((response) => {
          const data =
            response?.data ??
            response;

          if (!data?.success) {
            throw new Error(
              data?.message ||
                "Failed to search products"
            );
          }

          const results =
            Array.isArray(
              data?.products
            )
              ? data.products
              : Array.isArray(
                  data?.data?.products
                )
              ? data.data.products
              : Array.isArray(
                  data?.data
                )
              ? data.data
              : [];

          setSearchProducts(
            results
          );

          setSearchMeta({
            total:
              Number(
                data?.total ??
                  data?.data?.total
              ) || results.length,
            count:
              Number(
                data?.count ??
                  data?.data?.count
              ) || results.length,
            totalPages:
              Math.max(
                Number(
                  data?.totalPages ??
                    data?.data?.totalPages
                ) || 1,
                1
              ),
          });
        })
        .catch((error) => {
          console.error(
            "Product search API:",
            error
          );

          setSearchError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to search products"
          );
        })
        .finally(() => {
          setSearchLoading(false);
        });

      return;
    }

    const filters = {};

    if (selectedCategory.id !== null) {
      filters.categoryId =
        selectedCategory.id;
    }

    if (selectedBrand.id !== null) {
      filters.brandId =
        selectedBrand.id;
    }

    if (
      Object.keys(filters).length >
      0
    ) {
      dispatch(
        getProductFilter(
          filters,
          currentPage,
          pageSize
        )
      );
    } else {
      dispatch(
        getProduct(
          currentPage,
          pageSize
        )
      );
    }

    dispatch(
      getAllProductAds()
    );
  };

  const handleSearch = (
    e
  ) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    setCurrentPage(1);

    if (query) {
      router.push(
        `/products?search=${encodeURIComponent(
          query
        )}`
      );
    } else {
      router.push(
        "/products"
      );
    }
  };

  const clearSearch =
    () => {
      setSearchQuery(
        ""
      );

      setCurrentPage(
        1
      );

      router.push(
        "/products"
      );
    };

  const clearAllFilters =
    () => {
      setSelectedCategory({
        id: null,
        name: "All Products",
      });

      setSelectedBrand({
        id: null,
        name: "All Brands",
      });

      setSortBy(
        "Featured"
      );

      setSearchQuery(
        ""
      );

      setCurrentPage(
        1
      );

      router.push(
        "/products"
      );
    };

  const hasActiveFilters =
    selectedCategory.id !==
      null ||
    selectedBrand.id !==
      null ||
    Boolean(
      urlSearchQuery.trim()
    );

  const goToPage = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      productLoading
    ) {
      return;
    }

    setCurrentPage(
      page
    );

    window.scrollTo({
      top: 0,
      behavior:
        "smooth",
    });
  };

  useEffect(() => {
    setMobileFiltersOpen(
      false
    );
  }, [
    currentPage,
  ]);

  return (
    <section className="min-h-screen bg-[#FAFAFA]">
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

      <div className="border-y border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-[1440px] overflow-x-auto px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-max items-center gap-2 py-4">
            {categories.map(
              (category) => {
                const active =
                  String(
                    selectedCategory.id
                  ) ===
                    String(
                      category.id
                    ) &&
                  selectedCategory.name ===
                    category.name;

                return (
                  <button
                    key={
                      category.id ??
                      "all"
                    }
                    type="button"
                    onClick={() => {
                      setSelectedCategory(
                        category
                      );

                      setCurrentPage(
                        1
                      );
                    }}
                    className={`rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                      active
                        ? "border-[#E52323] bg-[#E52323] text-white"
                        : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323] hover:text-[#E52323]"
                    }`}
                  >
                    {
                      category.name
                    }
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="mb-7 flex flex-col gap-4 border-b border-[#E5E5E5] pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[#737373]">
                Showing{" "}
                <span className="font-semibold text-[#111111]">
                  {
                    paginatedProducts.length
                  }
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#111111]">
                  {
                    totalProducts
                  }
                </span>{" "}
                products
              </p>

              {hasActiveFilters && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selectedCategory.id !==
                    null && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(
                          {
                            id: null,
                            name: "All Products",
                          }
                        );

                        setCurrentPage(
                          1
                        );
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-primary"
                    >
                      {
                        selectedCategory.name
                      }

                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {selectedBrand.id !==
                    null && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand(
                          {
                            id: null,
                            name: "All Brands",
                          }
                        );

                        setCurrentPage(
                          1
                        );
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs"
                    >
                      {
                        selectedBrand.name
                      }

                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {urlSearchQuery && (
                    <button
                      type="button"
                      onClick={
                        clearSearch
                      }
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-primary"
                    >
                      "{urlSearchQuery}"

                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <form
              onSubmit={
                handleSearch
              }
              className="relative w-full lg:max-w-xs"
            >
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A3A3A3]" />

              <input
                type="text"
                value={
                  searchQuery
                }
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search products, brands..."
                className="h-11 w-full rounded-md border border-[#D4D4D4] bg-white pl-10 pr-9 text-sm text-[#111111] placeholder:text-[#737373] outline-none focus:border-[#E52323]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto lg:justify-end">
            <button
              type="button"
              onClick={() =>
                setMobileFiltersOpen(
                  true
                )
              }
              className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#D4D4D4] bg-white px-4 text-sm font-medium text-[#111111] lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />

              Filters
            </button>

            <div className="relative shrink-0">
              <select
                value={
                  sortBy
                }
                onChange={(e) =>
                  setSortBy(
                    e.target.value
                  )
                }
                className="h-11 appearance-none rounded-md border border-[#D4D4D4] bg-white pl-4 pr-10 text-sm text-[#111111] outline-none focus:border-[#E52323]"
              >
                <option>
                  Featured
                </option>

                <option>
                  Newest
                </option>

                <option>
                  Rating
                </option>

                <option>
                  Price: Low to High
                </option>

                <option>
                  Price: High to Low
                </option>

                <option>
                  Discount
                </option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <FilterSidebar
              categories={
                categories
              }
              brands={brands}
              selectedBrand={
                selectedBrand
              }
              setSelectedBrand={
                setSelectedBrand
              }
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
              setCurrentPage={
                setCurrentPage
              }
            />
          </aside>

          <div>
            {isInitialLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from(
                  {
                    length: 8,
                  }
                ).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="h-[360px] animate-pulse rounded-xl border border-[#E5E5E5] bg-white"
                    />
                  )
                )}
              </div>
            ) : isError ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 text-center">
                <h3 className="text-xl font-bold">
                  Unable to load products
                </h3>

                <p className="mt-2 text-sm text-[#737373]">
                  {error?.data
                    ?.message ||
                    error?.message ||
                    error ||
                    "Something went wrong."}
                </p>

                <button
                  type="button"
                  onClick={
                    refetch
                  }
                  className="mt-5 rounded-md bg-[#E52323] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Try Again
                </button>
              </div>
            ) : paginatedProducts.length >
              0 ? (
              <div className="relative">
                {isProductsFetching && (
                  <div className="absolute inset-0 z-20 flex items-start justify-center bg-white/40 pt-10 backdrop-blur-[1px]">
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111111] shadow">
                      Loading products...
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                  {paginatedProducts.map(
                    (
                      product
                    ) => (
                      <ProductCard
                        key={
                          product.id
                        }
                        product={
                          product
                        }
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

                {urlSearchQuery && (
                  <p className="mt-2 text-sm text-[#737373]">
                    No products found
                    for "{urlSearchQuery}".
                  </p>
                )}

                <button
                  type="button"
                  onClick={
                    clearAllFilters
                  }
                  className="mt-5 rounded-md bg-[#E52323] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {!isInitialLoading &&
          !isError &&
          totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#E5E5E5] pt-8">
              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage ===
                    1 ||
                  isProductsFetching
                }
                className="flex h-10 items-center justify-center rounded-md border border-[#D4D4D4] bg-white px-4 text-sm text-[#111111] transition hover:border-[#E52323] hover:text-[#E52323] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {paginationPages.map(
                (
                  page,
                  index
                ) => {
                  if (
                    page ===
                    "..."
                  ) {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="flex h-10 w-10 items-center justify-center text-sm text-[#737373]"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={
                        page
                      }
                      type="button"
                      onClick={() =>
                        goToPage(
                          page
                        )
                      }
                      disabled={
                        isProductsFetching
                      }
                      className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm font-bold transition ${
                        currentPage ===
                        page
                          ? "border-[#E52323] bg-[#E52323] text-white"
                          : "border-[#D4D4D4] bg-white text-primary hover:border-[#E52323] hover:text-[#E52323]"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                type="button"
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage ===
                    totalPages ||
                  isProductsFetching
                }
                className="flex h-10 items-center justify-center rounded-md border border-[#D4D4D4] bg-white px-4 text-sm text-[#111111] transition hover:border-[#E52323] hover:text-[#E52323] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
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
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <FilterSidebar
              categories={
                categories
              }
              brands={brands}
              selectedBrand={
                selectedBrand
              }
              setSelectedBrand={
                setSelectedBrand
              }
              selectedCategory={
                selectedCategory
              }
              setSelectedCategory={
                setSelectedCategory
              }
              setCurrentPage={
                setCurrentPage
              }
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
  setCurrentPage,
}) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,0.04)]">
      <div className="mb-6 flex items-center gap-2">
        <ListFilter className="h-4 w-4 text-[#E52323]" />

        <h2 className="text-sm font-bold uppercase tracking-[0.12em]">
          Filters
        </h2>
      </div>

      <div className="border-b border-[#E5E5E5] pb-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#AAAAAA]">
          Categories
        </h3>

        <div className="space-y-2">
          {categories.map(
            (category) => {
              const active =
                String(
                  selectedCategory.id
                ) ===
                  String(
                    category.id
                  ) &&
                selectedCategory.name ===
                  category.name;

              return (
                <button
                  key={
                    category.id ??
                    "all"
                  }
                  type="button"
                  onClick={() => {
                    setSelectedCategory(
                      category
                    );

                    setCurrentPage(
                      1
                    );
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${
                    active
                      ? "bg-[#E52323]/10 text-[#E52323]"
                      : "text-[#525252] hover:bg-[#F5F5F5] hover:text-[#E52323]"
                  }`}
                >
                  <span>
                    {
                      category.name
                    }
                  </span>

                  {active && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="pt-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#AAAAAA]">
          Brands
        </h3>

        <div className="space-y-2">
          {brands.map(
            (brand) => {
              const active =
                String(
                  selectedBrand.id
                ) ===
                  String(
                    brand.id
                  ) &&
                selectedBrand.name ===
                  brand.name;

              return (
                <button
                  key={
                    brand.id ??
                    "all"
                  }
                  type="button"
                  onClick={() => {
                    setSelectedBrand(
                      brand
                    );

                    setCurrentPage(
                      1
                    );
                  }}
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
                      {
                        brand.name
                      }
                    </span>
                  </div>

                  {brand.productCount >
                    0 && (
                    <span className="text-xs text-[#A3A3A3]">
                      {
                        brand.productCount
                      }
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setSelectedCategory({
            id: null,
            name: "All Products",
          });

          setSelectedBrand({
            id: null,
            name: "All Brands",
          });

          setCurrentPage(1);
        }}
        className="mt-7 w-full rounded-md border border-[#333333] py-2.5 text-xs font-semibold uppercase tracking-wide text-[#737373] transition hover:border-[#E52323] hover:text-[#E52323]"
      >
        Clear All Filters
      </button>
    </div>
  );
}