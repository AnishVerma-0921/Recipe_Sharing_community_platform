/**
 * In-memory Recipe store.
 * Swap `db` for a real database (MongoDB, PostgreSQL, …) without touching
 * the controllers — just replace these functions with async DB calls.
 */

import { v4 as uuidv4 } from "uuid";

// Seed data so the API returns something useful out-of-the-box
let db = [
  {
    id: uuidv4(),
    title: "Classic Margherita Pizza",
    description: "Simple Neapolitan pizza with fresh tomato, mozzarella, and basil.",
    ingredients: ["pizza dough", "tomato sauce", "fresh mozzarella", "basil", "olive oil"],
    steps: [
      "Preheat oven to 250 °C.",
      "Stretch dough on a floured surface.",
      "Spread tomato sauce, add mozzarella.",
      "Bake 10-12 min until crust is golden.",
      "Top with fresh basil and a drizzle of olive oil.",
    ],
    category: "Italian",
    prepTimeMinutes: 15,
    cookTimeMinutes: 12,
    servings: 4,
    author: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function findById(id) {
  return db.find((r) => r.id === id) ?? null;
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

export function getAllRecipes({ category, search, page = 1, limit = 10 } = {}) {
  let results = [...db];

  if (category) {
    results = results.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }

  // Pagination
  const total = results.length;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const start = (pageNum - 1) * limitNum;
  const data = results.slice(start, start + limitNum);

  return {
    data,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export function getRecipeById(id) {
  return findById(id);
}

export function createRecipe(payload) {
  const now = new Date().toISOString();
  const recipe = {
    id: uuidv4(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  };
  db.push(recipe);
  return recipe;
}

export function updateRecipe(id, payload) {
  const idx = db.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  db[idx] = {
    ...db[idx],
    ...payload,
    id,                               // prevent id override
    updatedAt: new Date().toISOString(),
  };
  return db[idx];
}

export function deleteRecipe(id) {
  const idx = db.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  db.splice(idx, 1);
  return true;
}

export function getCategories() {
  return [...new Set(db.map((r) => r.category))];
}
