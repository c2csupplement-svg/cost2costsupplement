import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendContactMessageApi = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/contact`, data);

  return response.data;
};
