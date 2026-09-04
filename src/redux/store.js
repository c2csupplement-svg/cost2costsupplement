import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import productReducer from "./features/product/productSlice";
import wishCartReducer from "./features/wish/wishSlice";
import profileReducer from "./features/profile/profileSlice";
import addressReducer from "./features/address/addressSlice";
import orderReducer from "./features/order/orderSlice";
import bannerReducer from "./features/banner/bannerSlice";
import productAdReducer from "./features/adProducts/adProductSlice";
import blogReducer from "./features/blogs/blogSlice";

export const store = configureStore({
  reducer: {
    product: cartReducer,
    products: productReducer,
    wish: wishCartReducer,
    profile: profileReducer,
    address: addressReducer,
    order: orderReducer,
    banners: bannerReducer,
    productAd: productAdReducer,
    blog: blogReducer,
  },
});