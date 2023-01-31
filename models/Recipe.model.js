const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: String,
  instructions: String,
  imageUrl: String
});

module.exports = model("Recipe", recipeSchema);
