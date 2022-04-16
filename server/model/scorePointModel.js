const mongoose = require("mongoose");

const ScorePointSchema = new mongoose.Schema({
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
  },
  { timestamps: true }
);

const scorePointModel = mongoose.model("score_point", ScorePointSchema);

module.exports = scorePointModel;
