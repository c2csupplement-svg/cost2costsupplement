import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bannerList: {},
  featuredBannerList: {},
  loading: false,
  loaded: false,
  error: null,
};

const bannerReducer = createSlice({
  name: "banner",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setBanners: (state, action) => {
      state.bannerList = action.payload;
    },

    setFeaturedBanner: (state, action) => {
      state.featuredBannerList = action.payload;
    },

    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoading,
  setBanners,
  setFeaturedBanner,
  setLoaded,
  setError,
} = bannerReducer.actions;

export default bannerReducer.reducer;