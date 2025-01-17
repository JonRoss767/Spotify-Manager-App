import Link from "next/link";
import "../globals.css";
//import "../css/NavBar.css";

export default function NavBar() {
  const navItems = [
    { name: "Profile", path: "/user" },
    { name: "Tracks", path: "/tracks" },
    { name: "Albums", path: "/album" },
    { name: "Artists", path: "/artists" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="bg-green-500 h-full flex flex-col items-center">
      <ul className=" w-[85%] mt-5 flex flex-col gap-3">
        {navItems.map((item) => (
          <li key={item.path} className="">
            <Link
              className={`
              border-2 
              border-gray-800
              bg-gray-700
              p-4
              w-full
              text-white
              text-3xl
              font-normal
              hover:text-green-500
              transition-all
              block
              text-center
              `}
              href={item.path}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
