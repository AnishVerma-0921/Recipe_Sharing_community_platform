import bcrypt from "bcryptjs";
import { pool } from "../db/database.js";

function establishSession(req, userId) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((regenerateError) => {
      if (regenerateError) {
        reject(regenerateError);
        return;
      }
      req.session.userId = userId;
      req.session.save((saveError) => saveError ? reject(saveError) : resolve());
    });
  });
}

export async function register(req, res, next) {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const { rows } = await pool.query(
      `INSERT INTO users (id, name, email, password_hash)
       VALUES (gen_random_uuid(), $1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, passwordHash]
    );
    await establishSession(req, rows[0].id);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      error.statusCode = 409;
      error.message = "An account with this email already exists.";
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { rows } = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(req.body.password, user.password_hash))) {
      const err = new Error("Invalid email or password.");
      err.statusCode = 401;
      return next(err);
    }

    await establishSession(req, user.id);
    const { password_hash: _passwordHash, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (error) {
    next(error);
  }
}

export function currentUser(req, res) {
  res.json({ success: true, data: req.user });
}

export function logout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("forkful.sid", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    res.status(204).send();
  });
}
