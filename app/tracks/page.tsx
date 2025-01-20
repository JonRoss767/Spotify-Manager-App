"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../AuthContext";
import Track from "../components/Track"; // Import the Track component

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

async function fetchSavedTracks(token: string, limit = 50, offset = 0) {
  const url = `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch saved tracks: ${response.statusText}`);
  }

  return response.json();
}

export default function TracksPage() {
  const { token, error: authError, loading: authLoading } = useAuth();
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);
  const [loading, setLoading] = useState<"initial" | "more" | null>(null);
  const [nextOffset, setNextOffset] = useState<number | null>(null);

  const loadSavedTracks = useCallback(
    async (offset: number = 0) => {
      if (!token) return;

      try {
        setErrorFetching(null);
        setLoading(offset === 0 ? "initial" : "more");

        const savedTracks = await fetchSavedTracks(token, 50, offset);
        setTracks((prevTracks) => [...prevTracks, ...savedTracks.items]);
        setNextOffset(
          savedTracks.next
            ? Number(new URL(savedTracks.next).searchParams.get("offset"))
            : null
        );
      } catch (err) {
        setErrorFetching(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(null);
      }
    },
    [token]
  );

  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      loadSavedTracks();
    }
  }, [token, loadSavedTracks]);

  if (authLoading || loading === "initial") {
    return <p>Loading...</p>;
  }

  if (authError || errorFetching) {
    return <p>Error: {authError || errorFetching}</p>;
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
        <button onClick={() => loadSavedTracks(nextOffset)}>Load more</button>
      )}
      {loading === "more" && <p>Loading more tracks...</p>}
    </div>
  );
}
