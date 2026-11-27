import { pool } from "../db/database.js";

export async function requireAuth(req, res, next) {
  try {
    if (!req.session.userId) {
      const err = new Error("Please log in to continue.");
      err.statusCode = 401;
      return next(err);
    }

    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.session.userId]
    );
    if (!rows[0]) {
      req.session.destroy(() => {});
      const err = new Error("Your session is no longer valid. Please log in again.");
      err.statusCode = 401;
      return next(err);
    }

    req.user = rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    const err = new Error("Administrator access is required.");
    err.statusCode = 403;
    return next(err);
  }
  next();
}
