const roomModel = require("../model/roomModel");
const songModel = require("../model/songModel");
const UserModel = require("../model/userModel");
const Joi = require("joi");

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
      no_of_players: Joi.number().required().min(3).max(4), // maximum 4 no of players in a room for now
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
    return res.status(400).send(output);
  }
  try {
    let dbJoinRoom = await roomModel.findOne({ room_id }).select("+password");
    // console.log(dbJoinRoom);

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
    // Adding new players joining room in
    let players = [...dbJoinRoom.players];
    if (players.length !== 0) {
      let exist = false, adminExist = false;
      // Check for each item if the id already there in document
      players.forEach((item) => {
        if (item === player_id) exist = true;
        if (item === dbJoinRoom.host_id) adminExist = true;
      });
      // If player Id does not already exist in array push it in players array and save it in document
      if (!exist) {
        if (!adminExist) {
          // check if admin has not joined, keep one space for them to start the game
          if (dbJoinRoom.no_of_players === players.length - 1) {
            return res.status(501).json({ success: false, message: "Player limit has reached." });
          }
        }
        // Check if the limit of number of players is exceeded if new player is added
        if (dbJoinRoom.no_of_players < players.length + 1) {
          return res.status(501).json({ success: false, message: "Room player limit has reached." });
        }
        players.push(player_id);
        dbJoinRoom.players = players;
        await dbJoinRoom.save();

        let updateUser = await UserModel.update({ _id: player_id },{ active_room: room_id }, { new: true });

      }
    }
    
    output.roomInfo = dbJoinRoom;
    output.updateUser = updateUser;
    output.status = "success";
    output.message = "Successfully joined into the room.";
    return res.status(200).json(output);
  } catch (error) {
    output.status = "error";
    output.message = error._message;
    return res.status(500).send(output);
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

const getRoomUsers = async (req, res) => {
  const { room_id } = req.body;
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

    const roomUsers = await UserModel.find({ active_room: room_id });

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
  getRoomUsers,
  startGameRoom,
};
