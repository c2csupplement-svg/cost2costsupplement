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

const addToCartApi = async (product) => {
  try {

    const response = await axios.post(
      `${API_BASE_URL}/cart`,
      product,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Add to cart");
    throw err;
  }
};

const getCartItem = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/cart/`,
      getAuthConfig()
    );
    
    return response;
  } catch (err) {
    handleApiError(err, "Get cart");
    throw err;
  }
};

const updateItemQuantityApi = async (itemId, quantity) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/cart/${itemId}`,
      { quantity },
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Update cart quantity");
    throw err;
  }
};

const deleteCartItemApi = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cart/${id}`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Delete cart item");
    throw err;
  }
};

const clearCartApi = async () => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/cart`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Clear cart");
    throw err;
  }
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

export {
  addToCartApi,
  getCartItem,
  updateItemQuantityApi,
  clearCartApi,
  deleteCartItemApi,
};