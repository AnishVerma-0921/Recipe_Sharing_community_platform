import "dotenv/config";
import cors from "cors";
import connectPgSimple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import helmet from "helmet";

import { initializeDatabase, pool } from "./src/db/database.js";
import { requestLogger } from "./src/middleware/requestLogger.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import recipeRoutes from "./src/routes/recipe.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/users.routes.js";

// ── App ───────────────────────────────────────────────────────────────────────

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const sessionSecret = process.env.SESSION_SECRET;
const PgSessionStore = connectPgSimple(session);

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set before starting the API.");
}

// ── Security & parsing ────────────────────────────────────────────────────────

app.use(helmet());                              // sets secure HTTP headers
app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));        // reject oversized payloads
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "forkful.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PgSessionStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ── Logging ───────────────────────────────────────────────────────────────────

app.use(requestLogger);

// ── Routes ────────────────────────────────────────────────────────────────────

app.get("/", (_req, res) =>
  res.json({
    success: true,
    message: "Recipe Sharing API",
    version: "1.0.0",
    docs: "/api/recipes",
  })
);

app.get("/api/health", (_req, res) =>
  res.json({
    success: true,
    status: "ok",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
);

app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// ── Error handling (must be last) ─────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────

await initializeDatabase();
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} [${process.env.NODE_ENV ?? "development"}]`);
});
