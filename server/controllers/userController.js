const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const fs = require("fs");

const UserModel = require("../model/userModel");
const verifyPasswordModel = require("../model/verifyPasswordModel");
const { sendMail } = require("../utils/utilFunctions");
const VerifyTokenModel = require("../model/verifyToken");
const ResetPasswordModel = require("../model/resetPasswordToken");

// Create user controller
const createUser = async (req, res) => {
  const userInfo = req.body;
  const { user_name, email } = req.body;
  let message = "";
  // Schema defination for Validation of details recieved
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
    user_name: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(6)
      .required(),
  });
  // Validation of details recieved starts here
  const validate = schema.validate(userInfo);
  const { error } = validate;
  if (error) {
    message = error.details[0].message;
    return res.status(400).json({ status: false, message });
  }

  const userNameData = await UserModel.findOne({ user_name });
  if (userNameData) {
    return res
      .status(400)
      .json({ status: false, message: "This username already exists." });
  }

  // Add data to database if does not exist already
  let userData = await UserModel.findOne({ email });
  // Check if User exists and is verified
  if (userData) {
    // user does exists
    if (!userData.activation) {
      message =
        "Please verify your email using verification link to continue with login.";
      const verifyUser = await verifyUserSignup(userData._id, email);
      if (verifyUser.error) {
        return res.status(500).json({
          status: false,
          message: "Could not send email verification link.",
        });
      }
    } else {
      message = "User already does exist";
    }
    return res.status(400).json({ status: false, message });
  } else {
    try {
      // Data is being stored in DB
      const data = await UserModel.create(userInfo);

      const verifyUser = await verifyUserSignup(data._id, email);
      if (verifyUser.error) {
        return res.status(500).json({
          status: false,
          message: "Could not send email verification link.",
        });
      }

      message = "Please verify email using verification link in email.";
      return res.status(200).json({ status: true, user: data, message });
    } catch (error) {
      // message = error.message;
      console.log(error);
      return res
        .status(500)
        .json({ status: false, message: "Some error occurred in the server" });
    }
  }
};

// verify passcode
const verifyEmail = async (req, res) => {
  try {
    const { user_id, token } = req.body;
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      user_id: Joi.string().required().label("User ID"),
      token: Joi.string().required().label("Token"),
    });
    // Validation of details recieved starts here
    const validate = schema.validate({ user_id, token });
    const { error } = validate;
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    // check valid user id
    const user = await UserModel.findById(user_id);
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exist" });
    }

    if (!user.activation) {
      // check if token exists
      const tokenData = await VerifyTokenModel.findOne({ user_id, token });
      if (!tokenData) {
        const verifyUser = await verifyUserSignup(user._id, user.email);
        if (verifyUser.error) {
          return res.status(500).json({
            status: false,
            message: "Could not send email verification link.",
          });
        }
      }
      // if valid token, delete token record
      await VerifyTokenModel.deleteOne({ user_id, token });
      // activate the user
      await UserModel.updateOne({ _id: user_id }, { activation: true });
    }

    let expireTime = "7d";
    const jwtToken = jwt.sign(
      { id: user._id, user_name: user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: expireTime },
    );

    return res.status(200).json({
      status: true,
      token: jwtToken,
      message: "Your account has been activated.",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, message: "Some error occurred in the server" });
  }
};

