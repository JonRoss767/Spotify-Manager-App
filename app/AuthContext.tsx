"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAuthCode,
  redirectToAuthCodeFlow,
  getAccessToken,
  clientId,
  refreshAccessToken, // We'll assume you have a helper to refresh the token.
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

const getStoredToken = () => {
  return localStorage.getItem("access_token");
};

const getStoredRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

const getStoredExpiresAt = () => {
  return localStorage.getItem("expires_at");
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh the token if expired
  const refreshToken = async () => {
    const refresh_token = getStoredRefreshToken();
    const expiresAt = getStoredExpiresAt();

    if (
      !refresh_token ||
      !expiresAt ||
      Date.now() / 1000 < parseInt(expiresAt)
    ) {
      return;
    }

    try {
      setLoading(true);
      const refreshedTokenData = await refreshAccessToken(refresh_token);
      setToken(refreshedTokenData.access_token);
      localStorage.setItem("access_token", refreshedTokenData.access_token);
      localStorage.setItem(
        "expires_at",
        (Date.now() / 1000 + refreshedTokenData.expires_in).toString()
      );

      return refreshedTokenData.access_token;
    } catch (err: any) {
      setError("Failed to refresh token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function handleAuth() {
      const storedToken = getStoredToken();

      if (storedToken) {
        const expiresAt = getStoredExpiresAt();
        if (expiresAt && Date.now() / 1000 < parseInt(expiresAt)) {
          setToken(storedToken);
          setLoading(false);
          return;
        } else {
          await refreshToken();
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
        const token = await getAccessToken(clientId, code);
        setToken(token);
        localStorage.setItem("access_token", token);
        localStorage.setItem(
          "expires_at",
          (Date.now() / 1000 + 3600).toString()
        ); // Assuming token expires in 1 hour
      } catch (err: any) {
        setError(err.message || "Failed to fetch token");
      } finally {
        setLoading(false);
      }
    }

    handleAuth();
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
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
