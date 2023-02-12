const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: String,
  ingredients: String,
  instructions: String,
  imgUrl: { type: String, default: "../images/cutlerynoback.png" },
  isVegetarian: Boolean,
  isVegan: Boolean,
  courseType:{
    type: String,
    enum:["Starter", "Main", "Dessert","Snack", "Breakfast", "Other"]
  },
  feedback: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
});

module.exports = model("Recipe", recipeSchema);
