const roomModel = require("../model/roomModel");
const songModel = require("../model/songModel");
const scorePointModel = require("../model/scorePointModel");
const highScoresModel = require("../model/highScoresModel");
const UserModel = require("../model/userModel");
const Joi = require("joi");

const mongoose = require("mongoose");
const voteModel = require("../model/voteModel");
const ObjectId = mongoose.Types.ObjectId;

// Generate random roomID
const createRoomID = async (req, res) => {
  let roomID = createRoomId();
  try {
    let roomData = await roomModel.find({ room_id: roomID });
    // console.log(`arrayLength: ${roomData.length}`);
    while (roomData.length !== 0) {
      // check if roomData exists in collection roomdatas reset to some other roomID
      roomID = createRoomId();
      roomData = await roomModel.find({ room_id: roomID });
    }
  } catch (error) {
    return res.status(500).send(error._message);
  }
  res.send({ roomID });
};

// route to add roomDetails
const createRoom = async (req, res) => {
  try {
    const roomInfo = req.body;
    let output = {};
    console.log(req.body)
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
      host_id: Joi.string().min(3).required(),
      room_name: Joi.string().min(4).max(20).required(),
      player_limit: Joi.number().required().min(3).max(4), // maximum 4 no of players in a room for now
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(6)
        .required(),
      room_rules: Joi.string().allow("").optional().max(300),
    });
    // Validation of details recieved starts here
    const validate = schema.validate(roomInfo);
    const { error } = validate;
    if (error) {
      output.success = false;
      output.message = error.details[0].message;
      return res.status(400).send(output);
    }
    // Check if the room exists return error
    let roomData = await roomModel.find({ room_id: roomInfo.room_id });
    if (roomData.length !== 0) {
      message = "Room already exists";
      return res.status(400).json({ success: false, message });
    } else {
      // Data is being stored in DB
      let roomDetails = await roomModel.create({
        ...roomInfo,
      });
      // const roomData = new roomModel({ ...roomInfo, players: [host_id] });
      // await roomData.save();
      output.roomInfo = roomDetails;
      
      // If Data if fetched successfully send success status with data and message
      output.success = false;
      output.message = "You have successfully created the room.";
      return res.status(200).json(output);
    }
  } catch (error) {
    output.success = false;
    output.message = "Some error occurred in server.";
    return res.status(500).send(output);
  }
};

// Check RoomID exists or NOT
const checkRoom = async (req, res) => {
  const { roomID } = req.body;
  let output = {};
  output.roomID = roomID;
  try {
    let dbRoomID = await roomModel.find({ room_id: roomID });
    if (dbRoomID.length === 0) {
      // Room does not exist
      output.status = "error";
      output.message = "Room server does not exist.";
    } else {
      // Room exists
      output.status = "success";
      output.message = "Room server exists.";
    }
  } catch (error) {
    output.status = "error";
    output.message = error._message;
    return res.status(500).send(output);
  }
  res.send(output);
};

// Route for Joining a particular room
const joinRoom = async (req, res) => {
  try {
    const { room_id, password, player_id } = req.body;
    let output = {};
    // Schema defination for Validation of details recieved
    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .min(6)
        .required(),
    });
    // Validation of details recieved for join room starts here
    const validate = schema.validate({ room_id, password });
    const { error } = validate;
    if (error) {
      output.status = "error";
      output.message = error.details[0].message;
      return res.status(400).json(output);
    }
    let dbJoinRoom = await roomModel.findOne({ room_id });

    if (!dbJoinRoom) {
      message = "Room does not exist with this roomID.";
      return res.status(401).json({ success: false, message });
    }
    // Check if password matches
    const isMatch = await dbJoinRoom.matchPassword(password);
    if (!isMatch) {
      message = "You have entered wrong password.";
      return res.status(401).json({ success: false, message });
    }
    // Check if player limit has reached or not OR Admin of room has joined or not
    let updateUser, roomUsers;

    updateUser = await UserModel.findOneAndUpdate({ _id: player_id },{ active_room: dbJoinRoom._id },{ new: true });

    roomUsers = await UserModel.find({ active_room: dbJoinRoom._id });
    
    output.roomInfo = dbJoinRoom;
    output.updateUser = updateUser;
    output.success = true;
    output.message = "Successfully joined into the room.";
    return res.status(200).json(output);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Some error occured in server." });
  }
};

// Get room Details
const getRoomDetails = async (req, res) => {
  const { room_id } = req.body;
  try {
    const roomDetails = await roomModel
      .find({ room_id })
      .select("-password"); // Fetching all details of room except password and _id

      // console.log(roomDetails);
      
    if (roomDetails.length === 0) {
      return res.status(400).json({ status: "error", message: "Could not fetch room Details." });
    } else {
      // fetch Hostname
      const user = await UserModel.findOne({ _id: roomDetails[0].host_id }).select("-password");
      
      return res.status(200).json({ status: "success", roomDetails: roomDetails[0], hostDetails: user, message: "Successfully fetched room Details." });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", error, message: "Something went wrong in server." });
  }
};

const getUserRoomDetails = async (req, res) => {
  try {
    const { room_id, user_id } = req.body;

    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
      user_id: Joi.string().required(),
    });
    // Validation of details recieved for join room starts here
    const validate = schema.validate({ room_id, user_id });
    const { error } = validate;
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let userRoomData = await UserModel.aggregate([
      {
        $match: { _id: ObjectId(user_id), active_room: ObjectId(room_id) },
      },
      {
        $lookup: {
          from: "songs",
          localField: "_id",
          foreignField: "player_id",
          as: "songs",
        },
      },
      { $addFields: { songsCount: { $size: "$songs" } } },
      {
        $project: {
          activation: 0,
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          game_status: 0,
          "__v": 0,
          "songs.song": 0,
          "songs.player_id": 0,
          "songs.room_id": 0,
          "songs.song_status": 0,
          "songs.__v": 0,
        },
      },
    ]);

    return res.status(200).json({ status: "success", userRoomData: userRoomData[0], message: "Successfully fetched user details of room." });
  } catch(error){
    console.log(error)
    return res.status(500).json({ status: "error", error, message: "Something went wrong in server." });
  }

}


