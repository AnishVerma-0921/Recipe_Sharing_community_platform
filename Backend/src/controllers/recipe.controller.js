import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getCategories,
} from "../models/recipe.model.js";

// GET /api/recipes
export async function listRecipes(req, res, next) {
  const { category, search, page, limit } = req.query;
  try {
    const result = await getAllRecipes({ category, search, page, limit });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

// GET /api/recipes/categories
export async function listCategories(_req, res, next) {
  try {
    res.json({ success: true, data: await getCategories() });
  } catch (error) {
    next(error);
  }
}

// GET /api/recipes/:id
export async function getRecipe(req, res, next) {
  try {
    const recipe = await getRecipeById(req.params.id);
    if (!recipe) {
      const err = new Error(`Recipe not found: ${req.params.id}`);
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
}

// POST /api/recipes
export async function addRecipe(req, res, next) {
  try {
    const recipe = await createRecipe(req.body, req.user);
    res.status(201).json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/recipes/:id
export async function editRecipe(req, res, next) {
  try {
    const recipe = await updateRecipe(req.params.id, req.body, req.user);
    if (!recipe) {
      const err = new Error(`Recipe not found or you do not own it: ${req.params.id}`);
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: recipe });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/recipes/:id
export async function removeRecipe(req, res, next) {
  try {
    const deleted = await deleteRecipe(req.params.id, req.user);
    if (!deleted) {
      const err = new Error(`Recipe not found or you do not own it: ${req.params.id}`);
      err.statusCode = 404;
      return next(err);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