// Send passcode to email for email verification
const verifyUserSignup = async (user_id, to_email) => {
  try {
    let token = await VerifyTokenModel.findOne({
      user_id: user_id,
    });

    if (!token) {
      token = await new VerifyTokenModel({
        user_id: user_id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    } else {
      await VerifyTokenModel.updateOne(
        { user_id },
        { $set: { token: crypto.randomBytes(32).toString("hex") } },
        { new: true },
      );
      token = await VerifyTokenModel.findOne({
        user_id: user_id,
      });
    }

    const link = `${process.env.CLIENT_URL}/user/${user_id}/verify/${token.token}`;

    const mail_body = `<p>Click on below link to verify your email:<br/>${link}</p>`;
    const mail = await sendMail(
      to_email,
      `Email Verification for Play-My-Playlist`,
      mail_body,
    );

    return { mail };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

// Controller to login User
const loginUser = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  let message = "";
  // Schema defination for Validation of details recieved
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(6)
      .required(),
  });
  // Validation of details recieved starts here
  const validate = schema.validate({ email, password });
  const { error } = validate;
  if (error) {
    message = error.details[0].message;
    return res.status(400).json({ success: false, message });
  }

  // Testing STARTS here
  try {
    const user = await UserModel.findOne({ email }).select("+password");
    // If user does not exist
    if (!user) {
      message = "Account does not exist with this emailID.";
      return res.status(401).json({ success: false, message });
    }
    if (!user.activation) {
      message =
        "Please verify your email using verification link to continue with login.";
      const verifyUser = await verifyUserSignup(userData._id, email);
      if (verifyUser.error) {
        return res.status(500).json({
          status: false,
          message: "Could not send email verification link.",
        });
      }
      return res.status(401).json({ success: false, message });
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      message = "You have entered wrong password.";
      return res.status(401).json({ success: false, message });
    }
    message = "Successfuly fetched User info.";
    let expireTime;
    // set Expire time 10 days if remember me is checked else 10 hours
    if (rememberMe) {
      expireTime = process.env.JWT_EXPIRE;
    } else {
      expireTime = "10h";
    }
    const token = jwt.sign(
      { id: user._id, user_name: user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: expireTime },
    );
    // res.cookie("playlist_token", token);
    return res.status(200).json({ success: true, token, message });
  } catch (error) {
    message = error._message;
    return res.status(500).json({ success: false, message });
  }
};

const sendPasswordLink = async (req, res) => {
  try {
    const { email } = req.body;
    let message = "";
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    // Validation of details recieved starts here
    const validate = schema.validate({ email });
    const { error } = validate;
    if (error) {
      message = error.details[0].message;
      return res.status(400).json({ success: false, message });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User with this email does not exist.",
      });
    }

    const user_id = user._id;
    let token = await ResetPasswordModel.findOne({
      user_id: user_id,
    });

    if (!token) {
      token = await new ResetPasswordModel({
        user_id: user_id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    } else {
      await ResetPasswordModel.updateOne(
        { user_id },
        { $set: { token: crypto.randomBytes(32).toString("hex") } },
        { new: true },
      );
      token = await ResetPasswordModel.findOne({
        user_id: user_id,
      });
    }

    const link = `${process.env.CLIENT_URL}/reset-password/${user_id}/verify/${token.token}`;

    const mail_body = `<p>Click on below reset your password:<br/>${link}</p>`;
    const mail = await sendMail(
      to_email,
      `Reset Password for Play-My-Playlist`,
      mail_body,
    );
    if (mail.error) {
      return res.status(500).json({
        status: false,
        message: "Could not send reset password link.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Reset password link has been sent to your email.",
    });
  } catch (e) {
    return res
      .status(500)
      .json({ status: false, message: "Something went wrong in server." });
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  const { user_id, password } = req.body;
  let message = "";
  // Schema defination for Validation of details recieved
  const schema = Joi.object({
    user_id: Joi.string().required().label("User ID"),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .min(6)
      .required()
      .label("Password"),
  });
  // Validation of details recieved starts here
  const validate = schema.validate({ user_id, password });
  const { error } = validate;
  if (error) {
    message = error.details[0].message;
    return res.status(400).json({ success: false, message });
  }

  // Testing STARTS here
  try {
    const user = await UserModel.findById(user_id).select("+password");
    // If user does not exist
    if (!user) {
      message = "User does not exist.";
      return res.status(401).json({ success: false, message });
    }
    // updating  password
    const salt = await bcrypt.genSalt(10);
    const value = await bcrypt.hash(password, salt);
    await UserModel.updateOne(
      { _id: user_id },
      { $set: { password: value } },
      { new: true },
    );

    message = "Successfuly updated password.";
    // res.cookie("playlist_token", token);
    return res.status(200).json({ success: true, message });
  } catch (error) {
    message = error._message;
    return res.status(500).json({ success: false, message });
  }
};

//userSettings
const userProfileEdit = async (req, res) => {
  const { user_id, new_password, old_password, confirm_new_password } =
    req.body;
  const profilePic = req.file;
  let message = "",
    profile_pic_url = null;
  // let file_location = "";
  if (profilePic) {
    //   // Upload the image and save it in the db
    profile_pic_url = profilePic.destination + "/" + profilePic.filename;
    // profile_pic_url = profilePic.path;
  }

  // Schema defination for Validation of details recieved
  const schema = Joi.object({
    user_id: Joi.string().required().label("User ID"),
    old_password: Joi.string().min(6).required().label("Old Password"),
    new_password: Joi.string().min(6).required().label("New Password"),
    confirm_new_password: Joi.any()
      .valid(Joi.ref("new_password"))
      .required()
      .label("Confirm Password"),
  });
  // Validation of details recieved starts here
  const validate = schema.validate({
    user_id,
    new_password,
    old_password,
    confirm_new_password,
  });
  const { error } = validate;
  if (error) {
    message = error.details[0].message;
    if (profilePic) {
      fs.unlinkSync(profilePic.path);
    }
    return res.status(400).json({ success: false, message });
  }

  // Fetch and update the data
  try {
    const user = await UserModel.findOne({ _id: user_id }).select("+password");
    // If user does not exist
    if (!user) {
      fs.unlinkSync(profilePic.path);
      message = "Account you are looking for does not exist.";
      return res.status(400).json({ success: false, message });
    }

    if (user.profile_pic_url !== null && profile_pic_url !== null) {
      // fs.unlinkSync(user.profile_pic_url);
    }

    let updatedData = null;
    const isMatch = await user.matchPassword(old_password);
    if (!isMatch) {
      fs.unlinkSync(profilePic.path);
      message = "You have entered old password is wrong.";
      return res.status(401).json({ success: false, message });
    }
    // If already exist file delete it
    // updating details
    if (profile_pic_url === null) {
      updatedData = await UserModel.update(
        { _id: user_id },
        { password: new_password },
        { new: true },
      );
    } else {
      updatedData = await UserModel.update(
        { _id: user_id },
        { password: new_password, profile_pic_url: profilePic.filename },
        { new: true },
      );
    }
    if (!updatedData) {
      message = "Could not reset password.";
      return res.status(401).json({ success: false, message });
    }
    message = "Successfuly updated user profile.";

    // return res.status(200).json({ success: true, message });
    return res.status(200).json({ success: true, updatedData, message });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong in server." });
  }
};

const getUserDetailsByID = async (req, res) => {
  const { user_id } = req.body;
  let message;
  try {
    const userInfo = await UserModel.findById(user_id).select("-password");
    // console.log(userInfo);
    return res.status(200).json({
      success: true,
      userInfo,
      message: "Successfully fetched userInfo.",
    });
  } catch (error) {
    message = error._message;
    return res.status(500).json({ success: false, message });
  }
};

const logoutUser = async (req, res) => {
  return res
    .status(200)
    .json({ status: true, data: "Successfully logged out of your account." });
};

module.exports = {
  createUser,
  verifyEmail,
  loginUser,
  sendPasswordLink,
  logoutUser,
  getUserDetailsByID,
  forgotPassword,
  userProfileEdit,
};
