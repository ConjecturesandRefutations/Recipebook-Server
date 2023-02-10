const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const feedbackSchema = new Schema({
    comment: String,
    score: Number,
    author: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Feedback", feedbackSchema);