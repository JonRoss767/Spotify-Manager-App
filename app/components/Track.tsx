import Image from "next/image";

export interface TrackProps {
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
  index: number;
}

export function Track({ track, index }: TrackProps) {
  return (
    <li
      className={`
        flex 
        flex-col 
        items-start 
        sm:flex-row 
        sm:items-center 
        bg-white 
        shadow-md 
        rounded-lg 
        p-4 
        mb-4 
        border 
        border-gray-200 
        hover:border-4
        hover:border-S-Green
        transition-all
        
       `}
    >
      {/* Track Number */}
      <div className="text-lg font-mono text-S-Black mr-4 mb-2 sm:mb-0">
        {index}.
      </div>

      {/* Track Image */}
      {track.album.images[0]?.url ? (
        <Image
          src={track.album.images[0].url}
          width={80}
          height={80}
          alt={track.album.name}
          className="w-20 h-20 rounded-lg mr-4 mb-2 sm:mb-0"
        />
      ) : (
        <div className="w-20 h-20 bg-gray-200 rounded-lg mr-4 mb-2 sm:mb-0 flex items-center justify-center text-gray-500">
          No Image
        </div>
      )}

      {/* Track Details */}
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-800">{track.name}</p>
        <p className="text-sm text-gray-600">
          by {track.artists.map((artist) => artist.name).join(", ")}
        </p>
        <p className="text-sm text-gray-600 italic">
          {track.album.name} ({new Date(track.album.release_date).getFullYear()}
          )
        </p>
      </div>
    </li>
  );
}
