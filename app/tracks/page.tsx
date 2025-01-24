"use client";

import { useEffect, useState } from "react";
import {
  isLoggedIn,
  checkAndRefreshToken,
  fetchSavedTracks,
  TrackItem,
} from "../api/spotify_data_functions";
import Track from "../components/Track";
import { FixedSizeList as List } from "react-window";

export default function TracksPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([]); // Saved tracks
  const [loading, setLoading] = useState(true); // Initial loading state
  const [backgroundLoading, setBackgroundLoading] = useState(false); // Background loading state
  const [totalFetched, setTotalFetched] = useState(0); // Tracks fetched so far
  const [totalTracks, setTotalTracks] = useState<number | null>(null); // Total number of liked songs
  const [loadingMore, setLoadingMore] = useState(false); // Track if background loading is happening

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    // Load the first 50 tracks
    async function loadInitialTracks() {
      try {
        setLoading(true);
        await checkAndRefreshToken(); // Check if access token is still valid
        const response = await fetchSavedTracks(50, 0); // Fetch the first batch of tracks
        setTracks(response.items); // List of tracks fetched
        setTotalFetched(response.items.length); // Total tracks fetched so far
        setTotalTracks(response.total); // Total tracks available

        // If there are more tracks to load, initiate background fetching
        if (response.next) {
          loadRemainingTracks(response.offset + response.limit); // Start background loading
        }
      } catch (error) {
        console.error("Error fetching initial tracks:", error);
      } finally {
        setLoading(false);
      }
    }

    // Load the next batch of tracks only when more tracks are available
    const loadRemainingTracks = async (startOffset: number) => {
      if (loadingMore) return; // Prevent loading if another background fetch is ongoing

      setBackgroundLoading(true);
      setLoadingMore(true); // Track background loading state

      let offset = startOffset; // Get current offset
      let hasMore = true;

      while (hasMore) {
        const response = await fetchSavedTracks(50, offset); // Fetch tracks
        setTracks((prevTracks) => [...prevTracks, ...response.items]); // Append new tracks
        setTotalFetched((prevCount) => prevCount + response.items.length); // Update counter
        offset += response.items.length;
        hasMore = response.next !== null;
      }

      setLoadingMore(false); // Background loading complete
      setBackgroundLoading(false); // Hide loading spinner
    };

    loadInitialTracks();
  }, [loadingMore]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!tracks.length) {
    return <h1 className="text-5xl">Tracks fetch failed</h1>;
  }

  // Define the row renderer for react-window
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const { track } = tracks[index];
    return (
      <div style={style}>
        <Track key={`${track.id}-${index}`} track={track} index={index + 1} />
      </div>
    );
  };

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="sticky top-0 bg-S-Grey z-10 shadow-md h-20 p-4 flex items-center">
        <h1 className="text-3xl font-bold">
          Your Liked Songs{" "}
          <span className="text-xl font-normal text-gray-200">
            ({totalFetched}/{totalTracks || "?"} songs)
          </span>
        </h1>
      </div>

      {/* Song list - virtualized with react-window */}
      <List
        height={window.innerHeight - 100}
        itemCount={tracks.length}
        itemSize={125}
        width="100%"
      >
        {Row}
      </List>

      {backgroundLoading && (
        <p className="text-center mt-4">Fetching remaining songs...</p>
      )}
    </div>
  );
}
