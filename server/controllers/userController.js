const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const UserModel = require("../model/userModel");
const verifyPasswordModel = require("../model/verifyPasswordModel");
const { sendMail } = require("../utils/utilFunctions");

// check user exists controller
const checkUserExists = async (req, res) => {
  const { email } = req.body;
  let message = "";
  // fetch data from Model and check if email exists
  try {
    let userData = await UserModel.find({ email });
    // console.log(`arrayLength: ${userData.length}`);
    if (userData.length === 0) {
      // user does not exist
      message = "User does not exist.";
      return res
        .status(400)
        .json({ success: false, message, test: req.cookies });
    } else {
      message = "User already exists.";
      return res
        .status(200)
        .json({ success: true, message, test: req.cookies });
      //   return res.status(200).json({ success: true, data: userData, message });
    }
  } catch (error) {
    message = "Unexpected error occured.";
    return res.status(500).json({ success: false, message });
  }
};

// Create user controller
const createUser = async (req, res) => {
  const userInfo = req.body;
  const { name, email } = req.body;
  let message = "";
  // Schema defination for Validation of details recieved
  const schema = Joi.object({
    name: Joi.string().min(4).required(),
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
    return res.status(400).json({ success: false, message });
  }
  // Add data to database if does not exist already
  let userData = await UserModel.find({ email });
  // Check if User exists and is verified
  if (userData.length !== 0) {
    // user does exists
    if (!userData[0].activation) {
      message = "User exists but has not been activated";
    } else {
      message = "User already does exist";
    }
    return res.status(400).json({ success: false, message });
  } else {
    try {
      // send verify passcodes to email
      verifyUser = await verifyUserSignup(email, name);
      // console.log(verifyUser);
      if (verifyUser.error) {
        return res.status(500).json({
          success: false,
          message: "Something unexpected error occurred",
        });
      }

      // Data is being stored in DB
      const data = await UserModel.create(userInfo);

      message = "Verification passcode sent through email";
      // message = "User account has been created successfully.";
      return res
        .status(200)
        .json({ success: true, userDetails: data, message });
    } catch (error) {
      // message = error.message;
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Some error occurred in the server" });
    }
  }
};

// RESEND Passcode
const resendPassCode = async (req, res) => {
  try {
    const { email } = req.body;
    let verifyUser,
      message = "";
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });
    // Validation of details recieved starts here
    const validate = schema.validate({ email });
    const { error } = validate;
    if (error) {
      message = error.details[0].message;
      return res.status(400).json({ success: false, message });
    }
    // Add data to database if does not exist already
    let userData = await UserModel.find({ email });

    if (userData.length === 0) {
      message = "User does not exist";
    } else {
      if (userData[0].activation) {
        return res.status(400).json({
          success: false,
          message: "User has already been activated",
        });
      }
      let name = userData[0].name;
      // send verify passcodes to email
      verifyUser = await verifyUserSignup(email, name);
      // console.log(verifyUser);
      if (verifyUser.error) {
        return res.status(500).json({
          success: false,
          message: "Something unexpected error occurred",
        });
      }

      message = "Verification passcode sent through email";
    }

    return res.status(200).json({ success: true, message, verifyUser });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred in the server" });
  }
};

// verify passcode
const verifyPassCode = async (req, res) => {
  try {
    const { email, pass_code } = req.body;
    let message = "";
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      email: Joi.string().email().required(),
      pass_code: Joi.string().min(6).max(6).required().label("PassCode"),
    });
    // Validation of details recieved starts here
    const validate = schema.validate({ email, pass_code });
    const { error } = validate;
    if (error) {
      message = error.details[0].message;
      return res.status(400).json({ success: false, message });
    }

    let verifyUserData = await verifyPasswordModel.find({ user_email: email });
    if (verifyUserData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please get pass code to activate your account",
      });
    }

    if (pass_code !== verifyUserData[0].pass_code) {
      message = "You have entered wrong passcode";
      return res.status(400).json({ success: false, message });
    }
    // check if passcode has expired
    const time_now = new Date();
    let time_diff = time_now - verifyUserData[0].updatedAt;
    time_diff = time_diff / 1000; // convert to milliseconds
    // let seconds = Math.floor(time_diff % 60); // get seconds from milliseconds
    let minutes = Math.floor(time_diff / 60); // get minutes from milliseconds
    if (minutes >= 10) {
      message = "Passcode has been expired";
      return res.status(400).json({ success: false, message });
    }
    verifyUserData = await verifyPasswordModel.deleteOne({ user_email: email });
    // Activate user account
    verifyUserData = await UserModel.updateOne(
      { email },
      { $set: { activation: true } },
      { new: true },
    );
    message = "Successfully activated your account";

    return res.status(200).json({ success: true, message });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred in the server" });
  }
};

// Send passcode to email for email verification
const verifyUserSignup = async (user_email, name) => {
  try {
    name = name.split(" ")[0];
    // set a random 6 digits passcode
    let pass_code = Math.floor(100000 + Math.random() * 900000);
    // Send the codes in email to the user
    let send_mail, mail_body, verifyData;

    let check_verify = await verifyPasswordModel.find({ user_email });
    if (check_verify.length === 0) {
      verifyData = await verifyPasswordModel.create({ user_email, pass_code });
      // console.log("create verifyData")
      // console.log(verifyData)
      mail_body = `<i>Hello ${name},</i>
                  <br/><br/>
                  <p>
                    Welcome to Play my Playlist.<br/>
                    To activate your account, here is your passcode: <br/>
                    <h1>${pass_code}</h1><br/>
                    </p>
                    <br/><br/>
                  <p style="font-size: 10px; background-color: yellow"><i><b>Note:</b> Please do not share this passcode to anyone. This is only valid for ${process.env.AUTH_EXPIRES} minutes.</i></p>`;
    } else {
      verifyData = await verifyPasswordModel.updateOne(
        { user_email },
        { $set: { pass_code } },
        { new: true },
      );
      // console.log("updated verifyData")
      // console.log(verifyData)
      mail_body = `<i>Hello ${name},</i>
                    <br/><br/>
                    <p>
                      Here is your activation passcode: <br/>
                      <h1>${pass_code}</h1><br/>
                      </p>
                      <br/><br/>
                    <p style="font-size: 10px; background-color: yellow"><i><b>Note:</b> Please do not share this passcode to anyone. This is only valid for ${process.env.AUTH_EXPIRES} minutes.</i></p>`;
    }

    // console.log(mail_body);
    send_mail = await sendMail(
      user_email,
      `PassCode verification Mail`,
      mail_body,
    );

    return { verifyData, send_mail };
  } catch (error) {
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
      message = "Account has not been activated.";
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
//forgot password
const forgotPassword = async (req, res) => {
  const { user_id, email, password } = req.body;
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
    // updating  password
    const salt = await bcrypt.genSalt(10);
    const value = await bcrypt.hash(password, salt);
    const updatedata = await UserModel.updateOne(
      { email: email },
      { $set: { password: value } },
      { new: true },
    );
    if (!updatedata) {
      message = " Reset password is failed.";
      return res.status(401).json({ success: false, message });
    }
    message = "Successfuly updated password.";
    // res.cookie("playlist_token", token);
    return res.status(200).json({ success: true, updatedata, message });
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
  checkUserExists,
  createUser,
  resendPassCode,
  verifyPassCode,
  loginUser,
  logoutUser,
  getUserDetailsByID,
  forgotPassword,
  userProfileEdit,
};
