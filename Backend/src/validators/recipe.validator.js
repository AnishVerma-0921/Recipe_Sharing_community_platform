import { body, query, validationResult } from "express-validator";

// ── Reusable rule sets ────────────────────────────────────────────────────────

export const recipeCreateRules = [
  body("title")
    .trim()
    .notEmpty().withMessage("title is required")
    .isLength({ max: 120 }).withMessage("title must be ≤ 120 characters"),

  body("description")
    .trim()
    .notEmpty().withMessage("description is required")
    .isLength({ max: 1000 }).withMessage("description must be ≤ 1000 characters"),

  body("ingredients")
    .isArray({ min: 1 }).withMessage("ingredients must be a non-empty array"),
  body("ingredients.*")
    .trim()
    .notEmpty().withMessage("each ingredient must be a non-empty string"),

  body("steps")
    .isArray({ min: 1 }).withMessage("steps must be a non-empty array"),
  body("steps.*")
    .trim()
    .notEmpty().withMessage("each step must be a non-empty string"),

  body("category")
    .trim()
    .notEmpty().withMessage("category is required"),

  body("prepTimeMinutes")
    .isInt({ min: 0 }).withMessage("prepTimeMinutes must be a non-negative integer"),

  body("cookTimeMinutes")
    .isInt({ min: 0 }).withMessage("cookTimeMinutes must be a non-negative integer"),

  body("servings")
    .isInt({ min: 1 }).withMessage("servings must be a positive integer"),

  body("author")
    .trim()
    .notEmpty().withMessage("author is required"),
];

export const recipeUpdateRules = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("title cannot be blank")
    .isLength({ max: 120 }).withMessage("title must be ≤ 120 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty().withMessage("description cannot be blank")
    .isLength({ max: 1000 }).withMessage("description must be ≤ 1000 characters"),

  body("ingredients")
    .optional()
    .isArray({ min: 1 }).withMessage("ingredients must be a non-empty array"),

  body("steps")
    .optional()
    .isArray({ min: 1 }).withMessage("steps must be a non-empty array"),

  body("category").optional().trim().notEmpty(),

  body("prepTimeMinutes")
    .optional()
    .isInt({ min: 0 }).withMessage("prepTimeMinutes must be a non-negative integer"),

  body("cookTimeMinutes")
    .optional()
    .isInt({ min: 0 }).withMessage("cookTimeMinutes must be a non-negative integer"),

  body("servings")
    .optional()
    .isInt({ min: 1 }).withMessage("servings must be a positive integer"),
];

export const listQueryRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be 1-50"),
  query("category").optional().trim(),
  query("search").optional().trim(),
];

// ── Middleware that reads validation results ──────────────────────────────────

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const err = new Error("Validation failed");
  err.statusCode = 422;
  err.details = errors.array().map(({ path, msg }) => ({ field: path, message: msg }));
  next(err);
}
