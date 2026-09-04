"use client"

import {
  setLoading,
  setProducts,
  setError,
} from "./cartSlice";

import {
  addToCartApi,
  getCartItem,
  updateItemQuantityApi,
  deleteCartItemApi,
  clearCartApi,
} from "./cartApi";

import { toast } from "sonner";

let fetchCartPromise = null;

export const addToCart = (product) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await addToCartApi(product);

    dispatch(setProducts(response.data));

    toast.success(
      "Added to cart!"
    );

    return response.data;
  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add item to cart"
      )
    );

    toast.error(
      "Failed to add item to cart"
    );

    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchCartItems =
  (refresh = false) => async (dispatch, getState) => {
    const { products } = getState().product;

    if (!refresh && products?.cart?.items) {
      return products;
    }

    if (fetchCartPromise) {
      return fetchCartPromise;
    }

    fetchCartPromise = (async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        const response = await getCartItem();

        dispatch(setProducts(response.data));

        return response.data;
      } catch (err) {
        dispatch(
          setError(
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch cart"
          )
        );

        throw err;
      } finally {
        dispatch(setLoading(false));
        fetchCartPromise = null;
      }
    })();

    return fetchCartPromise;
  };

export const updateItemQuantity = (itemId, quantity) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await updateItemQuantityApi(
      itemId,
      quantity
    );

    dispatch(setProducts(response.data));

    return response.data;
  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update cart"
      )
    );

    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteCartItem =
  (itemId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await deleteCartItemApi(itemId);

      dispatch(setProducts(response.data));

      toast.success(
        "Item removed from cart successfully!"
      );

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to remove item from cart."
        )
      );

      toast.error(
        "Failed to remove item from cart."
      );

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const clearCart = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await clearCartApi();

    dispatch(setProducts(response.data));

    return response.data;
  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to clear cart"
      )
    );

    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};