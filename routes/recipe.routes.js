const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Recipe = require("../models/Recipe.model");

const User = require("../models/User.model")

const fileUploader = require("../config/cloudinary.config");

 router.post("/recipes", (req, res, next) => {

  Recipe.create(req.body)
  .then((createdRecipe) => {
    console.log('Created Recipe:' + createdRecipe)
  User.findOneAndUpdate(
  { _id: req.payload._id },
  { $push: { recipes: createdRecipe._id } },
  { new: true }
  )
  .then((updatedUser) => {
  console.log("Created new recipe and updated user: ", updatedUser);
  res.status(200).json(createdRecipe);
  })
  .catch((err) => {
  console.error("Error updating user with recipe: ", err);
  next(err);
  });
  })
  .catch((err) => {
  console.error("Error creating recipe: ", err);
  next(err);
  });
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
    .populate({
      path:'feedback',
      populate: { path: 'author' }
    })
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

/////////////////////////////////////////Route for MY recipes///////////////////////////////////

router.get("/recipes/user/:userId", (req, res, next) => {
  const userId = req.params.userId;
  User.findById(userId)
  .populate("recipes")
  .then((user) => {
  const myRecipes = user.recipes;
  res.status(200).json(myRecipes);
  })
  .catch((err) => {
  console.error("Error fetching user's recipes: ", err);
  next(err);
  });
  });



module.exports = router;
