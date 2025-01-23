// ----important numbers----
const CLIENT_ID = "8a8de0c5076345f9a5ff8c79ba6440f7";
const REDIRECT_URI = "https://spotify-manager-app.vercel.app/callback";
//const REDIRECT_URI = "http://localhost:3000/callback";
const auth_scope = `
  user-read-private 
  playlist-read-private 
  user-library-read 
  user-read-email`;

// ----interfaces----
export interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// ----authentication functions----

// redirect user to auth page
export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128); // Generate a random code verifier
  const challenge = await generateCodeChallenge(verifier); // Create the challenge from the verifier

  localStorage.setItem("verifier", verifier); // Save verifier for token exchange

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("response_type", "code");
  params.append("redirect_uri", REDIRECT_URI); // Your app's redirect URI
  params.append("scope", auth_scope); // Scopes for the requested permissions
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  // Redirect the user to Spotify's authorization page
  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

// part of PKCE -> used in redirectToAuthCodeFlow
function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// part of PKCE -> used in redirectToAuthCodeFlow
async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// getAccessTokenData
export async function getTokenData(code: string): Promise<TokenData> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("code_verifier", verifier!);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token, refresh_token, expires_in } = await result.json();
  return { access_token, refresh_token, expires_in };
}

// refreshToken
export async function refreshAccessToken(
  current_refresh_token: string
): Promise<TokenData> {
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: current_refresh_token,
      client_id: CLIENT_ID,
    }),
  };
  const body = await fetch(url, payload);
  const { access_token, expires_in, refresh_token } = await body.json();

  return {
    access_token,
    refresh_token: refresh_token || current_refresh_token,
    expires_in,
  };
}
