import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBrandBySlug = async (slug, page=1, limit=20) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/brands/${slug}/products`,
            {
                params:{
                    page,
                    limit
                }
            }
        );

        
        return response.data
    }
    catch (err) {
        if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.err("err:", err.message);
        }

        throw err;
    }
}

export const getCategoryBySlug = async (slug, page=1, limit=20) => {
    try{
        const category = await axios.get(
            `${API_BASE_URL}/category/${slug}/products`,
            {
                params:{
                    page,
                    limit
                }
            }
        );

        return category.data
    }
    catch(err){
        if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.error("err:", err.message);
        }

        throw err;
    }
}

export const getProductSearchApi = async (query) => {
    try{
        

        const response = await axios.get(`${API_BASE_URL}/products/search?q=${query}`);

        return response.data
    }
    catch(err){
        if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.error("err:", err.message);
        }

        throw err;
    }
}

export const getProductByGoal = async (query) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/getGoals/${query}/products`);

        return response.data
    }
    catch(err){
         if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.error("err:", err.message);
        }

        throw err;
    }
}

export const getBlogBySlug = async (query) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/blogs/${query}`);


        return response.data
    }
    catch(err){
         if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.error("err:", err.message);
        }

        throw err;
    }
}

export const getRelateProduct = async (query) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/products/${query}/related`);

        return response.data
    }
    catch(err){
         if (err.response) {
            console.err("err Status:", err.response.status);
            console.err("Response:", err.response.data);
        } else if (err.request) {
            console.err("No response received from server");
        } else {
            console.error("err:", err.message);
        }

        throw err;
    }
}

export const addReviewApi = async (review) => {
    try {
        const token = localStorage.getItem("token")

        const response = await axios.post(
            `${API_BASE_URL}/reviews`,
            review,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multiple/form-data",
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response
    }
    catch (err) {
        if (err.response) {
            console.error("Server Error:", err.response.status);
            console.error("Response:", err.response);
        } else if (err.request) {
            console.error("No response received from server.");
        } else {
            console.error("Request Error:", err.message);
        }

        return err.response
    }
}

export const couponApi = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/coupons`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );


        return response

    }
    catch (err) {
        if (err.response) {
            console.error("Server Error:", err.response.status);
            console.error("Response:", err.response.data)
        }
        else if (err.request) {
            console.error("No response received from server.");
        }
        else {
            console.error("Request error:", err.message);
        }

        return err.response
    }
}

export const appplyCouponApi = async (couponCode) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/cart/apply-coupon`,
            { code: couponCode },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        return response
    }
    catch (err) {
        if (err.response) {
            console.error("Server Error:", err.response.status);
            console.error("Response:", err.response.data)
        } else if (err.request) {
            console.error("No response received from server.");
        }
        else {
            console.error("Request error:", err.message);
        }

        return err.response
    }
}

export const removeCouponApi = async () => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/cart/remove-coupon`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        return response
    }
    catch (err) {
        if (err.response) {
            console.error("Server Error:", err.response.status);
            console.error("Response:", err.response.data)
        } else if (err.request) {
            console.error("No response received from server.");
        }
        else {
            console.error("Request error:", err.message);
        }

        return err.response
    }
}

export const createRazorpayOrderApi = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/payment/create-order`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        return response
    }
    catch (err) {
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
}

export const verifyPaymentApi = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/payment/verify`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );

        return response
    }
    catch (err) {
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
}

export const buyNowApi = async (data) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/payment/buy-now`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        );



        return response
    }
    catch (err) {
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
}