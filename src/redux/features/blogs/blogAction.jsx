import {
  setBlog,
  setLoaded,
  setLoading,
  setError,
} from "./blogSlice";

import { getBlog } from "./blogApi";

let fetchBlogPromise = null;

export const getAllBlogs = () => async (dispatch, getState) => {
  const blogState = getState().blog;

  if (!blogState) {
    console.error(
      "Blog reducer is not registered in the Redux store."
    );
    return;
  }

  const { loaded, loading } = blogState;

  if (loaded || loading) {
    return;
  }

  if (fetchBlogPromise) {
    return fetchBlogPromise;
  }

  fetchBlogPromise = (async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getBlog();

      dispatch(setBlog(data));
      dispatch(setLoaded(true));

      return data;
    } catch (error) {
      console.error("getAllBlogs:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch blogs"
        )
      );

      dispatch(setLoaded(false));

      throw error;
    } finally {
      dispatch(setLoading(false));
      fetchBlogPromise = null;
    }
  })();

  return fetchBlogPromise;
};