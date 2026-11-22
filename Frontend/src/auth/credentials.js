// Local credentials helper for Forkful
// Stores registered users (including admins) in browser localStorage.
// Each user schema: { id, name, email, password, role }
// role: "admin" | "user"

const usersStorageKey = "forkful-registered-users";

function ensureDefaultAdmin(users) {
  const adminExists = users.some(u => u.email === "g-19@gmail.com");
  if (!adminExists) {
    const updated = [
      ...users,
      {
        id: "admin-1",
        name: "Admin",
        email: "g-19@gmail.com",
        password: "123456",
        role: "admin",
      },
    ];
    saveUsers(updated);
    return updated;
  }
  return users;
}

export function loadUsers() {
  try {
    const raw = window.localStorage.getItem(usersStorageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    const validUsers = Array.isArray(parsed)
      ? parsed.filter(
        u =>
          u &&
          typeof u.id === "string" &&
          typeof u.email === "string" &&
          typeof u.password === "string"
      )
      : [];
    return ensureDefaultAdmin(validUsers);
  } catch (e) {
    console.error("Failed to load users from localStorage", e);
    return ensureDefaultAdmin([]);
  }
}

export function saveUsers(users) {
  try {
    window.localStorage.setItem(usersStorageKey, JSON.stringify(users));
    return true;
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
    return false;
  }
}

export function findUserByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  const users = loadUsers();
  return users.find(u => u.email.toLowerCase() === cleanEmail);
}

export function addUser(user) {
  const users = loadUsers();
  const cleanEmail = user.email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return false;
  }

  users.push({
    ...user,
    email: cleanEmail,
    role: user.role || "user",
  });

  return saveUsers(users);
}

export function deleteUser(id) {
  const users = loadUsers();
  const filtered = users.filter(u => u.id !== id);
  saveUsers(filtered);
  return filtered;
}