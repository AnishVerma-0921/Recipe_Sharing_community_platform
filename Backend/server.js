import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";

import { requestLogger } from "./src/middleware/requestLogger.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import recipeRoutes from "./src/routes/recipe.routes.js";

dotenv.config();

// ── App ───────────────────────────────────────────────────────────────────────

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT) : 0;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// ── Security & parsing ────────────────────────────────────────────────────────

app.use(helmet());                              // sets secure HTTP headers
app.use(
  cors({
    origin: clientOrigin,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));        // reject oversized payloads
app.use(express.urlencoded({ extended: false }));

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

// ── Error handling (must be last) ─────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`✅  Server running on http://localhost:${port}  [${process.env.NODE_ENV ?? "development"}]`);
});
