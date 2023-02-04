const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: String,
  instructions: String,
  imgUrl: { type: String, default: "../images/cutlerynoback.png" },
  isVegetarian: Boolean,
  isVegan: Boolean,
});

module.exports = model("Recipe", recipeSchema);
