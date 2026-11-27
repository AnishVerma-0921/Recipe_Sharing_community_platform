const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch (cause) {
    const error = new Error(
      `Cannot reach the Forkful API at ${apiBaseUrl}. Start the backend and check its database configuration.`
    );
    error.cause = cause;
    throw error;
  }

  if (response.status === 204) return null;
  const result = await response.json();
  if (!response.ok) {
    const error = new Error(result.error?.message || "The request could not be completed.");
    error.status = response.status;
    throw error;
  }
  return result.data;
}

export function registerUser(user) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function loginUser(credentials) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function loadCurrentUser() {
  return request("/auth/me");
}

export function logoutUser() {
  return request("/auth/logout", { method: "POST" });
}

export function loadUsers() {
  return request("/users");
}

export function deleteUser(id) {
  return request(`/users/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function loadRecipes() {
  return request("/recipes?limit=50");
}

export function publishRecipe(recipe) {
  return request("/recipes", {
    method: "POST",
    body: JSON.stringify(recipe),
  });
}
