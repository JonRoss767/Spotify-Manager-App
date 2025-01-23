"use client";

import { useEffect, useState } from "react";
import {
  isLoggedIn,
  checkAndRefreshToken,
  fetchSavedTracks,
  TrackItem,
} from "../api/spotify_data_functions";
import Track from "../components/Track"; // Import the Track component

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([]); // Saved tracks
  const [nextOffset, setNextOffset] = useState<number | null>(0); // Offset for pagination
  const [loading, setLoading] = useState(true); // Initial loading state
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more tracks

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    async function getTracks() {
      try {
        checkAndRefreshToken(); // Refresh token if needed
        const initialTracks = await fetchSavedTracks(); // Fetch initial set of tracks
        setTracks(initialTracks.items); // Set tracks in state
        setNextOffset(
          initialTracks.next ? initialTracks.offset + initialTracks.limit : null
        );
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    }

    getTracks();
  }, []);

  async function loadSavedTracks(offset: number) {
    setLoadingMore(true);
    try {
      checkAndRefreshToken(); // Refresh token if needed
      const additionalTracks = await fetchSavedTracks(50, offset); // Fetch more tracks
      setTracks((prevTracks) => [...prevTracks, ...additionalTracks.items]); // Append new tracks
      setNextOffset(
        additionalTracks.next
          ? additionalTracks.offset + additionalTracks.limit
          : null
      );
    } catch (error) {
      console.error("Error loading more tracks:", error);
    } finally {
      setLoadingMore(false);
    }
  }

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!tracks.length) {
    return <h1 className="text-5xl">Tracks fetch failed</h1>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-5xl pb-4">Saved Tracks</h1>
      <ul className="flex flex-col gap-4">
        {tracks.map(({ track }, index) => (
          <Track key={`${track.id}-${index}`} track={track} />
        ))}
      </ul>
      {nextOffset !== null && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => loadSavedTracks(nextOffset)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Load more
          </button>
        </div>
      )}
      {loadingMore && (
        <p className="text-center mt-4">Loading more tracks...</p>
      )}
    </div>
  );
}
