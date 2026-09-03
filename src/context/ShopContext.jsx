"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { showToast } = useToast();
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved cart + wishlist
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("c2c-cart");
      const savedWishlist = localStorage.getItem("c2c-wishlist");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load shop data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("c2c-cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

  // Save wishlist
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "c2c-wishlist",
      JSON.stringify(wishlist)
    );
  }, [wishlist, isLoaded]);

  // -----------------------------
  // CART
  // -----------------------------

const addToCart = (product, quantity = 1) => {
  setCart((currentCart) => {
    const existingProduct = currentCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      return currentCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
            }
          : item
      );
    }

    return [
      ...currentCart,
      {
        ...product,
        quantity,
      },
    ];
  });

  // Outside setCart — this is important
  showToast(
    `Added product ${product.name} to cart successfully!`
  );
};


const removeFromCart = (productId) => {
  // Find the product BEFORE updating state
  const product = cart.find(
    (item) => item.id === productId
  );

  // Update cart
  setCart((currentCart) =>
    currentCart.filter(
      (item) => item.id !== productId
    )
  );

  // Toast is OUTSIDE setCart
  if (product) {
    showToast(
      `Removed product ${product.name} from cart.`
    );
  }
};

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // -----------------------------
  // WISHLIST
  // -----------------------------

  const addToWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const alreadyExists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return currentWishlist;
      }
      
      return [...currentWishlist, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((currentWishlist) =>
      currentWishlist.filter((item) => item.id !== productId)
    );
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.some(
      (item) => item.id === product.id
    );

    if (exists) {
      removeFromWishlist(product.id);
        showToast(
      `Removed product ${product.name} from wishlist.`,
      "wishlist"
    );
    } 
    else {
      addToWishlist(product);
          showToast(
      `Added product ${product.name} to wishlist successfully!`,
      "wishlist"
    );
    }
    
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // -----------------------------
  // TOTALS
  // -----------------------------

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const wishlistCount = wishlist.length; 

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,

        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,

        cartCount,
        cartTotal,
        wishlistCount
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);

  if (!context) {
    throw new Error(
      "useShop must be used inside ShopProvider"
    );
  }

  return context;
}