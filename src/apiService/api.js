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

        console.log(response.data);
        
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

        console.log(response.data);

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