const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
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
  song: {
    type: String,
    required: true,
  },
  song_status: {
    type: String,
    default: "not_played",  // played, not_played,
  },
});

const songModel = mongoose.model("song", SongSchema);

module.exports = songModel;
