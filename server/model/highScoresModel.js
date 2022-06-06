const mongoose = require("mongoose");

const HighScoresSchema = new mongoose.Schema({
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'room',
      required: true,
    },
    player_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    points : {
      type: Number,
      default: 0,
      required: true,
    },
    created_date : {
      type: Date,
      default: Date.now,
    },
  },
);

const highScoresModel = mongoose.model("high_scores", HighScoresSchema);

module.exports = highScoresModel;
