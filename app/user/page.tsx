"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  isLoggedIn,
  checkAndRefreshToken,
  fetchProfile,
  Profile,
  logout,
} from "../api/spotify_data_functions";

function logoutPrompt() {
  if (window.confirm("Are you sure you want to log out?")) {
    logout();
    window.location.href = "/login";
  }
}

export default function UserPage() {
  const [profile, setProfile] = useState<Profile | null>(null); // State for profile data
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    async function getProfileData() {
      try {
        checkAndRefreshToken();
        const profileData = await fetchProfile();
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    }

    getProfileData();
  }, []);

  if (loading) {
    return <h1>loading...</h1>;
  }

  if (!profile) {
    return <h1 className="text-5xl">Profile fetch failed</h1>;
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
          onClick={logoutPrompt}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Log Out
        </button>
      </section>
    </div>
  );
}
