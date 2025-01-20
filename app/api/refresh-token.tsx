import { VercelRequest, VercelResponse } from "@vercel/node"; // New imports
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const CLIENT_ID = "8a8de0c5076345f9a5ff8c79ba6440f7";
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    return res.status(200).json(data);
  } catch (error: unknown) {
    // Check if error is an instance of Error before accessing its properties
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json({ error: "An unknown error occurred" });
    }
  }
}
