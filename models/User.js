const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  roles: [
    {
      type: String,
      default: "Admin",
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  refreshToken: String
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
