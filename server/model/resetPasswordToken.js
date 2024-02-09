const mongoose = require("mongoose");

const ResetPasswordSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 300 }, // 5 minutes expiry time
});

const ResetPasswordModel = mongoose.model(
  "reset_pwd_token",
  ResetPasswordSchema,
);

module.exports = ResetPasswordModel;
