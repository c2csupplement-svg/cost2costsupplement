import {
  setLoading,
  setBanners,
  setError,
  setFeaturedBanner,
  setLoaded,
} from "./bannerSlice.js";

import {
  getBannersApi,
  getFeaturedBannerApi,
} from "./bannerApi.js";

let fetchBannerPromise = null;

export const getBanner = () => async (dispatch, getState) => {
  const bannerState = getState().banners;

  if (!bannerState) {
    console.error(
      "Banner reducer is not registered in the Redux store."
    );
    return;
  }

  const { loaded, loading } = bannerState;

  if (loaded || loading) {
    return;
  }

  if (fetchBannerPromise) {
    return fetchBannerPromise;
  }

  fetchBannerPromise = (async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const [
        bannerResponse,
        featuredResponse,
      ] = await Promise.all([
        getBannersApi(),
        getFeaturedBannerApi(),
      ]);

      dispatch(setBanners(bannerResponse));
      dispatch(setFeaturedBanner(featuredResponse));
      dispatch(setLoaded(true));

      return {
        bannerList: bannerResponse,
        featuredBanner: featuredResponse,
      };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch banners";

      dispatch(setError(errorMessage));
      dispatch(setLoaded(false));

      console.error("getBanner:", err);

      throw err;
    } finally {
      dispatch(setLoading(false));
      fetchBannerPromise = null;
    }
  })();

  return fetchBannerPromise;
};