"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  ChevronDown,
  ChevronRight,
  Filter,
  ListFilter,
  SlidersHorizontal,
  X,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

import {
  getProductSearchApi,
  ProductFilter,
} from "@/apiService/api";

import {
  getProduct,
  getProductFilter,
} from "@/redux/features/product/productAction";

import { getAllProductAds } from "@/redux/features/adProducts/adProductAction";

const SPECIAL_PRODUCT_KEYS = {
  trending: "trendProduct",
  featured: "featuredProduct",
  "top rated": "topRelateProduct",
  popular: "popularProduct",
  "best sellers": "topSellingProduct",
  recent: "recentProduct",
  combo: "comboProduct",
};

const getBooleanValue = (value) => {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true"
  );
};

const getSpecialProductKey = (search) => {
  if (!search) {
    return null;
  }


  return (
    SPECIAL_PRODUCT_KEYS[
    String(search).trim().toLowerCase()
    ] || null
  );
};

const getProductsFromResponse = (response) => {
  const data = response?.data ?? response;

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

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  if (Array.isArray(data?.data?.results)) {
    return data.data.results;
  }

  return [];
};

const getTotalFromResponse = (
  response,
  fallback = 0
) => {
  const data = response?.data ?? response;

  const total =
    data?.total ??
    data?.data?.total ??
    data?.meta?.total ??
    data?.pagination?.total;

  const parsed = Number(total);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
};

const getTotalPagesFromResponse = (
  response,
  total,
  pageSize
) => {
  const data = response?.data ?? response;

  const totalPages =
    data?.totalPages ??
    data?.data?.totalPages ??
    data?.meta?.totalPages ??
    data?.pagination?.totalPages;

  const parsed = Number(totalPages);

  if (
    Number.isFinite(parsed) &&
    parsed > 0
  ) {
    return parsed;
  }

  return Math.max(
    1,
    Math.ceil(total / pageSize)
  );
};

const getUniqueProducts = (products) => {
  return products.filter(
    (product, index, array) => {
      const productId =
        product?.id ??
        product?.productId ??
        product?._id ??
        product?.slug;

      return (
        array.findIndex((item) => {
          const itemId =
            item?.id ??
            item?.productId ??
            item?._id ??
            item?.slug;

          return (
            String(itemId) ===
            String(productId)
          );
        }) === index
      );
    }
  );
};

