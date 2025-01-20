"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import SignInPrompt from "../components/SignInPrompt";
import Image from "next/image";

interface Profile {
  display_name: string;
  id: string;
  email: string;
  images?: { url: string }[];
  external_urls?: { spotify: string };
  uri: string;
}

async function fetchProfile(token: string): Promise<Profile> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access (expired token or invalid access)
      throw new Error("Unauthorized - Token may be expired");
    }
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
}

export default function UserPage() {
  const {
    token,
    error: authError,
    loading: authLoading,
    logout,
    refreshAccessToken,
  } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setError("No token found. Please authenticate.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const cachedProfile = localStorage.getItem("profile");

        if (cachedProfile) {
          setProfile(JSON.parse(cachedProfile)); // Use cached profile data
          setLoading(false);
          return;
        }

        // Fetch profile data
        const profileData = await fetchProfile(token);
        setProfile(profileData);
        localStorage.setItem("profile", JSON.stringify(profileData)); // Cache the profile
      } catch (err: unknown) {
        console.error(err);

        // If the error is due to token expiration, attempt to refresh the token
        if ((err as Error).message === "Unauthorized - Token may be expired") {
          try {
            // Try to refresh the token
            const refresh_token = localStorage.getItem("refresh_token");
            if (!refresh_token) {
              setError("No refresh token found. Please log in again.");
              setLoading(false);
              return;
            }

            const refreshedToken = await refreshAccessToken(refresh_token);
            localStorage.setItem("access_token", refreshedToken);
            setToken(refreshedToken); // Update token in the state
            // After refreshing the token, retry fetching the profile
            const profileData = await fetchProfile(refreshedToken);
            setProfile(profileData);
            localStorage.setItem("profile", JSON.stringify(profileData)); // Cache the profile
          } catch (refreshError) {
            setError("Failed to refresh the token. Please log in again.");
          }
        } else {
          setError("Failed to fetch profile data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, refreshAccessToken]);

  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  if (authError) {
    return (
      <div>
        <p>Error: {authError}</p>
        <SignInPrompt onSignIn={() => (window.location.href = "/login")} />
      </div>
    );
  }

  if (!token) {
    return <SignInPrompt onSignIn={() => (window.location.href = "/login")} />;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>Profile data is unavailable. Please try again later.</p>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Spotify Profile</h1>
      <section className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Logged in as {profile.display_name}
        </h2>
        {profile.images?.length ? (
          <Image
            src={profile.images[0].url}
            alt="Profile Avatar"
            className="w-40 h-40 rounded-full mb-4"
            width={160}
            height={160}
          />
        ) : (
          <div className="w-40 h-40 rounded-full mb-4 bg-gray-300 flex justify-center items-center">
            <span className="text-gray-600">No image</span>
          </div>
        )}
        <ul className="space-y-2 text-gray-600">
          <li>
            <span className="font-medium text-gray-700">User ID:</span>{" "}
            {profile.id}
          </li>
          <li>
            <span className="font-medium text-gray-700">Email:</span>{" "}
            {profile.email}
          </li>
          <li>
            <span className="font-medium text-gray-700">Spotify URI:</span>{" "}
            <a href={profile.uri} className="text-blue-500 hover:underline">
              {profile.uri}
            </a>
          </li>
          {profile.external_urls?.spotify && (
            <li>
              <span className="font-medium text-gray-700">Link:</span>{" "}
              <a
                href={profile.external_urls.spotify}
                className="text-blue-500 hover:underline"
              >
                Profile Link
              </a>
            </li>
          )}
        </ul>
        <button
          onClick={logout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Log Out
        </button>
      </section>
    </div>
  );
}
