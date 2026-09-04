import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  loaded: false,
  blog: null,
  error: null,
};

const blogReducer = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setLoaded: (state, action) => {
      state.loaded = action.payload;
    },

    setBlog: (state, action) => {
      state.blog = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setLoaded,
  setLoading,
  setBlog,
  setError,
} = blogReducer.actions;

export default blogReducer.reducer;