export default function ShopPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const searchQuery = (searchParams.get("search") || "").trim();
  const specialProductKey = getSpecialProductKey(searchQuery);
  const pageSize = 20;

  const [selectedCategory, setSelectedCategory] = useState({
    id: null,
    name: "All Products",
  });

  const [selectedBrand, setSelectedBrand] = useState({
    id: null,
    name: "All Brands",
  });

  const [sortBy, setSortBy] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState(null);
  const [filterTotal, setFilterTotal] = useState(0);
  const [filterTotalPages, setFilterTotalPages] = useState(1);

  const [sortedProducts, setSortedProducts] = useState([]);
  const [sortLoading, setSortLoading] = useState(false);
  const [sortError, setSortError] = useState(null);
  const [sortTotal, setSortTotal] = useState(0);
  const [sortTotalPages, setSortTotalPages] = useState(1);

  const [loadedViewKey, setLoadedViewKey] = useState(null);

  const productState = useSelector((state) => state.products || {});
  const productAdState = useSelector((state) => state.productAd || {});

  const productData =
    productState.productList ??
    productState.products ??
    productState.product ??
    productState.data ??
    productState;

  const productLoading = Boolean(productState.loading);
  const productError = productState.error || null;

  const adsLoading = Boolean(productAdState.loading);
  const adsLoaded = Boolean(productAdState.loaded);
  const adsError = productAdState.error || null;

  const productCategory =
    productAdState.productCateogry ??
    productAdState.productCategory ??
    productState.productCateogry ??
    productState.productCategory ??
    null;

  const productBrands =
    productAdState.brands ??
    productState.brands ??
    null;

  const specialProduct = specialProductKey
    ? productAdState[specialProductKey]
    : null;

  const specialProducts = getProductsFromResponse(specialProduct);

  const allProducts = (() => {
    if (Array.isArray(productData)) {
      return productData;
    }

    if (Array.isArray(productData?.products)) {
      return productData.products;
    }

    if (Array.isArray(productData?.data)) {
      return productData.data;
    }

    if (Array.isArray(productData?.data?.products)) {
      return productData.data.products;
    }

    if (Array.isArray(productData?.results)) {
      return productData.results;
    }

    return [];
  })();

  const currentViewKey = searchQuery
    ? `search:${searchQuery}:${specialProductKey || "normal"}`
    : sortBy
      ? `sort:${sortBy}:${currentPage}`
      : selectedCategory.id !== null || selectedBrand.id !== null
        ? `filter:${selectedCategory.id ?? "all"}:${selectedBrand.id ?? "all"}:${currentPage}`
        : `products:${currentPage}`;

  useEffect(() => {
    setLoadedViewKey(null);
  }, [currentViewKey]);

  useEffect(() => {
    if (!searchQuery) {
      setSearchProducts([]);
      setSearchError(null);
      setSearchLoading(false);
      return;
    }

    let active = true;

    const loadSearchProducts = async () => {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const response = await getProductSearchApi(searchQuery);

        if (!active) {
          return;
        }

        const products = getProductsFromResponse(response);

        setSearchProducts(getUniqueProducts(products));
        setCurrentPage(1);
      } catch (error) {
        if (!active) {
          return;
        }

        setSearchProducts([]);

        setSearchError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to search products."
        );
      } finally {
        if (active) {
          setSearchLoading(false);
          setLoadedViewKey(currentViewKey);
        }
      }
    };

    loadSearchProducts();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      return;
    }

    if (sortBy) {
      setFilteredProducts([]);
      setFilterError(null);
      setFilterLoading(false);
      return;
    }

    const hasCategory = selectedCategory.id !== null;
    const hasBrand = selectedBrand.id !== null;

    if (!hasCategory && !hasBrand) {
      setFilteredProducts([]);
      setFilterError(null);
      setFilterLoading(false);
      setFilterTotal(0);
      setFilterTotalPages(1);

      let active = true;

      const loadProducts = async () => {
        try {
          await dispatch(getProduct(currentPage, pageSize));
        } catch (error) {
        } finally {
          if (active) {
            setLoadedViewKey(currentViewKey);
          }
        }
      };

      loadProducts();

      return () => {
        active = false;
      };
    }

    let active = true;

    const loadFilteredProducts = async () => {
      const filters = {};

      if (hasCategory) {
        filters.categoryId = selectedCategory.id;
      }

      if (hasBrand) {
        filters.brandId = selectedBrand.id;
      }

      try {
        setFilterLoading(true);
        setFilterError(null);

        const response = await dispatch(
          getProductFilter(
            filters,
            currentPage,
            pageSize
          )
        );

        if (!active) {
          return;
        }

        const products = getProductsFromResponse(response);

        const uniqueProducts = getUniqueProducts(products);

        const total = getTotalFromResponse(
          response,
          uniqueProducts.length
        );

        const totalPages = getTotalPagesFromResponse(
          response,
          total,
          pageSize
        );

        setFilteredProducts(uniqueProducts);
        setFilterTotal(total);
        setFilterTotalPages(totalPages);
      } catch (error) {
        if (!active) {
          return;
        }

        setFilteredProducts([]);
        setFilterTotal(0);
        setFilterTotalPages(1);

        setFilterError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to filter products."
        );
      } finally {
        if (active) {
          setFilterLoading(false);
          setLoadedViewKey(currentViewKey);
        }
      }
    };

    loadFilteredProducts();

    return () => {
      active = false;
    };
  }, [
    dispatch,
    currentPage,
    selectedCategory.id,
    selectedBrand.id,
    searchQuery,
    sortBy,
  ]);

  useEffect(() => {
    if (!sortBy || searchQuery) {
      setSortedProducts([]);
      setSortError(null);
      setSortLoading(false);
      setSortTotal(0);
      setSortTotalPages(1);
      return;
    }

    let active = true;

    const loadSortedProducts = async () => {
      try {
        setSortLoading(true);
        setSortError(null);

        const response = await ProductFilter(
          {
            sortBy,
          },
          currentPage,
          pageSize
        );

        if (!active) {
          return;
        }

        const products = getProductsFromResponse(response);

        const uniqueProducts = getUniqueProducts(products);

        const total = getTotalFromResponse(
          response,
          uniqueProducts.length
        );

        const totalPages = getTotalPagesFromResponse(
          response,
          total,
          pageSize
        );

        setSortedProducts(uniqueProducts);
        setSortTotal(total);
        setSortTotalPages(totalPages);
      } catch (error) {
        if (!active) {
          return;
        }

        setSortedProducts([]);
        setSortTotal(0);
        setSortTotalPages(1);

        setSortError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to sort products."
        );
      } finally {
        if (active) {
          setSortLoading(false);
          setLoadedViewKey(currentViewKey);
        }
      }
    };

    loadSortedProducts();

    return () => {
      active = false;
    };
  }, [sortBy, currentPage, searchQuery]);

  useEffect(() => {
    if (!adsLoaded && !adsLoading) {
      dispatch(getAllProductAds());
    }
  }, [dispatch, adsLoaded, adsLoading]);

  const categories = (() => {
    const apiCategories = Array.isArray(productCategory)
      ? productCategory
      : Array.isArray(productCategory?.categories)
        ? productCategory.categories
        : Array.isArray(productCategory?.data)
          ? productCategory.data
          : Array.isArray(productCategory?.data?.categories)
            ? productCategory.data.categories
            : [];

    const normalizedCategories = apiCategories
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
            typeof name === "string"
              ? name.trim()
              : String(name || "").trim(),
        };
      })
      .filter(
        (category) => category.id !== null && category.name
      );

    const uniqueCategories = normalizedCategories.filter(
      (category, index, array) =>
        array.findIndex(
          (item) =>
            String(item.id) === String(category.id)
        ) === index
    );

    return [
      {
        id: null,
        name: "All Products",
      },
      ...uniqueCategories.sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    ];
  })();

  const brands = (() => {
    const apiBrands = Array.isArray(productBrands)
      ? productBrands
      : Array.isArray(productBrands?.brands)
        ? productBrands.brands
        : Array.isArray(productBrands?.data)
          ? productBrands.data
          : Array.isArray(productBrands?.data?.brands)
            ? productBrands.data.brands
            : [];

    const normalizedBrands = apiBrands
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
            typeof name === "string"
              ? name.trim()
              : String(name || "").trim(),
          slug:
            brand?.slug ||
            brand?.name
              ?.toLowerCase()
              ?.trim()
              ?.replace(/[^a-z0-9]+/g, "-")
              ?.replace(/^[-]+|[-]+$/g, "") ||
            "",
          logo:
            brand?.logo ||
            brand?.image ||
            brand?.imageUrl ||
            null,
          productCount:
            Number(brand?.productCount) ||
            Number(brand?._count?.products) ||
            0,
        };
      })
      .filter(
        (brand) => brand.id !== null && brand.name
      );

    const uniqueBrands = normalizedBrands.filter(
      (brand, index, array) =>
        array.findIndex(
          (item) =>
            String(item.id) === String(brand.id)
        ) === index
    );

    return [
      {
        id: null,
        name: "All Brands",
        slug: "all",
        productCount:
          Number(productData?.total) ||
          Number(productData?.data?.total) ||
          allProducts.length ||
          0,
      },
      ...uniqueBrands.sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    ];
  })();

  const normalizedSpecialProducts =
    getUniqueProducts(specialProducts);

  const sourceProducts = searchQuery
    ? specialProductKey
      ? normalizedSpecialProducts.length
        ? normalizedSpecialProducts
        : searchProducts
      : searchProducts
    : sortBy
      ? sortedProducts
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? filteredProducts
        : allProducts;

  const products = sourceProducts.map((product) => {
    const price = Number(product?.price) || 0;

    const salePrice =
      product?.salePrice !== null &&
      product?.salePrice !== undefined
        ? Number(product.salePrice)
        : null;

    const originalPrice =
      salePrice !== null && salePrice < price
        ? price
        : Number(product?.originalPrice) || 0;

    const displayPrice =
      salePrice !== null && salePrice > 0
        ? salePrice
        : price;

    const discount =
      originalPrice > 0 &&
      salePrice !== null &&
      salePrice < originalPrice
        ? Math.round(
            ((originalPrice - salePrice) /
              originalPrice) *
              100
          )
        : Number(product?.discount) || 0;

    let images = [];

    if (Array.isArray(product?.images)) {
      images = product.images.filter(Boolean);
    } else if (product?.images) {
      images = [product.images];
    }

    if (
      product?.featuredimg &&
      !images.includes(product.featuredimg)
    ) {
      images.unshift(product.featuredimg);
    }

    if (
      product?.featuredImage &&
      !images.includes(product.featuredImage)
    ) {
      images.unshift(product.featuredImage);
    }

    return {
      ...product,
      id:
        product?.id ??
        product?.productId ??
        product?._id,
      slug: product?.slug || "",
      name:
        product?.name ||
        product?.title ||
        "",
      brand:
        product?.brand?.name ||
        product?.brand ||
        "",
      category:
        product?.category?.name ||
        product?.category ||
        "",
      images,
      price: displayPrice,
      originalPrice,
      discount,
      rating:
        Number(product?.rating) ||
        Number(product?.averageRating) ||
        0,
      reviewCount:
        product?._count?.reviews ||
        product?.reviews?.length ||
        Number(product?.reviewCount) ||
        0,
      isFeatured: getBooleanValue(
        product?.isFeatured
      ),
      isPopular: getBooleanValue(
        product?.isPopular
      ),
      isTrending: getBooleanValue(
        product?.isTrending
      ),
      isTopRated: getBooleanValue(
        product?.isTopRated
      ),
      isRecent: getBooleanValue(
        product?.isRecent
      ),
      viewCount: Number(product?.viewCount) || 0,
      stock: Number(product?.stock) || 0,
      createdAt:
        product?.createdAt ||
        product?.created_at ||
        null,
      variants: product?.variants || [],
    };
  });

  const specialTotal = getTotalFromResponse(
    specialProduct,
    normalizedSpecialProducts.length
  );

  const totalProducts = searchQuery
    ? specialProductKey
      ? specialTotal ||
        normalizedSpecialProducts.length ||
        searchProducts.length
      : searchProducts.length
    : sortBy
      ? sortTotal || sortedProducts.length
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? filterTotal || filteredProducts.length
        : Number(productData?.total) ||
          Number(productData?.data?.total) ||
          allProducts.length;

  const totalPages = searchQuery
    ? specialProductKey
      ? getTotalPagesFromResponse(
          specialProduct,
          totalProducts,
          pageSize
        )
      : Math.max(
          1,
          Math.ceil(totalProducts / pageSize)
        )
    : sortBy
      ? sortTotalPages
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? filterTotalPages
        : Number(productData?.totalPages) ||
          Number(productData?.data?.totalPages) ||
          Math.max(
            1,
            Math.ceil(totalProducts / pageSize)
          );

  const paginatedProducts =
    searchQuery && !specialProductKey
      ? products.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )
      : products;

  const isSpecialProductLoading = Boolean(
    specialProductKey && productState.loading
  );

  const isProductsLoading = searchQuery
    ? specialProductKey
      ? isSpecialProductLoading || searchLoading
      : searchLoading
    : sortBy
      ? sortLoading
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? filterLoading
        : productLoading;

  const isProductsError = searchQuery
    ? specialProductKey
      ? Boolean(
          productState.error || searchError
        )
      : Boolean(searchError)
    : sortBy
      ? Boolean(sortError)
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? Boolean(filterError)
        : Boolean(productError);

  const isBrandsLoading =
    adsLoading && !adsLoaded;

  const isBrandsError = Boolean(adsError);

  const isInitialLoading =
    loadedViewKey !== currentViewKey ||
    isProductsLoading ||
    (!searchQuery && isBrandsLoading);

  const isError =
    !isInitialLoading &&
    (isProductsError || isBrandsError);

  const error = searchQuery
    ? searchError ||
      productState.error ||
      adsError
    : sortBy
      ? sortError || adsError
      : selectedCategory.id !== null ||
          selectedBrand.id !== null
        ? filterError || adsError
        : productError || adsError;

  const hasActiveFilters =
    selectedCategory.id !== null ||
    selectedBrand.id !== null ||
    Boolean(sortBy);

  const getSortLabel = () => {
    if (sortBy === "price_low_high") {
      return "Price: Low to High";
    }

    if (sortBy === "price_high_low") {
      return "Price: High to Low";
    }

    if (sortBy === "stock") {
      return "Stock Availability";
    }

    if (sortBy === "most_discount") {
      return "Best Discount";
    }

    if (sortBy === "rating") {
      return "Highest Rated";
    }

    return "";
  };

  const refetch = async () => {
    setLoadedViewKey(null);

    if (searchQuery) {
      try {
        setSearchLoading(true);
        setSearchError(null);

        const response =
          await getProductSearchApi(searchQuery);

        setSearchProducts(
          getUniqueProducts(
            getProductsFromResponse(response)
          )
        );
      } catch (err) {
        setSearchError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to search products."
        );
      } finally {
        setSearchLoading(false);
        setLoadedViewKey(currentViewKey);
      }

      return;
    }

    if (sortBy) {
      try {
        setSortLoading(true);
        setSortError(null);

        const response = await ProductFilter(
          {
            sortBy,
          },
          currentPage,
          pageSize
        );

        const products = getUniqueProducts(
          getProductsFromResponse(response)
        );

        const total = getTotalFromResponse(
          response,
          products.length
        );

        setSortedProducts(products);
        setSortTotal(total);

        setSortTotalPages(
          getTotalPagesFromResponse(
            response,
            total,
            pageSize
          )
        );
      } catch (err) {
        setSortError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to sort products."
        );
      } finally {
        setSortLoading(false);
        setLoadedViewKey(currentViewKey);
      }

      return;
    }

    if (
      selectedCategory.id !== null ||
      selectedBrand.id !== null
    ) {
      const filters = {};

      if (selectedCategory.id !== null) {
        filters.categoryId = selectedCategory.id;
      }

      if (selectedBrand.id !== null) {
        filters.brandId = selectedBrand.id;
      }

      try {
        setFilterLoading(true);
        setFilterError(null);

        await dispatch(
          getProductFilter(
            filters,
            currentPage,
            pageSize
          )
        );
      } catch (err) {
        setFilterError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to filter products."
        );
      } finally {
        setFilterLoading(false);
        setLoadedViewKey(currentViewKey);
      }

      return;
    }

    try {
      await dispatch(
        getProduct(
          currentPage,
          pageSize
        )
      );
    } finally {
      setLoadedViewKey(currentViewKey);
    }

    dispatch(getAllProductAds());
  };

  const clearAllFilters = () => {
    setSelectedCategory({
      id: null,
      name: "All Products",
    });

    setSelectedBrand({
      id: null,
      name: "All Brands",
    });

    setSortBy("");
    setFilteredProducts([]);
    setSortedProducts([]);
    setFilterTotal(0);
    setFilterTotalPages(1);
    setSortTotal(0);
    setSortTotalPages(1);
    setCurrentPage(1);
    setLoadedViewKey(null);
  };

  const goToPage = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      isProductsLoading
    ) {
      return;
    }

    setLoadedViewKey(null);
    setCurrentPage(page);

    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setMobileFiltersOpen(false);
  }, [currentPage]);

  const paginationPages = [];

  if (totalPages <= 7) {
    for (
      let page = 1;
      page <= totalPages;
      page += 1
    ) {
      paginationPages.push(page);
    }
  } else {
    paginationPages.push(1);

    if (currentPage > 4) {
      paginationPages.push("...");
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
      paginationPages.push(page);
    }

    if (
      currentPage <
      totalPages - 3
    ) {
      paginationPages.push("...");
    }

    paginationPages.push(totalPages);
  }

  const router = useRouter();

  const handleRemoveFilter = () => {
    setLoadedViewKey(null);

    setSelectedBrand({
      id: null,
      name: "All Brands",
    });

    setSortBy("");
    setCurrentPage(1);

    setSelectedCategory({
      id: null,
      name: "All Products",
    });

    router.replace("/products");
  };

  const handleFilterChange = () => {
    setLoadedViewKey(null);
    router.replace("/products", {
      scroll: false,
    });
  };

  return (
    <section className="min-h-screen bg-[#FAFAFA]">
      <div className="border-b border-[#E5E5E5]">
        <div className="flex justify-between items-center mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.14em]">
            <span className="text-[#E52323]">
              Home
            </span>

            <ChevronRight className="h-3.5 w-3.5 text-[#A3A3A3]" />

            <span className="text-[#525252]">
              Shop
            </span>
          </div>

          <button
            className="bg-red-600 cursor-pointer py-1 px-3 rounded-xl text-[12px] sm:py-1 sm:px-4 sm:text-[14px]"
            onClick={handleRemoveFilter}
          >
            Remove Filter
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-10 sm:px-8 lg:px-10 lg:pb-10 lg:pt-14">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#E52323]">
            C2C Supplement Store
          </p>

          <h1 className="text-4xl font-black uppercase tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
            {searchQuery
              ? searchQuery
              : "Shop Supplements"}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#525252] sm:text-base">
            {searchQuery
              ? `Showing products for "${searchQuery}".`
              : "Discover premium sports nutrition, supplements, vitamins and wellness products from trusted brands."}
          </p>
        </div>
      </div>

      <div className="border-y border-[#E5E5E5] bg-white">
        <div className="mx-auto max-w-[1440px] overflow-x-auto px-5 sm:px-8 lg:px-10">
          <div className="flex min-w-max items-center gap-2 py-4">
            {categories.map((category) => {
              const active =
                String(selectedCategory.id) ===
                  String(category.id) &&
                selectedCategory.name ===
                  category.name;

              return (
                <button
                  key={category.id ?? "all"}
                  type="button"
                  onClick={() => {
                    setLoadedViewKey(null);
                    setSelectedCategory(category);
                    handleFilterChange();
                    setSortBy("");
                    setSortedProducts([]);
                    setCurrentPage(1);
                  }}
                  className={`rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                    active
                      ? "border-[#E52323] bg-[#E52323] text-white"
                      : "border-[#D4D4D4] bg-white text-[#525252] hover:border-[#E52323] hover:text-[#E52323]"
                  }`}
                >
                  {category.name}
                </button>
              );
            })}
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
                  {paginatedProducts.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#111111]">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              {searchQuery && (
                <p className="mt-2 text-xs text-[#737373]">
                  Results for{" "}
                  <span className="font-semibold text-[#111111]">
                    "{searchQuery}"
                  </span>
                </p>
              )}

              {hasActiveFilters && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {selectedCategory.id !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoadedViewKey(null);
                        setSelectedCategory({
                          id: null,
                          name: "All Products",
                        });
                        handleFilterChange();
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-black"
                    >
                      {selectedCategory.name}
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {selectedBrand.id !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoadedViewKey(null);
                        setSelectedBrand({
                          id: null,
                          name: "All Brands",
                        });
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-black"
                    >
                      {selectedBrand.name}
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {sortBy && (
                    <button
                      type="button"
                      onClick={() => {
                        setLoadedViewKey(null);
                        setSortBy("");
                        setSortedProducts([]);
                        setSortTotal(0);
                        setSortTotalPages(1);
                        setCurrentPage(1);
                      }}
                      className="flex items-center gap-1 rounded-full border border-[#D4D4D4] bg-white px-3 py-1 text-xs text-black"
                    >
                      {getSortLabel()}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 overflow-x-auto lg:justify-end">
              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(true)
                }
                className="flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#D4D4D4] bg-white px-4 text-sm font-medium text-black lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setLoadedViewKey(null);
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                    setSortError(null);
                    // setFilteredProducts([]);
                    handleFilterChange()
                  }}
                  className="h-11 appearance-none rounded-md border border-[#D4D4D4] bg-white pl-4 pr-10 text-sm text-black outline-none focus:border-[#E52323]"
                >
                  <option value="">
                    Default (Newest)
                  </option>

                  <option value="price_low_high">
                    Price: Low to High
                  </option>

                  <option value="price_high_low">
                    Price: High to Low
                  </option>

                  <option value="stock">
                    Stock Availability
                  </option>

                  <option value="most_discount">
                    Best Discount
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <FilterSidebar
              categories={categories}
              brands={brands}
              selectedBrand={selectedBrand}
              setSelectedBrand={(value) => {
                setLoadedViewKey(null);
                setSelectedBrand(value);
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={(value) => {
                setLoadedViewKey(null);
                setSelectedCategory(value);
              }}
              setCurrentPage={(value) => {
                setLoadedViewKey(null);
                setCurrentPage(value);
              }}
              setSortBy={(value) => {
                setLoadedViewKey(null);
                setSortBy(value);
              }}
              handleFilterChange={handleFilterChange}
            />
          </aside>

          <div>
            {isInitialLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {Array.from({ length: 8 }).map(
                  (_, index) => (
                    <div
                      key={index}
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
                  {error?.data?.message ||
                    error?.message ||
                    error ||
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
            ) : paginatedProducts.length > 0 ? (
              <div className="relative">
                {isProductsLoading && (
                  <div className="absolute inset-0 z-20 flex items-start justify-center bg-white/40 pt-10 backdrop-blur-[1px]">
                    <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#111111] shadow">
                      Loading products...
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-[#E5E5E5] bg-white px-6 text-center">
                <Filter className="mb-4 h-8 w-8 text-[#A3A3A3]" />

                <h3 className="text-xl font-bold text-black">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-[#737373]">
                  Try changing your filters or search.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    handleRemoveFilter();
                  }}
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
            <div className="mt-10 w-full border-t border-[#E5E5E5] pt-6 sm:mt-12 sm:pt-8">
              <div className="w-full overflow-x-auto overflow-y-hidden">
                <div className="mx-auto flex w-max flex-nowrap items-center justify-center gap-1.5 px-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage - 1)
                    }
                    disabled={
                      currentPage === 1 ||
                      isProductsLoading
                    }
                    aria-label="Previous page"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D4D4D4] bg-white text-[#111111] transition-all duration-200 hover:border-[#E52323] hover:text-[#E52323] disabled:pointer-events-none disabled:opacity-40 sm:w-auto sm:px-4"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 sm:mr-1.5" />
                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  <div className="hidden flex-nowrap items-center gap-1.5 sm:flex sm:gap-2">
                    {paginationPages.map(
                      (page, index) => {
                        if (page === "...") {
                          return (
                            <span
                              key={`desktop-ellipsis-${index}`}
                              className="flex h-10 w-6 shrink-0 items-center justify-center text-sm text-[#737373]"
                            >
                              …
                            </span>
                          );
                        }

                        return (
                          <button
                            key={`desktop-page-${page}`}
                            type="button"
                            onClick={() =>
                              goToPage(page)
                            }
                            disabled={isProductsLoading}
                            aria-current={
                              currentPage === page
                                ? "page"
                                : undefined
                            }
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition-all duration-200 ${
                              currentPage === page
                                ? "border-[#E52323] bg-[#E52323] text-white"
                                : "border-[#D4D4D4] bg-white text-[#111111] hover:border-[#E52323] hover:text-[#E52323]"
                            } disabled:pointer-events-none disabled:opacity-40`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="flex flex-nowrap items-center gap-1.5 sm:hidden">
                    {(() => {
                      const mobilePages = [];

                      if (currentPage > 2) {
                        mobilePages.push(1);

                        if (currentPage > 3) {
                          mobilePages.push("...");
                        }
                      }

                      if (currentPage > 1) {
                        mobilePages.push(
                          currentPage - 1
                        );
                      }

                      mobilePages.push(currentPage);

                      if (currentPage < totalPages) {
                        mobilePages.push(
                          currentPage + 1
                        );
                      }

                      if (
                        currentPage <
                        totalPages - 1
                      ) {
                        if (
                          currentPage <
                          totalPages - 2
                        ) {
                          mobilePages.push("...");
                        }

                        mobilePages.push(totalPages);
                      }

                      return mobilePages.map(
                        (page, index) => {
                          if (page === "...") {
                            return (
                              <span
                                key={`mobile-ellipsis-${index}`}
                                className="flex h-10 w-5 shrink-0 items-center justify-center text-xs font-semibold text-[#737373]"
                              >
                                …
                              </span>
                            );
                          }

                          return (
                            <button
                              key={`mobile-page-${page}`}
                              type="button"
                              onClick={() =>
                                goToPage(page)
                              }
                              disabled={isProductsLoading}
                              aria-current={
                                currentPage === page
                                  ? "page"
                                  : undefined
                              }
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-sm font-bold transition-all duration-200 ${
                                currentPage === page
                                  ? "border-[#E52323] bg-[#E52323] text-white"
                                  : "border-[#D4D4D4] bg-white text-[#111111] hover:border-[#E52323] hover:text-[#E52323]"
                              } disabled:pointer-events-none disabled:opacity-40`}
                            >
                              {page}
                            </button>
                          );
                        }
                      );
                    })()}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      goToPage(currentPage + 1)
                    }
                    disabled={
                      currentPage === totalPages ||
                      isProductsLoading
                    }
                    aria-label="Next page"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D4D4D4] bg-white text-[#111111] transition-all duration-200 hover:border-[#E52323] hover:text-[#E52323] disabled:pointer-events-none disabled:opacity-40 sm:w-auto sm:px-4"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight className="h-4 w-4 sm:ml-1.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-center text-xs font-medium text-[#737373]">
                Page{" "}
                <span className="font-bold text-[#111111]">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-bold text-[#111111]">
                  {totalPages}
                </span>
              </div>
            </div>
          )}
      </div>

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
              setSelectedBrand={(value) => {
                setLoadedViewKey(null);
                setSelectedBrand(value);
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={(value) => {
                setLoadedViewKey(null);
                setSelectedCategory(value);
              }}
              setCurrentPage={(value) => {
                setLoadedViewKey(null);
                setCurrentPage(value);
              }}
              setSortBy={(value) => {
                setLoadedViewKey(null);
                setSortBy(value);
              }}
              handleFilterChange={handleFilterChange}
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
  setSortBy,
  handleFilterChange,
}) {

  const router = useRouter();

  const handleRemoveFilter = () => {
    router.replace("/products");
  };

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

                    setSortBy("");

                    setCurrentPage(
                      1
                    );
                    handleFilterChange()
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition ${active
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

                    handleFilterChange();

                    setSortBy("");

                    setCurrentPage(
                      1
                    );
                  }}
                  className="flex w-full items-center justify-between gap-3 py-1.5 text-left text-sm text-[#525252] transition hover:text-[#E52323]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${active
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

          handleRemoveFilter()

          setSelectedBrand({
            id: null,
            name: "All Brands",
          });

          setSortBy("");

          setCurrentPage(1);
        }}
        className="mt-7 w-full rounded-md border border-[#333333] py-2.5 text-xs font-semibold uppercase tracking-wide text-[#737373] transition hover:border-[#E52323] hover:text-[#E52323]"
      >
        Clear All Filters
      </button>
    </div>
  );
}