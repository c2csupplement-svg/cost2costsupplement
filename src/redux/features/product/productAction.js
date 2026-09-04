import {
  setLoading,
  setLoaded,
  setProductList,
  setError,
} from "./productSlice";

import getProductApi, {
  getProductFilterApi,
} from "./productApi";

const requestPromises = new Map();

const normalizeFilters = (filters = {}) => {
  return Object.fromEntries(
    Object.entries(filters)
      .filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          value !== ""
      )
      .sort(([a], [b]) => a.localeCompare(b))
  );
};

const createRequestKey = (filters = {}, page = 1,limit = 20) => {
  return JSON.stringify({
    filters: normalizeFilters(filters),
    page,
    limit,
  });
};

export const getProduct = (page = 1, limit = 20) => async (dispatch, getState) => {
    const productState = getState().products;

    if (!productState) {
      console.error(
        "Product reducer is not registered in the Redux store."
      );
      return;
    }

    const requestKey = createRequestKey({}, page, limit);

    if (requestPromises.has(requestKey)) {
      return requestPromises.get(requestKey);
    }

    const request = (async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data = await getProductApi(page, limit);

        dispatch(setProductList(data));
        dispatch(setLoaded(true));

        return data;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch products";

        console.error("getProduct:", error);

        dispatch(setError(message));
        dispatch(setLoaded(false));

        throw error;
      } finally {
        requestPromises.delete(requestKey);
        dispatch(setLoading(false));
      }
    })();

    requestPromises.set(requestKey, request);

    return request;
  };

export const getProductFilter =(filters = {}, page = 1, limit = 20) => async (dispatch, getState) => {
    const productState = getState().products;

    if (!productState) {
      console.error(
        "Product reducer is not registered in the Redux store."
      );
      return;
    }

    const normalizedFilters = normalizeFilters(filters);

    const requestKey = createRequestKey(
      normalizedFilters,
      page,
      limit
    );

    if (requestPromises.has(requestKey)) {
      return requestPromises.get(requestKey);
    }

    const request = (async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const data = await getProductFilterApi(
          normalizedFilters,
          page,
          limit
        );

        dispatch(setProductList(data));
        dispatch(setLoaded(true));

        return data;
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch filtered products";

        console.error("getProductFilter:", error);

        dispatch(setError(message));
        dispatch(setLoaded(false));

        throw error;
      } finally {
        requestPromises.delete(requestKey);
        dispatch(setLoading(false));
      }
    })();

    requestPromises.set(requestKey, request);

    return request;
  };