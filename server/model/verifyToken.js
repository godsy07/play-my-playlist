const mongoose = require("mongoose");

const VerifyTokenSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 }, // 1 hour expiry time
});

const VerifyTokenModel = mongoose.model("verify_token", VerifyTokenSchema);

module.exports = VerifyTokenModel;
