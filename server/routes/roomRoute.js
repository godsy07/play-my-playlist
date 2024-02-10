const express = require("express");
const RoomController = require("../controllers/roomController");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

router.get("/create-roomID", authenticateToken, RoomController.createRoomID);
router.post("/create-room", authenticateToken, RoomController.createRoom);
router.post("/check-room", authenticateToken, RoomController.checkRoom);
router.post("/join-room", authenticateToken, RoomController.joinRoom);
router.post("/get-room-details", RoomController.getRoomDetails);
router.post("/get-room-users", RoomController.getRoomUsers);
router.post("/start-game", RoomController.startGameRoom);
router.post("/reset-room-songs-status", RoomController.resetRoomSongsStatus);
router.post("/delete-room-current-data", RoomController.deleteRoomVotes);

module.exports = router;
