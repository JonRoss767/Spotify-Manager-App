import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = "8a8de0c5076345f9a5ff8c79ba6440f7";
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

// Define an interface for the token response
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// Type guard to check if the response data is of type TokenResponse
function isTokenResponse(data: any): data is TokenResponse {
  return (
    typeof data.access_token === "string" &&
    typeof data.refresh_token === "string" &&
    typeof data.expires_in === "number"
  );
}

export default async function getRefreshAccessToken(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    // Check if data is of type TokenResponse using the type guard
    if (!isTokenResponse(data)) {
      throw new Error("Invalid token data received");
    }

    const { access_token, refresh_token: newRefreshToken, expires_in } = data;

    if (!access_token || !newRefreshToken || !expires_in) {
      throw new Error("Missing expected token data in response");
    }

    return res.status(200).json({
      access_token,
      refresh_token: newRefreshToken,
      expires_in,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
