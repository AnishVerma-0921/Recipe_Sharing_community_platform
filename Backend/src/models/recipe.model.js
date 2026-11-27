import { randomUUID } from "node:crypto";
import { pool } from "../db/database.js";

const recipeColumns = `
  id, title, description, ingredients, steps, cuisine, diet, difficulty, time,
  servings, rating, reviews, tags, cover, color, author, owner_user_id, created_at, updated_at
`;

function mapRecipe(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    ingredients: row.ingredients,
    steps: row.steps,
    cuisine: row.cuisine,
    diet: row.diet,
    difficulty: row.difficulty,
    time: row.time,
    servings: row.servings,
    rating: Number(row.rating),
    reviews: row.reviews,
    tags: row.tags,
    cover: row.cover,
    color: row.color,
    author: row.author,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getAllRecipes({ category, search, page = 1, limit = 10 } = {}) {
  const filters = [];
  const values = [];

  if (category) {
    values.push(category);
    filters.push(`LOWER(cuisine) = LOWER($${values.length})`);
  }
  if (search) {
    values.push(`%${search}%`);
    const searchParam = `$${values.length}`;
    filters.push(`(
      title ILIKE ${searchParam}
      OR description ILIKE ${searchParam}
      OR ingredients::text ILIKE ${searchParam}
      OR array_to_string(tags, ' ') ILIKE ${searchParam}
    )`);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const countResult = await pool.query(
    `SELECT COUNT(*)::integer AS total FROM recipes ${where}`,
    values
  );
  const total = countResult.rows[0].total;
  const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, Number.parseInt(limit, 10) || 10));
  const offset = (pageNum - 1) * limitNum;
  const { rows } = await pool.query(
    `SELECT ${recipeColumns} FROM recipes ${where}
     ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limitNum, offset]
  );

  return {
    data: rows.map(mapRecipe),
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export async function getRecipeById(id) {
  const { rows } = await pool.query(
    `SELECT ${recipeColumns} FROM recipes WHERE id = $1`,
    [id]
  );
  return mapRecipe(rows[0]);
}

export async function createRecipe(payload, user) {
  const { rows } = await pool.query(
    `INSERT INTO recipes (
       id, title, description, ingredients, steps, cuisine, diet, difficulty,
       time, servings, tags, cover, color, author, owner_user_id
     )
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
     RETURNING ${recipeColumns}`,
    [
      randomUUID(),
      payload.title,
      payload.description || "",
      JSON.stringify(payload.ingredients),
      payload.steps,
      payload.cuisine,
      payload.diet || "",
      payload.difficulty || "Easy",
      payload.time,
      payload.servings,
      payload.tags || [],
      payload.cover || "",
      payload.color || "sage",
      user.name,
      user.id,
    ]
  );
  return mapRecipe(rows[0]);
}

export async function updateRecipe(id, payload, user) {
  const fields = {
    title: "title",
    description: "description",
    ingredients: "ingredients",
    steps: "steps",
    cuisine: "cuisine",
    diet: "diet",
    difficulty: "difficulty",
    time: "time",
    servings: "servings",
    tags: "tags",
    cover: "cover",
    color: "color",
  };
  const updates = Object.entries(fields).filter(([field]) =>
    Object.hasOwn(payload, field)
  );
  if (updates.length === 0) {
    const { rows } = await pool.query(
      `SELECT ${recipeColumns} FROM recipes
       WHERE id = $1 AND (owner_user_id = $2 OR $3 = 'admin')`,
      [id, user.id, user.role]
    );
    return mapRecipe(rows[0]);
  }

  const values = updates.map(([field]) =>
    field === "ingredients" ? JSON.stringify(payload[field]) : payload[field]
  );
  const assignments = updates.map(([field], index) =>
    `${fields[field]} = $${index + 1}${field === "ingredients" ? "::jsonb" : ""}`
  );
  values.push(id, user.id, user.role);
  const { rows } = await pool.query(
    `UPDATE recipes SET ${assignments.join(", ")}, updated_at = NOW()
     WHERE id = $${values.length - 2}
       AND (owner_user_id = $${values.length - 1} OR $${values.length} = 'admin')
     RETURNING ${recipeColumns}`,
    values
  );
  return mapRecipe(rows[0]);
}

export async function deleteRecipe(id, user) {
  const { rowCount } = await pool.query(
    `DELETE FROM recipes
     WHERE id = $1 AND (owner_user_id = $2 OR $3 = 'admin')`,
    [id, user.id, user.role]
  );
  return rowCount > 0;
}

export async function getCategories() {
  const { rows } = await pool.query(
    "SELECT DISTINCT cuisine FROM recipes ORDER BY cuisine"
  );
  return rows.map(({ cuisine }) => cuisine);
}
