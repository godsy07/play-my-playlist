const express = require("express");
const RoomController = require("../controllers/roomController");

const router = express.Router();

router.get("/create-roomID", RoomController.createRoomID);
router.post("/create-room", RoomController.createRoom);
router.post("/check-room", RoomController.checkRoom);
router.post("/join-room", RoomController.joinRoom);
router.post("/get-room-details", RoomController.getRoomDetails);
router.post("/get-room-users", RoomController.getRoomUsers);
router.post("/start-game", RoomController.startGameRoom);
router.post("/reset-room-songs-status", RoomController.resetRoomSongsStatus);

module.exports = router;
