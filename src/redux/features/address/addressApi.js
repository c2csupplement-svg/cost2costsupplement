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
      "Content-Type": "application/json",
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

const addressApi = async (address) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/address`,
      address,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Add address");
    throw err;
  }
};

const getAddressApi = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/address`,
      getAuthConfig()
    );


    return response;
  } catch (err) {
    handleApiError(err, "Get addresses");
    throw err;
  }
};

const updateAddressApi = async (id, address) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/address/${id}`,
      address,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Update address");
    throw err;
  }
};

const deleteAddressApi = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/address/${id}`,
      getAuthConfig()
    );

    return response;
  } catch (err) {
    handleApiError(err, "Delete address");
    throw err;
  }
};

export {
  addressApi,
  getAddressApi,
  updateAddressApi,
  deleteAddressApi,
};