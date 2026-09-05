import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getFeaturedProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/featured`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getTrendingProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/trending`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getTopRelatedProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/top-rated`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getRecentProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/recent`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getPopularProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/popular`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getTopSellingProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/top-selling`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getGoalApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/goals`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getProductCategoryApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/category`
    );


    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};

export const getBrandsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/brands`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};


export const getComboProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products/combo`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server.");
    } else {
      console.error("Request Error:", error.message);
    }

    throw error;
  }
};