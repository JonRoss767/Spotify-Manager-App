import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./componets/NavBar";

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
        <div className="bg-black h-28 w-full text-green-500 text-7xl text-center pt-5 fixed top-0 left-0 z-10">
          Spotify Manager
        </div>

        {/* NavBar */}
        <div className="w-64 mt-28">
          <NavBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 mt-28">
          {children}
        </div>
      </body>
    </html>
  );
}
