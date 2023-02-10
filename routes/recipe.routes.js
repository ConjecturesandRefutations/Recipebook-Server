const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Recipe = require("../models/Recipe.model");

const fileUploader = require("../config/cloudinary.config");

//  POST /api/recipes  -  Creates a new recipe
router.post("/recipes", (req, res, next) => {
/*   const { name, instructions, imgUrl } = req.body; */

  Recipe.create(req.body)
  .then((createdRecipe) => {
    console.log("Created new recipe: ", createdRecipe);
    res.status(200).json(createdRecipe);
  })
  .catch((err) => next(err));
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
    .populate('feedback')
    .then((recipe) => {console.log(recipe) 
      res.status(200).json(recipe)})
    .catch((error) => res.json(error));
});

router.post("/upload", fileUploader.single("imgUrl"), (req, res, next) => {
  console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.

  res.json({ fileUrl: req.file.path });
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
