import { pool } from "../db/database.js";

export async function listUsers(_req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY created_at ASC"
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    next(error);
  }
}

export async function removeUser(req, res, next) {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM users WHERE id = $1 AND role = 'user'",
      [req.params.id]
    );
    if (rowCount === 0) {
      const err = new Error("User not found or protected.");
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
