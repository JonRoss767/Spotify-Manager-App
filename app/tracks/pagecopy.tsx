"use client";

import { useEffect, useState } from "react";
import { useAuth, fetchSavedTracks } from "../AuthContext";

interface TrackItem {
  track: {
    id: string;
    name: string;
    artists: { name: string }[];
  };
}

export default function TracksPage() {
  const { token, error, loading } = useAuth();
  const [tracks, setTracks] = useState<TrackItem[]>([]);
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedTracks() {
      if (!token) return;

      try {
        setErrorFetching(null);
        const savedTracks = await fetchSavedTracks(token);
        setTracks(savedTracks.items);
      } catch (err) {
        if (err instanceof Error) {
          setErrorFetching(err.message);
        } else {
          setErrorFetching("An unknown error occurred");
        }
      }
    }

    if (token) {
      loadSavedTracks();
    }
  }, [token]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || errorFetching) {
    return <p>Error: {error || errorFetching}</p>;
  }

  return (
    <div>
      <h1>Saved Tracks</h1>
      <ul>
        {tracks.map(({ track }) => (
          <li key={track.id}>
            <p>
              <strong>{track.name}</strong> by{" "}
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
