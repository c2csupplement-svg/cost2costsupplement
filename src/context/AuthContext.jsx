"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("authUser");

      setToken(storedToken || null);

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("authUser");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      localStorage.removeItem("rememberMe");

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (authData) => {
    const newToken = authData?.token;
    const newUser = authData?.user ?? null;

    if (!newToken) {
      throw new Error("Authentication token is missing.");
    }

    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);

    if (newUser) {
      localStorage.setItem("authUser", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("authUser");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    localStorage.removeItem("rememberMe");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    loginUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}