const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Feedback = require("../models/Feedback.model");
const Recipe = require("../models/Recipe.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//POST /api/recipes/:recipeId/feedback
router.post(
  "/recipes/:recipeId/feedback",
  isAuthenticated,
  (req, res, next) => {
    const { recipeId: id } = req.params;
    const { comment, score } = req.body;
    const { author } = req.payload._id;

    Feedback.create({ comment, score, author })
      .then((createdFeedback) => {
        //res.status(200).json(createdFeedback);
        Recipe.findByIdAndUpdate(
          id,
          { $push: { feedback: createdFeedback._id } },
          { new: true }
        )
          .then((updatedRecipe) => {
            console.log("Feedback created and updated Recipe: ", updatedRecipe);
            res.status(200).json(updatedRecipe);
          })
          .catch((err) => {
            console.error("Error updating Recipe with Feedback: ", err);
          });
      })
      .catch((err) => {
        console.error("Error creating Feedback: ", err);
        next(err);
      });
  }
);

module.exports = router;
