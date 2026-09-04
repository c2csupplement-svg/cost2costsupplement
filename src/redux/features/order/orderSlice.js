import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    orderLists: null,
    error: null
}

const orderReducer = createSlice({
    name: "orderList",
    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setOrderList: (state, action) => {
            state.orderLists = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
});

export const { setLoading, setOrderList, setError } = orderReducer.actions;

export default orderReducer.reducer;