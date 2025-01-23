"use client";

import { useEffect } from "react";
import { getTokenData } from "../api/spotify_api";

export default function CallbackPage() {
  useEffect(() => {
    async function init() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("AUTH_CODE = " + code);
      if (!code) {
        throw new Error("Authorization code not found in the URL.");
      }

      console.log("Calling getTokenData");
      const { access_token, refresh_token, expires_in } = await getTokenData(
        code
      );
      console.log("Finished getTokenData");
      const expiration_time = Date.now() + expires_in * 1000;
      console.log("access_token" + access_token);
      console.log("refresh_token" + refresh_token);
      console.log("expires_in" + expires_in * 1000);

      sessionStorage.setItem("access_token", access_token);
      sessionStorage.setItem("refresh_token", refresh_token);
      sessionStorage.setItem("expiration_time", expiration_time.toString());

      window.location.href = "/";
    }

    init();
  }, []);

  return <h1>Redirecting...</h1>;
}
