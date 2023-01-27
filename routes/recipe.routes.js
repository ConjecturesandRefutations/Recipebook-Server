const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Recipe = require("../models/Recipe.model");

//  POST /api/recipes  -  Creates a new recipe
router.post("/recipes", (req, res, next) => {
  const { name, instructions } = req.body;

  Recipe.create({ name, instructions })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

//  GET /api/recipes -  Retrieves all of the recipes
router.get("/recipes", (req, res, next) => {
  Recipe.find()
    .then((allRecipes) => res.json(allRecipes))
    .catch((err) => res.json(err));
});

//  GET /api/recipes/:recipeId -  Retrieves a specific recipe by id
router.get("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findById(recipeId)
    .then((recipe) => res.status(200).json(recipe))
    .catch((error) => res.json(error));
});

// PUT  /api/recipes/:recipeId  -  Updates a specific recipe by id
router.put("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findByIdAndUpdate(recipeId, req.body, { new: true })
    .then((updatedRecipe) => res.json(updatedRecipe))
    .catch((error) => res.json(error));
});

// DELETE  /api/recipes/:recipeId  -  Deletes a specific recipe by id
router.delete("/recipes/:recipeId", (req, res, next) => {
  const { recipeId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(recipeId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Recipe.findByIdAndRemove(recipeId)
    .then(() =>
      res.json({
        message: `Recipe with ${recipeId} is removed successfully.`,
      })
    )
    .catch((error) => res.json(error));
});

module.exports = router;