const getRoomUsers = async (req, res) => {
  const { room_id, song_id } = req.body;
  try {
    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
    });
    // Validation of details recieved for join room starts here
    const validate = schema.validate({ room_id });
    const { error } = validate;
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }
    
    let roomUsers = await UserModel.aggregate([
      {
        $match: { active_room: ObjectId(room_id) },
      },
      {
        $lookup: {
          from: "songs",
          localField: "_id",
          foreignField: "player_id",
          as: "songs",
        },
      },
      {
        $lookup: {
          from: "votes",
          as: "vote",
          let: { room_id: "$active_room", player_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$room_id", "$$room_id"] },
                    { $eq: ["$player_id", "$$player_id"] },
                    { $eq: ["$song_id", ObjectId(song_id)] },
                  ],
                },
              },
            },
          ],
        },
      },{
        $lookup: {
          from: "users",
          localField: "vote.voted_player_id",
          foreignField: "_id",
          as: "voted_player",
        },
      },
      // { $unwind: "$vote" },
      // { $unwind: "$voted_player" },
      { $addFields: { songsCount: { $size: "$songs" } } },
      {
        $project: {
          activation: 0,
          password: 0,
          createdAt: 0,
          updatedAt: 0,
          game_status: 0,
          "__v": 0,
          "songs.song": 0,
          "songs.player_id": 0,
          "songs.room_id": 0,
          "songs.song_status": 0,
          "songs.__v": 0,
          "voted_player.email": 0,
          "voted_player.active_room": 0,
          "voted_player.activation": 0,
          "voted_player.password": 0,
          "voted_player.createdAt": 0,
          "voted_player.updatedAt": 0,
          "voted_player.game_status": 0,
          "voted_player.__v": 0,
        },
      },
    ]);

    return res.status(200).json({ success: true, roomUsers, message: "Successfully fetched users of the room." });
  } catch(error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went wrong in server." });
  }
};

// Route for staring the game
const startGameRoom = async (req, res) => {
  const { room_id } = req.body;
  try {
    const gameRoomDetails = await roomModel.find({ room_id });
    if (gameRoomDetails.length === 0) {
      return res.status(400).json({ success: false, message: "Could not find the data you are looking for." });
    }
    // change game status from "not_started" to "started"
    const gameData = await roomModel.findOneAndUpdate({ room_id },{ game_status: "started" },{ new: true });
    
    return res.status(200).json({ success: true, message: "Successfully changed the game status.", gameData });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Some error occurred in the server." });
  }
}

const deleteRoomVotes = async (req, res) => {
  try {
    const { room_id } = req.body;
    
    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
    });
    // Validation of details recieved for join room starts here
    const validate = schema.validate({ room_id });
    const { error } = validate;
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let scores = await scorePointModel.find({ room_id }).select("room_id player_id points");
    // console.log(scores);

    // Delete votes in room
    let exitRoomData = await voteModel.deleteMany({ room_id });
    // Save the score for future
    let savedScores = await highScoresModel.insertMany(scores);
    // Delete scores in room
    exitRoomData = await scorePointModel.deleteMany({ room_id });
    // UpdateSongs status
    exitRoomData = await songModel.update({ room_id },{ song_status: "not_played" });

    return res.status(200).json({ success: true, savedScores, message: "Votes deleted successfully." });
  } catch(error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Something went wrong in server." });
  }
}

const resetRoomSongsStatus = async (req, res) => {
  try{
    const { room_id } = req.body;
    
    const schema = Joi.object({
      room_id: Joi.string().alphanum().min(4).required(),
    });
    // Validation of details recieved for join room starts here
    const validate = schema.validate({ room_id });
    const { error } = validate;
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const updateSongsStatus = await songModel.updateMany({ room_id }, { song_status: "not_played" });
    // const deleteVotes = await voteModel.deleteMany({ room_id });

    return res.status(200).json({ success: true, updateSongsStatus, message: "Room song status successfully been reset." });
  } catch(error) {
    return res.status(500).json({ success: false, message: "Something went wrong in server." });
  }
}

// Function to create a random roomID
function createRoomId() {
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXTZ";
  let lengthOfCode = 6;
  let newCode = "";
  for (let i = 0; i < lengthOfCode; i++) {
    let rnum = Math.floor(Math.random() * characters.length);
    newCode += characters.substring(rnum, rnum + 1);
  }
  return newCode;
}

module.exports = {
  createRoomID,
  createRoom,
  checkRoom,
  joinRoom,
  getRoomDetails,
  getUserRoomDetails,
  getRoomUsers,
  startGameRoom,
  deleteRoomVotes,
  resetRoomSongsStatus,
};
