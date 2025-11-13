export async function fetchWithAuth(url, options = {}) {
  const token = sessionStorage.getItem("accessToken");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if ( res.status === 401 || res.status === 403) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      window.location.href = "/signUp";
      return;
    }

    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      credentials: "include",
    });
  }

  return res;
}

async function refreshAccessToken() {
  try {
    const res = await fetch("https://guess-game-server.onrender.com/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;

    const newToken = res.headers.get("Authorization")?.split(" ")[1];
    if (newToken) {
      sessionStorage.setItem("accessToken", newToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
