import Link from "next/link";
import "../globals.css";

export default function NavBar() {
  return (
    <nav className="bg-green-500 h-screen">
      <div className="text-white text-center text-4xl">
        <div className="flex flex-col items-center p-4 space-y-4">
          <Link
            href="/user"
            className="border-4 w-52 border-black bg-gray-800 text-white p-4 mt-4 mb-4 font-bold"
          >
            Profile
          </Link>
          <Link
            href="/tracks"
            className="border-4 w-52 border-black bg-gray-800 text-white p-4 mt-4 mb-4 font-bold"
          >
            Tracks
          </Link>
          <Link
            href="/album"
            className="border-4 w-52 border-black bg-gray-800 text-white p-4 mt-4 mb-4 font-bold"
          >
            Albums
          </Link>
          <Link
            href="/artists"
            className="border-4 w-52 border-black bg-gray-800 text-white p-4 mt-4 mb-4 font-bold"
          >
            Artists
          </Link>
          <Link
            href="/about"
            className="border-4 w-52 border-black bg-gray-800 text-white p-4 mt-4 mb-4 font-bold"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
