import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productsApi = createApi({
  reducerPath: "productsApi",

  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://cost2costsupplement-backend-2.onrender.com/api/",

    prepareHeaders: (headers) => {
      // Get token from localStorage on the client
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    // =====================================================
    // AUTH
    // =====================================================

    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // =====================================================
    // PRODUCTS
    // =====================================================

    getProducts: builder.query({
      query: (page = 1) => `/products?page=${page}`,
    }),

    getSearchProducts: builder.query({
      query: (arg) => {
        const searchQuery =
          typeof arg === "string" ? arg : arg?.searchQuery;

        const page =
          typeof arg === "string" ? 1 : arg?.page || 1;

        return `/products/search?q=${encodeURIComponent(
          searchQuery
        )}&page=${page}`;
      },
    }),

    getBrands: builder.query({
      query: () => "brands/",
    }),

    getProductBySlug: builder.query({
      query: (slug) => `products/${slug}`,
    }),

    getRelatedProducts: builder.query({
      query: (slug) => `products/${slug}/related`,
    }),

    getFeaturedProducts: builder.query({
      query: () => "products/featured",
    }),

    getRecentProducts: builder.query({
      query: () => "products/recent",
    }),

    getTrendingProducts: builder.query({
      query: () => "products/trending",
    }),

    getTopRatedProducts: builder.query({
      query: () => "products/top-rated",
    }),

    getPopularProducts: builder.query({
      query: () => "products/popular",
    }),

    getBestSellingProducts: builder.query({
      query: () => "products/top-selling",
    }),

    // =====================================================
    // BLOGS
    // =====================================================

    getBlogs: builder.query({
      query: () => "blogs/",
    }),

    // =====================================================
    // GOALS
    // =====================================================

    getGoals: builder.query({
      query: () => "goals/",
    }),

    // =====================================================
    // CATEGORIES
    // =====================================================

    getCategories: builder.query({
      query: () => "category/",
    }),

    // =====================================================
    // FEATURED BANNERS
    // =====================================================

    getFeaturedBanner: builder.query({
      query: () => "featured-banners/",
    }),
  }),
});

export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,

  // Products
  useGetProductsQuery,
  useGetSearchProductsQuery,
  useGetBrandsQuery,
  useGetProductBySlugQuery,
  useGetRelatedProductsQuery,
  useGetFeaturedProductsQuery,
  useGetRecentProductsQuery,
  useGetTrendingProductsQuery,
  useGetTopRatedProductsQuery,
  useGetPopularProductsQuery,
  useGetBestSellingProductsQuery,

  // Blogs
  useGetBlogsQuery,

  // Goals
  useGetGoalsQuery,

  // Categories
  useGetCategoriesQuery,
  useGetFeaturedBannerQuery,
} = productsApi;