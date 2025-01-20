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
      throw new Error("Unauthorized - Token may be expired");
    }
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
}

export default function UserPage() {
  const {
    token,
    refreshAccessToken,
    error: authError,
    loading: authLoading,
    logout,
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

        const profileData = await fetchProfile(token);
        setProfile(profileData);
        localStorage.setItem("profile", JSON.stringify(profileData)); // Cache the profile
      } catch (err: unknown) {
        console.error(err);

        if ((err as Error).message === "Unauthorized - Token may be expired") {
          try {
            await refreshAccessToken(); // Use refresh token from context

            // Retrieve updated token from AuthContext
            const updatedToken = localStorage.getItem("access_token");
            if (!updatedToken) {
              throw new Error("Token refresh failed. Please log in again.");
            }

            const profileData = await fetchProfile(updatedToken); // Retry fetching with the new token
            setProfile(profileData);
            localStorage.setItem("profile", JSON.stringify(profileData)); // Cache the profile
          } catch (refreshError) {
            console.error(refreshError);
            setError("Failed to refresh the token. Please log in again.");
            logout(); // Log out the user if the refresh fails
          }
        } else {
          setError("Failed to fetch profile data");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, refreshAccessToken, logout]);

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
