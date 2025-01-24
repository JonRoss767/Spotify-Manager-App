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
    <div className="w-full p-6 bg-S-Black min-h-screen text-white">
      <section className="bg-S-DarkGrey shadow-lg rounded-lg p-10 flex flex-col lg:flex-row items-center lg:items-stretch lg:justify-between border border-S-Grey">
        {/* Profile Details */}
        <div className="flex-1">
          <h2 className="text-4xl font-semibold text-S-Green mb-6">
            Logged in as {profile.display_name}
          </h2>
          <ul className="space-y-6 text-white text-2xl leading-relaxed">
            <li>
              <span className="font-semibold">User ID:</span> {profile.id}
            </li>
            <li>
              <span className="font-semibold">Email:</span> {profile.email}
            </li>
            <li>
              <span className="font-semibold">Spotify URI:</span>{" "}
              <a href={profile.uri} className="text-S-Green hover:underline">
                {profile.uri}
              </a>
            </li>
            {profile.external_urls?.spotify && (
              <li>
                <span className="font-semibold">Link:</span>{" "}
                <a
                  href={profile.external_urls.spotify}
                  className="text-S-Green hover:underline"
                >
                  Profile Link
                </a>
              </li>
            )}
            {profile.country && (
              <li>
                <span className="font-semibold">Country:</span>{" "}
                {profile.country}
              </li>
            )}
            {profile.followers && (
              <li>
                <span className="font-semibold">Followers:</span>{" "}
                {profile.followers.total}
              </li>
            )}
          </ul>
          <button
            onClick={logoutPrompt}
            className="mt-8 px-8 py-4 bg-red-500 text-white text-xl rounded-md hover:bg-red-600 transition-all"
          >
            Log Out
          </button>
        </div>

        <div className="flex justify-center items-center mr-20 ">
          <div className="w-auto h-auto bg-S-Black rounded-lg p-4 flex justify-center items-center">
            {profile.images?.length ? (
              <Image
                src={profile.images[0].url}
                alt="Profile Avatar"
                className="rounded-full shadow-md"
                width={300}
                height={300}
              />
            ) : (
              <div className="w-72 h-72 rounded-full bg-S-Grey flex justify-center items-center shadow-md">
                <span className="text-S-LightGrey text-2xl">No image</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
