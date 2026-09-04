import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: {},
    loading: false,
    error: null
}

const cartReducer = createSlice({
    name: "product",
    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    }
});

export const {
    setLoading,
    setProducts,
    setError,
} = cartReducer.actions;

export default cartReducer.reducer;

