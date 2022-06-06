const express = require("express");
const authController = require("../controllers/authUser");
const UserController = require("../controllers/userController");
const { authenticateToken } = require("../middlewares/auth");

const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      let extension = file.originalname.split(".")[file.originalname.split(".").length - 1];
      let randomValue = Math.floor(1000 + Math.random() * 9000);
      cb(null, file.fieldname + "__" + uniqueSuffix + "-" + randomValue + "." + extension);
    }
  })
  
const upload = multer({ storage: storage });

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
router.post("/user-update", upload.single('profile_pic'), UserController.userProfileEdit);

module.exports = router;
