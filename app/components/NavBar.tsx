import {
  FaHome,
  FaUser,
  FaMusic,
  FaUserFriends,
  FaInfoCircle,
} from "react-icons/fa";
import { MdAlbum } from "react-icons/md";
import Link from "next/link";
import "../globals.css";

export default function NavBar() {
  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Profile", path: "/user", icon: <FaUser /> },
    { name: "Songs", path: "/tracks", icon: <FaMusic /> },
    { name: "Playlists", path: "/playlists", icon: <MdAlbum /> },
    { name: "Artists", path: "/artists", icon: <FaUserFriends /> },
    { name: "About", path: "/about", icon: <FaInfoCircle /> },
  ];

  return (
    <nav className="bg-S-DarkGrey h-full flex flex-col items-center">
      <ul className="w-[85%] mt-5 flex flex-col gap-3">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              className={`border-4 border-S-Black bg-S-LightGrey p-4 w-full text-S-Black text-3xl font-normal hover:text-S-Green transition-all text-center flex items-center justify-center gap-2`}
              href={item.path}
            >
              {item.icon}
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
