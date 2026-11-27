import { Router } from "express";
import { body } from "express-validator";
import { currentUser, login, logout, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../validators/recipe.validator.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().isLength({ max: 50 }),
    body("email").isEmail().isLength({ max: 254 }),
    body("password").isLength({ min: 8, max: 72 }),
    validate,
  ],
  register
);
router.post(
  "/login",
  [
    body("email").isEmail().isLength({ max: 254 }),
    body("password").notEmpty().isLength({ max: 72 }),
    validate,
  ],
  login
);
router.get("/me", requireAuth, currentUser);
router.post("/logout", logout);

export default router;
