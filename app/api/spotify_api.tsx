export const clientId = "8a8de0c5076345f9a5ff8c79ba6440f7";

// Helper to check if running on the client
const isBrowser = typeof window !== "undefined";

export function getAuthCode(): string | null {
  // This logic will only work in the browser
  if (!isBrowser) return null;
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

export async function redirectToAuthCodeFlow(clientId: string) {
  // This logic will only run in the browser
  if (!isBrowser) return;

  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  // Store verifier in localStorage, only available in the browser
  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append(
    "redirect_uri",
    "https://spotify-manager-4gkzmcu4p-jonathon-ross-projects-8c6fc734.vercel.app"
  );
  params.append("scope", "user-read-private user-library-read user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // Redirect user to Spotify's authorization page
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(
  clientId: string,
  code: string
): Promise<string> {
  // This logic requires localStorage, only available in the browser
  if (!isBrowser) throw new Error("localStorage is not available");

  const verifier = localStorage.getItem("verifier");
  if (!verifier) throw new Error("Verifier not found");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:3000/user");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

function generateCodeVerifier(length: number): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    possible.charAt(Math.floor(Math.random() * possible.length))
  ).join("");
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function refreshAccessToken(refresh_token: string) {
  const response = await fetch("/api/refresh-token", {
    // Backend endpoint
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  return data.access_token; // Access token returned from backend
}
