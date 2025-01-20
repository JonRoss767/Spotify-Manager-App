export async function refreshAccessToken(refresh_token: string) {
  const response = await fetch("/getRefreshAccessToken", {
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
  const expiresIn = data.expires_in; // Expiry time in seconds
  const newToken = data.access_token;

  if (isBrowser) {
    localStorage.setItem("spotify_access_token", newToken);
    localStorage.setItem(
      "spotify_token_expiry",
      (Date.now() + expiresIn * 1000).toString()
    );
  }

  return newToken;
}
