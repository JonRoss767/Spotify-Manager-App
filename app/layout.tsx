import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Spotify Manager",
  description:
    "A spotify account manager to view and edit your spotify account!",
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
        <div className="flex items-center bg-S-DarkGrey h-40 w-full text-white text-7xl fixed top-0 z-10 ">
          {/* Image */}
          <div className="flex justify-center h-full w-64 ">
            <Image
              src="/Spotify_Primary_Logo_RGB_Green.png"
              alt="Spotify Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>

          {/* Header Text */}
          <div className="flex-1 flex items-center justify-center">
            Spotify Manager
          </div>
        </div>

        {/* Sidebar and Content */}
        <div className="flex flex-1 pt-40">
          {/* Sidebar */}
          <div className="w-64 h-full">
            <NavBar />
          </div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-S-DarkGrey text-white">
            {children}
            <Analytics />
            <SpeedInsights />
          </div>
        </div>
      </body>
    </html>
  );
}
