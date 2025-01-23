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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <button
            onClick={redirectToAuthCodeFlow}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Log In
          </button>
        </div>
      </div>
    </>
  );
}
