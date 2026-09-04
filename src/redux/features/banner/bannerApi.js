import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBannersApi = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/banners`);

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Error Status:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received from server");
    } else {
      console.error("Error:", err.message);
    }

    throw err;
  }
};

export const getFeaturedBannerApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/featured-banners/`
    );

    return response.data;
  } catch (err) {
    if (err.response) {
      console.error("Error Status:", err.response.status);
      console.error("Response:", err.response.data);
    } else if (err.request) {
      console.error("No response received from server");
    } else {
      console.error("Error:", err.message);
    }

    throw err;
  }
};