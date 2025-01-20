"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; // Import the context to access token

// Type definitions
interface Profile {
  display_name: string;
  id: string;
  email: string;
  images?: { url: string }[];
  external_urls?: { spotify: string };
  uri: string;
}

// Function to fetch the profile data
async function fetchProfile(token: string): Promise<Profile> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
}

export default function UserPage() {
  const { token, error: authError, loading: authLoading } = useAuth(); // Use AuthContext to get token
  const [profile, setProfile] = useState<any>(null);
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
        const profileData = await fetchProfile(token); // Fetch the profile using the token
        setProfile(profileData);
      } catch (err) {
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]); // Trigger the effect whenever the token changes

  // If there is a token, loading or auth error
  if (authLoading) {
    return <p>Loading authentication...</p>;
  }

  if (authError) {
    return <p>Error: {authError}</p>;
  }

  // If there's an error fetching the profile
  if (error) {
    return <p>Error: {error}</p>;
  }

  // If the profile is still loading
  if (loading) {
    return <p>Loading profile...</p>;
  }

  // If profile data is unavailable
  if (!profile) {
    return <p>Profile data is unavailable. Please try again later.</p>;
  }

  // Profile data display
  return (
    <div>
      <h1>Spotify Profile</h1>
      <section>
        <h2>Logged in as {profile.display_name}</h2>
        {profile.images && profile.images.length > 0 && (
          <img src={profile.images[0].url} alt="Profile Avatar" />
        )}
        <ul>
          <li>User ID: {profile.id}</li>
          <li>Email: {profile.email}</li>
          <li>
            Spotify URI: <a href={profile.uri}>{profile.uri}</a>
          </li>
          {profile.external_urls && profile.external_urls.spotify && (
            <li>
              Link: <a href={profile.external_urls.spotify}>Profile Link</a>
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
