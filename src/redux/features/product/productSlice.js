import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loaded: false,
  productList: null,
  product: null,
  error: null,
};

const productReducer = createSlice({
  name: "products",
  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },

    setProductList: (state, action) => {
      state.productList = action.payload;
    },

    setProduct: (state, action) => {
      state.product = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearProducts: (state) => {
      state.productList = null;
      state.product = null;
      state.loaded = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLoaded,
  setProductList,
  setProduct,
  setError,
  clearProducts,
} = productReducer.actions;

export default productReducer.reducer;