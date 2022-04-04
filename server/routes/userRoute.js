const express = require("express");
const authController = require("../controllers/authUser");
const UserController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/get-data", authenticateToken, authController.getData);
router.get("/get-user-data", authenticateToken, authController.getUserData);
router.post("/check-user-exists", UserController.checkUserExists);
router.post("/sign-up", UserController.createUser);
router.post("/resend-passcode", UserController.resendPassCode);
router.post("/verify-passcode", UserController.verifyPassCode);
router.post("/login", UserController.loginUser);
router.post("/get-user-details", UserController.getUserDetailsByID);
router.get("/logout", UserController.logoutUser);
router.post("/forgot-password", UserController.forgotPassword);
router.post("/userSettings", UserController.userSettings);

module.exports = router;
