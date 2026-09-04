import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBlog = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/blogs/`);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error Status:", error.response.status);
      console.error("Response:", error.response.data);
    } else if (error.request) {
      console.error("No response received from server");
    } else {
      console.error("Error:", error.message);
    }

    throw error;
  }
};