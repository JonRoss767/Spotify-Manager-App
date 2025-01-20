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
  refreshAccessToken as spotifyRefreshAccessToken,
} from "./api/spotify_api";

interface AuthContextType {
  token: string | null;
  refresh_token: string | null;
  token_experation: number | null;
  error: string | null;
  loading: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const getStoredItem = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
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
  const [refreshToken, setRefreshToken] = useState<string | null>(
    getStoredItem("refresh_token")
  );
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(
    getStoredItem("expires_at") ? parseInt(getStoredItem("expires_at")!) : null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      console.warn("No refresh token available.");
      throw new Error("No refresh token available.");
    }

    try {
      setLoading(true);
      const refreshedTokenData = await spotifyRefreshAccessToken(refreshToken);
      const {
        access_token,
        refresh_token: newRefreshToken,
        expires_in,
      } = refreshedTokenData;

      const newExpiration = Date.now() / 1000 + expires_in;

      // Update state and local storage
      setToken(access_token);
      setRefreshToken(newRefreshToken || refreshToken);
      setTokenExpiration(newExpiration);

      setStoredItem("access_token", access_token);
      setStoredItem("refresh_token", newRefreshToken || refreshToken);
      setStoredItem("expires_at", newExpiration.toString());
    } catch (err) {
      console.error("Failed to refresh token:", err);
      setError("Failed to refresh token.");
      logout();
    } finally {
      setLoading(false);
    }
  }, [refreshToken]);

  const handleAuth = useCallback(async () => {
    const storedToken = getStoredItem("access_token");

    if (storedToken) {
      const expiresAt = getStoredItem("expires_at");
      if (expiresAt && Date.now() / 1000 < parseInt(expiresAt)) {
        setToken(storedToken);
        setLoading(false);
        return;
      }
    }

    const code = getAuthCode();
    if (!code) {
      redirectToAuthCodeFlow(clientId);
      return;
    }

    try {
      setLoading(true);
      const tokenData = await getAccessToken(clientId, code);
      const { access_token, refresh_token, expires_in } = tokenData;

      const newExpiration = Date.now() / 1000 + expires_in;

      setToken(access_token);
      setRefreshToken(refresh_token);
      setTokenExpiration(newExpiration);

      setStoredItem("access_token", access_token);
      setStoredItem("refresh_token", refresh_token);
      setStoredItem("expires_at", newExpiration.toString());
    } catch (err) {
      console.error("Authentication error:", err);
      setError((err as Error).message || "Failed to fetch token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setTokenExpiration(null);
    removeStoredItem("access_token");
    removeStoredItem("refresh_token");
    removeStoredItem("expires_at");
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        refresh_token: refreshToken,
        token_experation: tokenExpiration,
        error,
        loading,
        logout,
        refreshAccessToken,
      }}
    >
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
