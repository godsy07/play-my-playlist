const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
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
  voted_player_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  song_id : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'song',
    required: true,
  },
  current_points : {
    type: Number,
    default: 0,
    required: true,
  },
});

const voteModel = mongoose.model("vote", VoteSchema);

module.exports = voteModel;
