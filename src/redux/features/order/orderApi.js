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
        Authorization: `Bearer ${token}`,
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

const getOrderApi = async () => {
    try{
        const response = await axios.get(
            `${API_BASE_URL}/orders`,
           getAuthConfig()
    );



      return response;  
    }
    catch(err){
        handleApiError(err, "Get Order");
    }
}

const orderCancelApi = async (id) => {
    try{
        const response = await axios.put(
            `${API_BASE_URL}/orders/${id}/cancel`,
            {},
            getAuthConfig(),
        );
        return response;
    }
    catch(err){
        handleApiError(err, "Cancel Order");
    }
}

export {getOrderApi, orderCancelApi}