import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set before starting the API.");
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function initializeDatabase() {
  const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));
  const schema = await readFile(schemaPath, "utf8");
  await pool.query(schema);

  await pool.query(
    `INSERT INTO recipes (
       id, title, description, ingredients, steps, cuisine, diet, difficulty,
       time, servings, tags, cover, color, author
     )
     VALUES (
       '00000000-0000-4000-8000-000000000001',
       'Classic Margherita Pizza',
       'Simple Neapolitan pizza with fresh tomato, mozzarella, and basil.',
       '[
         {"name":"pizza dough","quantity":"1","unit":"ball"},
         {"name":"tomato sauce","quantity":"1/2","unit":"cup"},
         {"name":"fresh mozzarella","quantity":"150","unit":"g"},
         {"name":"basil","quantity":"to taste","unit":""},
         {"name":"olive oil","quantity":"1","unit":"tbsp"}
       ]'::jsonb,
       ARRAY[
         'Preheat oven to 250 °C.',
         'Stretch dough on a floured surface.',
         'Spread tomato sauce, add mozzarella.',
         'Bake 10-12 min until crust is golden.',
         'Top with fresh basil and a drizzle of olive oil.'
       ],
       'Italian', 'Vegetarian', 'Easy', 27, 4,
       ARRAY['pizza', 'classic'], '', 'sage', 'admin'
     )
     ON CONFLICT (id) DO NOTHING`
  );

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail || adminPassword) {
    if (!adminEmail || !adminPassword) {
      throw new Error("Set both ADMIN_EMAIL and ADMIN_PASSWORD to create the initial admin.");
    }

    const existingAdmin = await pool.query(
      "SELECT id, role FROM users WHERE email = $1",
      [adminEmail]
    );
    if (existingAdmin.rowCount === 0) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await pool.query(
        `INSERT INTO users (id, name, email, password_hash, role)
         VALUES (gen_random_uuid(), $1, $2, $3, 'admin')`,
        [process.env.ADMIN_NAME?.trim() || "Admin", adminEmail, passwordHash]
      );
      console.log("Initial admin account created from environment settings.");
    } else if (existingAdmin.rows[0].role !== "admin") {
      throw new Error(
        "ADMIN_EMAIL already belongs to a standard user. Choose a new admin email."
      );
    }
  }
}
