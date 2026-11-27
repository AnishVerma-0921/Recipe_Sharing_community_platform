import { useEffect, useState } from "react";
import { loadUsers, deleteUser } from "./auth/credentials.js";

const savedRecipeSamples = [
  {
    id: "sample-1",
    title: "Smoky chickpea stew",
    author: "Meera P.",
    rating: "4.8",
    reviews: 212,
    time: 35,
    diet: "Vegan",
    cover: "blue",
  },
  {
    id: "sample-2",
    title: "Lemon herb gnocchi",
    author: "Luca B.",
    rating: "4.6",
    reviews: 98,
    time: 30,
    diet: "Veg",
    cover: "yellow",
  },
];

const favouriteCuisines = [
  ["Italian", "🍝"],
  ["Indian", "🍛"],
  ["Thai", "🥢"],
  ["Mexican", "🌮"],
  ["Japanese", "🍱"],
  ["Korean", "🥬"],
];

export default function AdminPanel({ onLogout, currentUser }) {
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("saved");
  const [savedRecipes, setSavedRecipes] = useState(savedRecipeSamples);
  const [profileName, setProfileName] = useState(currentUser?.name || "admin");

  useEffect(() => {
    loadUsers()
      .then(setUsers)
      .catch(error => setUsersError(error.message))
      .finally(() => setLoadingUsers(false));
  }, []);

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsersError("");
      try {
        await deleteUser(id);
        setUsers(items => items.filter(user => user.id !== id));
      } catch (error) {
        setUsersError(error.message);
      }
    }
  }

  return (
    <main className="forkful-admin-page">
      <aside className="forkful-admin-sidebar">
        <section className="admin-profile-card">
          <div className="admin-profile-cover">
            <span className="admin-profile-avatar">A</span>
          </div>
          <div className="admin-profile-body">
            <h2>{profileName}</h2>
            <p className="admin-profile-email">@{profileName} · {currentUser?.role || "Admin"}</p>
            <p className="admin-profile-bio">Home cook sharing everyday comfort food &amp; quick weeknight bowls.</p>
            <div className="admin-profile-stats">
              <div><strong>{users.length + 40}</strong><span>Recipes</span></div>
              <div><strong>{users.filter(u => u.role === "admin").length}</strong><span>Published</span></div>
              <div><strong>{savedRecipes.length}</strong><span>Saved</span></div>
            </div>
            <button className="admin-publish-button" type="button">Publish recipe</button>
            <div className="admin-profile-actions">
              <button type="button" onClick={() => setProfileName(profileName === "admin" ? "Admin" : "admin")}>Edit bio</button>
              <button type="button" onClick={onLogout}>Log out</button>
            </div>
          </div>
        </section>

        <section className="admin-cuisine-card">
          <h3>Favourite cuisines</h3>
          <div className="admin-cuisine-grid">
            {favouriteCuisines.map(([name, emoji]) => (
              <button type="button" key={name} className="admin-cuisine-item">
                <span>{emoji}</span>
                <small>{name}</small>
              </button>
            ))}
          </div>
        </section>
      </aside>

      <section className="forkful-admin-content">
        <div className="admin-recipe-tabs" role="tablist" aria-label="Recipe sections">
          {[
            ["all", `All recipes (${users.length + 40})`],
            ["published", "Published (1)"],
            ["saved", `Saved (${savedRecipes.length})`],
          ].map(([key, label]) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              className={activeTab === key ? "active" : ""}
              key={key}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="admin-content-heading">
          <h1>{activeTab === "published" ? "Published recipes" : activeTab === "all" ? "All recipes" : "Saved recipes"}</h1>
          <span>{activeTab === "saved" ? `${savedRecipes.length} recipes` : ""}</span>
        </div>

        {activeTab === "saved" ? (
          <div className="admin-recipe-grid">
            {savedRecipes.map(recipe => (
              <article className="admin-recipe-card" key={recipe.id}>
                <div className={`admin-recipe-cover admin-cover-${recipe.cover}`}>
                  <button
                    type="button"
                    className="admin-save-button"
                    aria-label="Remove saved recipe"
                    onClick={() => setSavedRecipes(items => items.filter(item => item.id !== recipe.id))}
                  >
                    ♥
                  </button>
                  {recipe.cover === "blue" ? (
                    <div className="plate-art plate-art-blue"><span /></div>
                  ) : (
                    <div className="plate-art plate-art-yellow"><span /></div>
                  )}
                </div>
                <div className="admin-recipe-body">
                  <h3>{recipe.title}</h3>
                  <p>by {recipe.author} <span>♟</span></p>
                  <div className="admin-recipe-meta">
                    <strong>★ {recipe.rating}<small>({recipe.reviews})</small></strong>
                    <span>{recipe.time} min</span>
                    <em>{recipe.diet}</em>
                  </div>
                </div>
              </article>
            ))}

            {savedRecipes.length < 3 && (
              <button type="button" className="admin-find-card">
                <span>Find more recipes to save</span>
                <strong>Browse recipes</strong>
              </button>
            )}
          </div>
        ) : (
          <div className="admin-empty-state">
            <span>🍽️</span>
            <h2>{activeTab === "published" ? "No published recipes yet" : "Recipes will appear here"}</h2>
          </div>
        )}

        <details className="admin-users-details">
          <summary>Manage registered users</summary>
          {loadingUsers && <p>Loading users...</p>}
          {usersError && <p className="publish-error" role="alert">{usersError}</p>}
          <div className="admin-users-list">
            {users.map(user => (
              <div key={user.id}>
                <span><strong>{user.name || "User"}</strong><small>{user.email}</small></span>
                {user.role === "admin" ? (
                  <em>Protected</em>
                ) : (
                  <button type="button" onClick={() => handleDelete(user.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        </details>
      </section>
    </main>
  );
}
