import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./componets/NavBar";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotify Manager",
  description: "Not a typical spotify clone!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>My App</title>
      </head>
      <body className="flex h-screen">
        {/* Header */}
        <div className="flex items-center bg-S-DarkGrey h-40 w-full text-white text-7xl fixed top-0 z-10 border-y-8 border-S-Black">
          {/* Image */}
          <div className="flex justify-center border-r-8 border-S-Black h-full w-64">
            <Image
              src="/Spotify_Primary_Logo_RGB_Green.png"
              alt="Spotify Logo"
              width={140} // Matches the width of the sidebar
              height={140} // Adjust to fit the height of the header
              className="object-contain"
              layout="intrinsic"
            />
          </div>

          {/* Header Text */}
          <div className="flex-1 flex items-center justify-center">
            Spotify Manager
          </div>
        </div>

        {/* Main Layout: Sidebar and Content */}
        <div className="flex flex-1 pt-40">
          {/* Sidebar */}
          <div className="w-64 h-full">
            <NavBar />
          </div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-S-DarkGrey p-4 text-white">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
