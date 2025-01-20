interface TrackProps {
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

export default function Track({ track }: TrackProps) {
  return (
    <li className="flex flex-col sm:flex-row items-start sm:items-center bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      {/* Track Image */}
      {track.album.images[0]?.url && (
        <img
          src={track.album.images[0].url}
          alt={track.album.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg mr-4 mb-2 sm:mb-0"
        />
      )}

      {/* Track Details */}
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{track.name}</p>
        <p className="text-sm text-gray-600">
          by {track.artists.map((artist) => artist.name).join(", ")}
        </p>
        <p className="text-sm text-gray-500 italic">{track.album.name}</p>
      </div>
    </li>
  );
}
