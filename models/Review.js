const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    name: String,
    review: String,
    time:String,
    star: Number,
  },
  {
    timestamps: true,
  }
);

const ReviewModel = model("Review", reviewSchema);

module.exports = ReviewModel;
