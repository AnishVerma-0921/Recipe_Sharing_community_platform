import { Router } from "express";
import {
  listRecipes,
  listCategories,
  getRecipe,
  addRecipe,
  editRecipe,
  removeRecipe,
} from "../controllers/recipe.controller.js";
import {
  recipeCreateRules,
  recipeUpdateRules,
  listQueryRules,
  validate,
} from "../validators/recipe.validator.js";

const router = Router();

// GET  /api/recipes              — paginated list with optional ?category=&search=
// POST /api/recipes              — create a new recipe
router
  .route("/")
  .get(listQueryRules, validate, listRecipes)
  .post(recipeCreateRules, validate, addRecipe);

// GET  /api/recipes/categories   — distinct category list (must be before /:id)
router.get("/categories", listCategories);

// GET    /api/recipes/:id        — single recipe
// PATCH  /api/recipes/:id        — partial update
// DELETE /api/recipes/:id        — remove
router
  .route("/:id")
  .get(getRecipe)
  .patch(recipeUpdateRules, validate, editRecipe)
  .delete(removeRecipe);

export default router;
