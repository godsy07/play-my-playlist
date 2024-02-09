const jwt = require("jsonwebtoken");
const UserModel = require("../model/userModel");

const getData = async (req, res) => {
  return res.json({
    auth: true,
    data: req.tokenData,
    message: "Successfully fetched User data.",
  });
};

const getUserData = async (req, res) => {
  try {
    let tokenData = req.tokenData;
    const user = await UserModel.findById(tokenData.id)
      .select("-password")
      .lean();
    return res.json({
      status: true,
      user,
      message: "Successfully fetched User data.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Failed to fetch user data." });
  }
};

module.exports = { getData, getUserData };
