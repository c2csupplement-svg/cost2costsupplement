import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    profileDetails: null,
    error:null
}


const profileReducer = createSlice({
    name: "profileDetails",
    initialState,

    reducers:{
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setProfile: (state, action) => {
            state.profileDetails = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        }
    }
});

export const {setLoading, setProfile, setError} = profileReducer.actions;

export default profileReducer.reducer;