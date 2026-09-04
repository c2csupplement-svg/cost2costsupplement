import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    wishItems : {},
    loading: false,
    error: ""
}

const wishReducer = createSlice({
    name: "wish",
    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setWishList: (state, action) => {
            state.wishItems = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
})

export const {
    setLoading,
    setWishList,
    setError
} = wishReducer.actions;

export default wishReducer.reducer;