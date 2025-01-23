"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  isLoggedIn,
  checkAndRefreshToken,
  fetchSavedTracks,
  TrackItem,
} from "../api/spotify_data_functions";
import Track from "../components/Track"; // Import the Track component

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(true); // State for loading status
  const [nextOffset, setNextOffset] = useState<number | null>(0); // For pagination
  const [loadingMore, setLoadingMore] = useState(false); // State for loading more tracks

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    async function getTracks() {
      try {
        checkAndRefreshToken();
        const initialTracks = await fetchSavedTracks();
        setTracks(initialTracks.items);
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
      checkAndRefreshToken();
      const additionalTracks = await fetchSavedTracks(50, offset);
      setTracks((prevTracks) => [...prevTracks, ...additionalTracks.items]);
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
    return <h1>loading...</h1>;
  }

  if (!tracks) {
    return <h1 className="text-5xl">Tracks fetch failed</h1>;
  }

  return (
    <div>
      <h1 className="text-5xl pb-4">Saved Tracks</h1>
      <ul>
        {tracks.map(({ track }, index) => (
          <Track key={`${track.id}-${index}`} track={track} />
        ))}
      </ul>
      {nextOffset !== null && (
        <button
          onClick={() => loadSavedTracks(nextOffset)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Load more
        </button>
      )}
      {loadingMore && <p>Loading more tracks...</p>}
    </div>
  );
}
