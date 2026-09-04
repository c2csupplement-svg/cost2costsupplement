import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthConfig = () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  return {
    withCredentials: true,
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  };
};

const handleApiError = (err, operation) => {
  if (err.response) {
    console.error(
      `${operation} - Server Error:`,
      err.response.status
    );
    console.error(
      `${operation} - Response:`,
      err.response.data
    );
  } else if (err.request) {
    console.error(
      `${operation} - No response received from server.`
    );
  } else {
    console.error(
      `${operation} - Request Error:`,
      err.message
    );
  }
};

const getWishItemApi = async () => {
  try {

    const response = await axios.get(
      `${API_BASE_URL}/wishlist`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Get wishlist");
    throw err;
  }
};

const toggleItemApi = async (
  productId,
  variantId,
  flavour,
  size
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/wishlist/toggle`,
      {
        product: productId,
        variantId,
        flavour,
        size,
      },
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Toggle wishlist");
    throw err;
  }
};

const deleteWishItemApi = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/wishlist/${productId}`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Delete wishlist item");
    throw err;
  }
};

const clearWishListApi = async () => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/wishlist`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Clear wishlist");
    throw err;
  }
};

const moveToCartApi = async (productId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/wishlist/move-to-cart/${productId.productId}`,
      {
        variantId:productId.variantId,
        quantity: productId.quantity || 1,
      },
      getAuthConfig()
    );


    return response;
  } catch (err) {
    handleApiError(err, "Move wishlist item to cart");
    throw err;
  }
};

export {
  deleteWishItemApi,
  clearWishListApi,
  getWishItemApi,
  toggleItemApi,
  moveToCartApi,
};