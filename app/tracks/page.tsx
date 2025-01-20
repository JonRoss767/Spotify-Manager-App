"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext"; // Import the useAuth hook from AuthContext

interface TrackItem {
  added_at: string;
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
      name: string;
      release_date: string;
      images: { url: string; height: number; width: number }[];
    };
  };
}

// Function to fetch saved tracks from the external API
async function fetchSavedTracks(token: string, limit = 20, offset = 0) {
  const url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch saved tracks: ${response.statusText}`);
  }

  const data = await response.json();
  return data; // Contains 'items', 'next', etc.
}

export default function TracksPage() {
  const { token, error, loading } = useAuth(); // Use token from AuthContext
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [errorFetching, setErrorFetching] = useState<{
    message: string;
    type: string;
  } | null>(null);
  const [loadingMore, setLoadingMore] = useState(false); // To track if more tracks are being loaded
  const [nextUrl, setNextUrl] = useState<string | null>(null); // URL for next set of tracks

  // Function to fetch saved tracks from the external API
  // This is used to fetch the initial set of tracks and subsequent tracks
  const loadSavedTracks = useCallback(
    async (offset: number = 0) => {
      if (!token) return; // Ensure token exists

      try {
        setErrorFetching(null); // Reset any previous errors
        setLoadingMore(true); // Indicate loading is happening

        // Fetch the saved tracks
        const savedTracks = await fetchSavedTracks(token, 20, offset);
        setTracks((prevTracks) => [...prevTracks, ...savedTracks.items]); // Append new tracks to the existing list
        setNextUrl(savedTracks.next); // Set next URL for pagination if available
      } catch (err) {
        // Handle any errors while fetching
        if (err instanceof Error) {
          setErrorFetching({ message: err.message, type: "fetch" });
        } else {
          setErrorFetching({
            message: "An unknown error occurred",
            type: "fetch",
          });
        }
      } finally {
        setLoadingMore(false); // Turn off loading state
      }
    },
    [token]
  );

  // Fetch initial set of tracks when the component mounts
  useEffect(() => {
    if (token) {
      // Fetch the first set of tracks
      loadSavedTracks(0); // Fetch initial set with offset 0
    }
  }, [token, loadSavedTracks]);

  // Load more tracks if next URL is available
  const loadMoreTracks = () => {
    if (nextUrl && !loadingMore) {
      // Extract offset from the next URL for pagination
      const offset = nextUrl.split("offset=")[1]?.split("&")[0];
      loadSavedTracks(Number(offset)); // Fetch the next set of tracks based on the offset
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || errorFetching?.message) {
    return <p>Error: {error || errorFetching?.message}</p>;
  }

  return (
    <div>
      <h1>Saved Tracks</h1>
      <ul>
        {tracks.map(({ track }) => (
          <li key={track.id}>
            <p>
              <strong>{track.name}</strong> by{" "}
              {track.artists.map((a) => a.name).join(", ")} -{" "}
              <span>{track.album.name}</span>
            </p>
            {track.album.images.length > 0 && (
              <img
                src={track.album.images[0].url}
                alt={track.album.name}
                width={50}
              />
            )}
          </li>
        ))}
      </ul>

      {/* Load more button */}
      {nextUrl && !loadingMore && (
        <button onClick={loadMoreTracks}>Load more</button>
      )}

      {loadingMore && <p>Loading more tracks...</p>}
    </div>
  );
}
