const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
  room_id: {
    type: String,
    min: 4,
    required: true,
  },
  player_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const chatMessageModel = mongoose.model("chatMessage", chatMessageSchema);

module.exports = chatMessageModel;
