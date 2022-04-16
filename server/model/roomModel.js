const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RoomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    min: 4,
    required: true,
  },
  host_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  game_status: {
    type: String,
    default: "not_started",
    required: true,
  },
  room_name: {
    type: String,
    min: 4,
    required: true,
  },
  players: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
    required: true,
  },
  password: {
    type: String,
    min: [6, "Please choose more secure password atleast 6 characters."],
    required: true,
  },
  player_limit: {
    type: Number,
    required: true,
    default: 1,
    validate(value) {
      if (value < 0) throw new Error("No of players cannot be negative.");
    },
  },
  room_rules: {
    type: String,
    max: 300,
    required: false,
  },
});

RoomSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

RoomSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const roomModel = mongoose.model("room", RoomSchema);

module.exports = roomModel;
