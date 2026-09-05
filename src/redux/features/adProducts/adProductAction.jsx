import {
  setLoading,
  setLoaded,
  setTrendProduct,
  setFeaturedProduct,
  setTopRelateProduct,
  setPopularProduct,
  setTopSellingProduct,
  setError,
  setGoal,
  setProductCategory,
  setBrands,
  setRecentProduct,
  setComboProduct
} from "./adProductSlice";

import {
  getFeaturedProductsApi,
  getPopularProductsApi,
  getTopRelatedProductsApi,
  getTopSellingProductsApi,
  getTrendingProductsApi,
  getGoalApi,
  getProductCategoryApi,
  getBrandsApi,
  getRecentProductsApi,
  getComboProductsApi
} from "./adProductApi";

let fetchProductPromise = null;

export const getAllProductAds = () => async (dispatch, getState) => {
  const productAdState = getState().productAd;

  if (!productAdState) {
    console.error(
      "Product ad reducer is not registered in the Redux store."
    );
    return;
  }

  const { loaded, loading } = productAdState;

  if (loaded || loading) {
    return;
  }

  if (fetchProductPromise) {
    return fetchProductPromise;
  }

  fetchProductPromise = (async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const [
        featuredResponse,
        popularResponse,
        relatedResponse,
        sellingResponse,
        trendingResponse,
        goalResponse,
        productCategoryResponse,
        brandsResponse,
        recentProductResponse,
        comboProductResponse
      ] = await Promise.all([
        getFeaturedProductsApi(),
        getPopularProductsApi(),
        getTopRelatedProductsApi(),
        getTopSellingProductsApi(),
        getTrendingProductsApi(),
        getGoalApi(),
        getProductCategoryApi(),
        getBrandsApi(),
        getRecentProductsApi(),
        getComboProductsApi()
      ]);

      dispatch(setFeaturedProduct(featuredResponse));
      dispatch(setPopularProduct(popularResponse));
      dispatch(setTopRelateProduct(relatedResponse));
      dispatch(setTopSellingProduct(sellingResponse));
      dispatch(setTrendProduct(trendingResponse));
      dispatch(setGoal(goalResponse));
      dispatch(setProductCategory(productCategoryResponse));
      dispatch(setBrands(brandsResponse));
      dispatch(setRecentProduct(recentProductResponse));
      dispatch(setComboProduct(comboProductResponse))
      dispatch(setLoaded(true));

      return true;
    } catch (error) {
      console.error("getAllProductAds:", error);

      dispatch(
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch products"
        )
      );

      dispatch(setLoaded(false));

      throw error;
    } finally {
      dispatch(setLoading(false));
      fetchProductPromise = null;
    }
  })();

  return fetchProductPromise;
};