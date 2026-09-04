import {
  setLoading,
  setWishList,
  setError,
} from "./wishSlice.js";

import {
  deleteWishItemApi,
  clearWishListApi,
  getWishItemApi,
  toggleItemApi,
  moveToCartApi,
} from "./wishApi.js";

import { fetchCartItems } from "../cart/cartActions.jsx";
import { toast } from "sonner";

let fetchWishPromise = null;

export const getWishItem = () => async (dispatch, getState) => {
  const { wishItems, loading } = getState().wish;

  if (wishItems?.wishlist || loading) {
    return wishItems;
  }

  if (fetchWishPromise) {
    return fetchWishPromise;
  }

  fetchWishPromise = (async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await getWishItemApi();

      dispatch(setWishList(response.data));

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch wishlist"
        )
      );

      throw err;
    } finally {
      dispatch(setLoading(false));
      fetchWishPromise = null;
    }
  })();

  return fetchWishPromise;
};

export const toggleItem =(productId, variantId, flavour, size) =>
  async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const toggleResponse = await toggleItemApi(
        productId,
        variantId,
        flavour,
        size
      );

      if (!toggleResponse.data.success) {
        toast.error(toggleResponse.data.message);
        return toggleResponse.data;
      }

      const response = await getWishItemApi();

      dispatch(setWishList(response.data));

      toast.success(
        toggleResponse.data.inWishlist
          ? "Added to Wishlist"
          : "Removed from Wishlist"
      );

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to toggle wishlist"
        )
      );

      toast.error("Failed to Toggle Item in Wishlist");

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const deleteWishItem =(productId) => async (dispatch) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await deleteWishItemApi(productId);

      const response = await getWishItemApi();

      dispatch(setWishList(response.data));

      toast.success(
        "Item removed from wishlist successfully!"
      );

      return response.data;
    } catch (err) {
      dispatch(
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete wishlist item"
        )
      );

      toast.error(
        "Failed to remove item from wishlist"
      );

      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

export const clearWishList = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    const response = await clearWishListApi();

    dispatch(setWishList(response.data));

    return response.data;
  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to clear wishlist"
      )
    );

    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};

export const moveToCart = (productId,variantId, quantity) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));

    await moveToCartApi(productId,variantId, quantity);

    const wishResponse = await getWishItemApi();
    dispatch(setWishList(wishResponse.data));

    await dispatch(fetchCartItems(true));

    toast.success("Item added to cart successfully!");

    return true;
  } catch (err) {
    dispatch(
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to move item to cart"
      )
    );

    toast.error("Failed to add item to cart");

    throw err;
  } finally {
    dispatch(setLoading(false));
  }
};