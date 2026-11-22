import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getCategories,
} from "../models/recipe.model.js";

// GET /api/recipes
export function listRecipes(req, res) {
  const { category, search, page, limit } = req.query;
  const result = getAllRecipes({ category, search, page, limit });
  res.json({ success: true, ...result });
}

// GET /api/recipes/categories
export function listCategories(_req, res) {
  res.json({ success: true, data: getCategories() });
}

// GET /api/recipes/:id
export function getRecipe(req, res, next) {
  const recipe = getRecipeById(req.params.id);
  if (!recipe) {
    const err = new Error(`Recipe not found: ${req.params.id}`);
    err.statusCode = 404;
    return next(err);
  }
  res.json({ success: true, data: recipe });
}

// POST /api/recipes
export function addRecipe(req, res) {
  const recipe = createRecipe(req.body);
  res.status(201).json({ success: true, data: recipe });
}

// PATCH /api/recipes/:id
export function editRecipe(req, res, next) {
  const recipe = updateRecipe(req.params.id, req.body);
  if (!recipe) {
    const err = new Error(`Recipe not found: ${req.params.id}`);
    err.statusCode = 404;
    return next(err);
  }
  res.json({ success: true, data: recipe });
}

// DELETE /api/recipes/:id
export function removeRecipe(req, res, next) {
  const deleted = deleteRecipe(req.params.id);
  if (!deleted) {
    const err = new Error(`Recipe not found: ${req.params.id}`);
    err.statusCode = 404;
    return next(err);
  }
  res.status(204).send();
}
