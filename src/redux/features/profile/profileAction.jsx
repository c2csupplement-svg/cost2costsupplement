import { setLoading, setProfile, setError } from "./profileSlice.js";
import { getProfileApi, updateProfileApi } from "./profileApi.js";

let fetchProfilePromise = null;

export const getProfile = () => async (dispatch, getState) => {
    const { profileDetails, loading } = getState().profile;

    if (profileDetails || loading) {
        return profileDetails;
    }

    if (fetchProfilePromise) {
        return fetchProfilePromise;
    }

    fetchProfilePromise = (async () => {
        try {
            dispatch(setLoading(true));

            const response = await getProfileApi();
            dispatch(setProfile(response.data));

            return response.data;
        }
        catch (err) {
            dispatch(setError(err.message));
            throw err;
        }
        finally {
            dispatch(setLoading(false));
            fetchProfilePromise = null;
        }
    })();

    return fetchProfilePromise;
};

export const updateProfile = (profile) => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const response = await updateProfileApi(profile);
        dispatch(setProfile(response.data));
    }
    catch (err) {
        dispatch(setError(err.message));
    }
    finally {
        dispatch(setLoading(false));
    }
};