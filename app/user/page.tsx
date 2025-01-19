"use client";
import { useEffect, useState } from "react";
import {
  clientId,
  getAuthCode,
  redirectToAuthCodeFlow,
  getAccessToken,
} from "../api/spotify_api";

// Profile fetching logic
async function fetchProfile(token: string): Promise<any> {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile data");
  }

  return response.json();
}

export default function UserPage() {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleAuth() {
      const code = getAuthCode();

      if (!code) {
        // No auth code, redirect to login
        redirectToAuthCodeFlow(clientId);
        return;
      }

      try {
        setLoading(true);
        const token = await getAccessToken(clientId, code);
        const profileData = await fetchProfile(token);
        setProfile(profileData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    }

    handleAuth();
  }, []);

  // If there's an error
  if (error) {
    return <p>Error: {error}</p>;
  }

  // If the profile is still loading or missing
  if (loading) {
    return <p>Loading...</p>;
  }

  // If profile is missing or invalid, show a message
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
