const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Feedback = require("../models/Feedback.model");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware");

//POST /api/recipes/:recipeId/feedback
router.post(
  "/recipes/:recipeId/feedback",
  isAuthenticated,
  (req, res, next) => {
    const { recipeId: id } = req.params;
    const { comment, score, user } = req.body;
    //const { authorId } = req.payload._id;

    User
    .findById(user)
    .then((user) => {
        console.log("the AuthorID is: ", user)
        const author = user
        Feedback.create({ comment, score, author })
        .then((createdFeedback) => {
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
    })
  }
);

router.delete("/feedback/:feedbackId", (req, res, next) => {
  const { feedbackId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(feedbackId)) {
    res.status(400).json({ message: "This feedback id is not valid" });
    return;
  }

  Feedback
  .findByIdAndRemove(feedbackId)
  .then(() =>
    res.json({
      message: `Feedback id ${feedbackId} has been removed successfully`,
    })
  )
  .catch((error) => res.json(error));
});

module.exports = router;
