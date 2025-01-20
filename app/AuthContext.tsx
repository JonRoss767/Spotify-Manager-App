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
} from "./api/spotify_api";

interface AuthContextType {
  token: string | null;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuth() {
      const code = getAuthCode();
      if (!code) {
        redirectToAuthCodeFlow(clientId);
        return;
      }

      try {
        setLoading(true);
        const token = await getAccessToken(clientId, code);
        setToken(token);
      } catch (err: any) {
        setError(err.message || "Failed to fetch token");
      } finally {
        setLoading(false);
      }
    }

    handleAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ token, error, loading }}>
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
