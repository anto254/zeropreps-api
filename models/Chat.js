const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    adminUnread: { type: Number, default: 0 },
    messages: [
      {
        senderId: { type: String, required: false },
        message: { type: String, required: false },
        createdAt: { type: Date, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;