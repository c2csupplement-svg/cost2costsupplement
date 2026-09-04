import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const getProductApi = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`, {
      params: {
        page,
        limit,
      },
    });

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Server Error:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", err.message);
    }

    throw err;
  }
};

export const getProductFilterApi = async (
  filters = {},
  page = 1,
  limit = 20
) => {
  try {
    const params = {
      page,
      limit,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        params[key] = value;
      }
    });

    const response = await axios.get(`${API_BASE_URL}/products`, {
      params,
    });

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Server Error:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", err.message);
    }

    throw err;
  }
};

export const getProductBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/${slug}`
    );

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Server Error:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", err.message);
    }

    throw err;
  }
};

export default getProductApi;