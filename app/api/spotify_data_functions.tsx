"use client";
// ----imports----
import { refreshAccessToken, redirectToAuthCodeFlow } from "./spotify_api";
// ----interfaces----

export interface Profile {
  display_name: string;
  id: string;
  email: string;
  images?: { url: string; height?: number; width?: number }[];
  external_urls?: { spotify: string };
  uri: string;
  country?: string;
  explicit_content?: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  followers?: {
    href: string | null;
    total: number;
  };
  href?: string;
  product?: string;
  type?: string;
}

// ----authentication helper functions----
export function isLoggedIn() {
  const access_token = sessionStorage.getItem("access_token");
  if (!access_token || access_token === "undefined") {
    return false;
  }
  return true;
}

export async function checkAuth() {
  console.log("checkAuth called");
  const { access_token, refresh_token, expiration_time } = getAllAuthData();
  console.log("access_token = " + access_token);
  if (
    !access_token ||
    !refresh_token ||
    !expiration_time ||
    access_token === "undefined"
  ) {
    console.log("accessToken not found! Calling handleAuth...");
    await handleAuth();
    console.log("finished handleAuth");
  }
}

export async function checkAndRefreshToken() {
  await checkAuth();

  const expiration_time = sessionStorage.getItem("expiration_time");
  const refresh_token = sessionStorage.getItem("refresh_token");

  if (
    expiration_time &&
    refresh_token &&
    Date.now() > Number(expiration_time)
  ) {
    console.log("Access token expired. Refreshing...");
    try {
      const newTokenData = await refreshAccessToken(refresh_token);

      const {
        access_token: new_access_token,
        refresh_token: new_refresh_token,
        expires_in: new_expires_in,
      } = newTokenData;

      const newExpirationTime = Date.now() + new_expires_in * 1000;
      sessionStorage.setItem("access_token", new_access_token);
      sessionStorage.setItem("refresh_token", new_refresh_token);
      sessionStorage.setItem("expiration_time", newExpirationTime.toString());

      console.log("Access token successfully refreshed.");
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }
}

export function getAllAuthData() {
  const access_token = sessionStorage.getItem("access_token");
  const refresh_token = sessionStorage.getItem("refresh_token");
  const expiration_time = sessionStorage.getItem("expiration_time");
  return { access_token, refresh_token, expiration_time };
}

export function getStoredAccessToken() {
  const access_token = sessionStorage.getItem("access_token");
  if (access_token && access_token !== "undefined") {
    return access_token;
  }
  checkAuth();
  return getStoredAccessToken();
}

export async function handleAuth() {
  try {
    console.log("Starting authentication...");
    console.log("Calling redirectToAuthCodeFlow");
    await redirectToAuthCodeFlow();
    console.log("finished redirectToAuthCodeFlow");
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

// ----spotify data functions----

export async function fetchProfile(): Promise<Profile> {
  const token = getStoredAccessToken();
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized - Token may be expired");
    } else if (response.status === 403) {
      throw new Error("403 Forbidden");
    }
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
}

export function logout() {
  sessionStorage.clear();

  // Redirect to the login page
  window.location.href = "/login";
}

export async function fetchSavedTracks(limit = 50, offset = 0) {
  const token = getStoredAccessToken();
  const url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch saved tracks: ${response.statusText}`);
  }

  return response.json();
}
