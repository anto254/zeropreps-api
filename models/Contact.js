const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    email: String,
    title: String,
    message: String,
  },
  {
    timestamps: true,
  }
);

const contactModel = model("Contact", contactSchema);

module.exports = contactModel;
