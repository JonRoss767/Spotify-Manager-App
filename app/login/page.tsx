"use client";

import React from "react";
import Head from "next/head";
import { redirectToAuthCodeFlow } from "../api/spotify_api"; // Adjust path if needed

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex items-center justify-center h-full bg-S-Black">
        <div className="p-8 bg-S-DarkGrey shadow-lg rounded-lg w-full max-w-md">
          <h1 className="text-4xl font-bold text-center text-S-Green mb-6">
            Sign In
          </h1>
          <button
            onClick={redirectToAuthCodeFlow}
            className="w-full px-4 py-3 bg-S-Green text-white text-lg font-medium rounded-md hover:bg-S-Grey transition-all"
          >
            Log In
          </button>
        </div>
      </div>
    </>
  );
}
