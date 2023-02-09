const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const recipeSchema = new Schema({
  name: String,
  instructions: String,
  imgUrl: { type: String, default: "../images/cutlerynoback.png" },
  isVegetarian: Boolean,
  isVegan: Boolean,
  type: String,
  courseType:{
    type: String,
    enum:["Starter", "Main", "Dessert","Snack", "Other"]
  },
  feedback: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
});

module.exports = model("Recipe", recipeSchema);
