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
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [totalFetched, setTotalFetched] = useState(0);
  const [totalTracks, setTotalTracks] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    async function loadInitialTracks() {
      try {
        setLoading(true);
        await checkAndRefreshToken();
        const response = await fetchSavedTracks(50, 0);
        setTracks(response.items);
        setTotalFetched(response.items.length);
        setTotalTracks(response.total);

        if (response.next) {
          loadRemainingTracks(response.offset + response.limit);
        }
      } catch (error) {
        console.error("Error fetching initial tracks:", error);
      } finally {
        setLoading(false);
      }
    }

    const loadRemainingTracks = async (startOffset: number) => {
      if (backgroundLoading) return;

      setBackgroundLoading(true);

      let offset = startOffset;
      let hasMore = true;

      try {
        while (hasMore) {
          const response = await fetchSavedTracks(50, offset);
          setTracks((prevTracks) => [...prevTracks, ...response.items]);
          setTotalFetched((prevCount) => prevCount + response.items.length);
          offset += response.items.length;
          hasMore = response.next !== null;
        }
      } catch (error) {
        console.error("Error fetching additional tracks:", error);
      } finally {
        setBackgroundLoading(false);
      }
    };

    loadInitialTracks();
  }, []); // Empty dependency array ensures this effect runs only once

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (!tracks.length) {
    return <h1 className="text-5xl">Tracks fetch failed</h1>;
  }

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
      <div className="sticky top-0 bg-S-Grey z-10 shadow-md h-20 p-4 flex items-center">
        <h1 className="text-3xl font-bold">
          Your Liked Songs{" "}
          <span className="text-xl font-normal text-gray-200">
            ({totalFetched}/{totalTracks || "?"} songs)
          </span>
        </h1>
      </div>

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
