"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  getAuthCode,
  redirectToAuthCodeFlow,
  getAccessToken,
  clientId,
  refreshAccessToken,
} from "./api/spotify_api";

interface AuthContextType {
  token: string | null;
  error: string | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number; // Time in seconds before the access token expires
}

// Client-side storage helper functions with window check
const getStoredItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null; // Returns null on the server side
};

const setStoredItem = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const removeStoredItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    getStoredItem("access_token")
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshToken = useCallback(async () => {
    const refresh_token = getStoredItem("refresh_token");
    const expiresAt = getStoredItem("expires_at");

    // Check if refresh_token exists and if the token has expired
    if (
      !refresh_token ||
      !expiresAt ||
      Date.now() / 1000 >= parseInt(expiresAt)
    ) {
      return;
    }

    try {
      setLoading(true);
      const refreshedTokenData = await refreshAccessToken(refresh_token);
      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = refreshedTokenData;

      // Update state and localStorage with the new tokens and expiration time
      setToken(access_token);
      setStoredItem("access_token", access_token);
      setStoredItem("refresh_token", newRefreshToken);
      setStoredItem("expires_at", (Date.now() / 1000 + expires_in).toString());
    } catch (err: unknown) {
      setError("Failed to refresh token");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuth = useCallback(async () => {
    const storedToken = getStoredItem("access_token");

    // If there's already a valid access token, check expiration
    if (storedToken) {
      const expiresAt = getStoredItem("expires_at");
      if (expiresAt && Date.now() / 1000 < parseInt(expiresAt)) {
        setToken(storedToken);
        setLoading(false);
        return;
      } else {
        // If the token is expired, refresh it
        await refreshToken();
        return;
      }
    }

    // If no access token, try to authenticate via authorization code flow
    const code = getAuthCode();
    if (!code) {
      redirectToAuthCodeFlow(clientId);
      return;
    }

    try {
      setLoading(true);
      const tokenData = await getAccessToken(clientId, code); // This should return both tokens
      const { access_token, refresh_token, expires_in } = tokenData;

      // Store both tokens and the expiration time
      setToken(access_token);
      setStoredItem("access_token", access_token);
      setStoredItem("refresh_token", refresh_token);
      setStoredItem("expires_at", (Date.now() / 1000 + expires_in).toString());
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to fetch token");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  const logout = () => {
    setToken(null);
    removeStoredItem("access_token");
    removeStoredItem("refresh_token");
    removeStoredItem("expires_at");
  };

  return (
    <AuthContext.Provider value={{ token, error, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
