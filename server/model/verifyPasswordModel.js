const mongoose = require("mongoose");

const VerifyPassword = new mongoose.Schema(
  {
    user_email: {
        type: String,
        required: true,
    },
    pass_code: {
        type: String,
        min: 6,
        max: 6,
        required: true,
    },
  },
  { timestamps: true }
);


const VerifyPasswordModel = mongoose.model("verify_password", VerifyPassword);

module.exports = VerifyPasswordModel;
