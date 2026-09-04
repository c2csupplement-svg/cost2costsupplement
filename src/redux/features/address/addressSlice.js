import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    addressData : null,
    error: null
}

const addressReducer = createSlice({
    name:"address",
    initialState,

    reducers:{
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setAddress: (state, action) => {
            state.addressData = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
});

export const {setLoading, setAddress, setError} = addressReducer.actions;

export default addressReducer.reducer