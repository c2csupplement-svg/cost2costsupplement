import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loaded: false,
  trendProduct: null,
  featuredProduct: null,
  topRelateProduct: null,
  popularProduct: null,
  topSellingProduct: null,
  productCateogry: null,
  recentProduct:null,
  comboProduct: null,
  goal: null,
  brands: null,
  error: null,
};

const productAdReducer = createSlice({
  name: "productAd",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },

    setTrendProduct: (state, action) => {
      state.trendProduct = action.payload;
    },

    setFeaturedProduct: (state, action) => {
      state.featuredProduct = action.payload;
    },

    setTopRelateProduct: (state, action) => {
      state.topRelateProduct = action.payload;
    },

    setPopularProduct: (state, action) => {
      state.popularProduct = action.payload;
    },

    setTopSellingProduct: (state, action) => {
      state.topSellingProduct = action.payload;
    },

    setProductCategory: (state, action) => {
      state.productCateogry = action.payload;
    },

    setRecentProduct: (state, action) => {
      state.recentProduct = action.payload
    },

    setGoal: (state, action) => {
      state.goal = action.payload;
    },

    setBrands: (state, action) => {
      state.brands = action.payload;
    },

    setComboProduct: (state, action ) => {
      state.comboProduct = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearProductAd: (state) => {
      state.loading = false;
      state.loaded = false;
      state.trendProduct = null;
      state.featuredProduct = null;
      state.topRelateProduct = null;
      state.popularProduct = null;
      state.topSellingProduct = null;
      state.recentProduct = null;
      state.goal = null;
      state.productCateogry = null;
      state.brands = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLoaded,
  setTrendProduct,
  setFeaturedProduct,
  setTopRelateProduct,
  setPopularProduct,
  setTopSellingProduct,
  setRecentProduct,
  setError,
  clearProductAd,
  setGoal,
  setProductCategory,
  setBrands,
  setComboProduct
} = productAdReducer.actions;

export default productAdReducer.reducer;