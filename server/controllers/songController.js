const roomModel = require("../model/roomModel");
const songModel = require("../model/songModel");
const voteModel = require("../model/voteModel");
const userModel = require("../model/userModel");
const scorePointModel = require("../model/scorePointModel");
const Joi = require("joi");

// Generate random roomID
const addSong = async (req, res) => {
  const { room_id, player_id, song } = req.body;
  try {
    const gameData = await songModel
      .find({ room_id })
      .select("+song +player_id");
    const songsCount = await songModel
      .where({ room_id: room_id, player_id: player_id })
      .count();
    // Cannot add songs more than 5 songs
    if (songsCount + 1 > 5) {
      return res.status(400).json({
        success: false,
        message: "You can add only 5 songs.",
      });
    }
    let songAdded,
      songExists = false,
      ownSong = false;
    if (gameData.length === 0) {
      songAdded = await songModel.create({ room_id, player_id, song });
    } else {
      gameData.forEach((item) => {
        if (item.song === song) {
          if (item.player_id === player_id) {
            ownSong = true;
          } else {
            songExists = true;
          }
        }
      });
      if (ownSong === true) {
        return res.status(400).json({
          success: false,
          message: "You have already added the song.",
        });
      } else if (songExists === true) {
        return res.status(400).json({
          success: false,
          message: "Song has already been added by someone in the room.",
        });
      } else {
        songAdded = await songModel.create({ room_id, player_id, song });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Song has successfully been added.",
      songAdded,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Some error occured in the server." });
  }
};

const deleteSong = async (req, res) => {
  const { song_id } = req.body;
  try {
    const songData = await songModel.findOne({ _id: song_id });
    if (songData === null) {
      return res.status(400).json({
        success: false,
        message: "Can't find the song you are looking for.",
      });
    } else {
      // const deleteSong = await songModel.findOneAndUpdate({ room_id, player_id }, { songs: songsArray });
      const deletedSong = await songModel.findByIdAndRemove({ _id: song_id });
      return res.status(200).json({
        success: true,
        message: "Song has been deleted.",
        deletedSong,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
};

const getRoomSongs = async (req, res) => {
  const { room_id, player_id } = req.body;
  try {
    const roomData = await songModel.find({ room_id });
    if (roomData.host_id !== player_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are not authorized for this action.",
        });
    }
    const songsData = await songModel.find({ room_id });
    const songsCount = await songModel.where({ room_id: room_id }).count();
    return res.status(200).json({
      success: true,
      message: `Successfully fetched songs of room: ${room_id} .`,
      songsCount,
      songsData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error, message: "Something went wrong." });
  }
};

const getPlayerSongs = async (req, res) => {
  const { room_id, player_id } = req.body;
  try {
    const gameData = await songModel
      .find({ room_id, player_id })
      .select("-room_id -player_id");
    const songsCount = await songModel
      .where({ room_id: room_id, player_id: player_id })
      .count();
    return res.status(200).json({
      success: true,
      message: "Successfully fetched all songs.",
      songsCount: songsCount,
      songsData: gameData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred in server." });
  }
};

const getSongById = async (req, res) => {
  const { song_id } = req.body;
  try {
    const songInfo = await songModel.find({ _id: song_id });
    if (songInfo.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "Coould not find the song." });
    }
    return res.status(200).json({
      success: true,
      songInfo: songInfo[0],
      message: "Successfully fetched the song.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: "Unexpected error in server." });
  }
};

const chooseRandomRoomSong = async (req, res) => {
  const { room_id } = req.body;
  try {
    const roomData = await roomModel.find({ room_id });
    
    if (roomData.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid roomID." });
      }

    const songsData = await songModel.find({ room_id });
    // const songsCount = await songModel.where({ room_id: room_id }).count();

    let song_index = Math.floor(Math.random() * songsData.length); // find a rondom index number for songsData
    let randomSong = songsData[song_index];

    return res
      .status(200)
      .json({
        success: true,
        randomSong,
        songsData,
        song_index,
        message: "Successfully fetched song.",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong in the server." });
  }
};

// Route for voting a particular player
const votePlayer = async (req, res) => {
  const { room_id, song_id, voted_player_id, player_id } = req.body;
  try {
    const schema = Joi.object({
      room_id: Joi.string().min(4).required().label("Room ID"),
      song_id: Joi.string().required().label("Song"),
      voted_player_id: Joi.string().required().label("Voted Player"),
      player_id: Joi.string().required().label("Player ID"),
    });
    // Validation of details recieved starts here
    const validate = schema.validate({ room_id, song_id, voted_player_id, player_id });
    const { error } = validate;
    if (error) {
      message = error.details[0].message;
      return res.status(400).json({ success: false, message });
    }

    let points = 0,
      scoreData,
      votedUserData;

    const songData = await songModel.find({ _id: song_id });
    let voteData = await voteModel.find({ room_id, player_id, song_id });
    let scoreDetails = await scorePointModel.find({ room_id, player_id });
    //Fetch voted user Details
    votedUserData = await userModel
    .find({ _id: voted_player_id });

    // Check for valid inputs
    if (songData.length === 0 || votedUserData.length === 0) {
      return res
      .status(400)
      .json({ success: false, message: "Invalid data input." });
    }


    // Check the player cannot vote themselves
    // if (voted_player_id === player_id) {
    //   return res
    //   .status(400)
    //   .json({ success: false, message: "You cannot vote yourself." });
    // }

    if (voteData.length > 0) {
      // if the voted_id is different then update the record or return error
      if (songData[0].player_id === voteData[0].voted_player_id) {
        points = -10;
      }
    } else {
      voteData = await voteModel.create({
        room_id,
        player_id,
        voted_player_id,
        song_id,
      });
    }

    if (scoreDetails.length === 0) {
      if (songData[0].player_id === voted_player_id) {
        // If voted person is right 10 points
        points = 10;
      }
      scoreData = await scorePointModel.create({ room_id, player_id, points });
    } else {
      if (songData[0].player_id === voted_player_id) {
        // If voted person is right 10 points
        points = 10;
      } else {
        if(scoreDetails[0].points > 5) points = -5;
      }
      points = scoreDetails[0].points + points;
      // if (points < 0) points = 0;

      scoreData = await scorePointModel.findOneAndUpdate(
        { room_id, player_id },
        { points },
        { new: true }
      );

    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Vote Player success.",
        voteData: voteData[0],
        voted_player: votedUserData[0].name.split(" ")[0],
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred in server." });
  }
};

// Route for voting a particular player
const fetchUserVote = async (req, res) => {
  const { room_id, player_id } = req.body;
  try {
    
    return res
      .status(200)
      .json({ success: true, message: "Successfully fetched user vote." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Some error occurred in server." });
    }
  };
  
  const fetchVotedPlayers = async (req, res) => {
    try {
      const {room_id, song_id} = req.body;
      
      const schema = Joi.object({
        room_id: Joi.string().min(4).required().label("Room ID"),
        song_id: Joi.string().required().label("Song"),
      });
      // Validation of details recieved starts here
      const validate = schema.validate({ room_id, song_id });
      const { error } = validate;
      if (error) {
        message = error.details[0].message;
        return res.status(400).json({ success: false, message });
      }

      // Fetch voted info (like songName, players_ids) from db
      const votedData = await voteModel.find({ room_id, song_id });

      return res.status(200).json({ success: true, votedData, message: "Successfully fetched voted info" });
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ success: false, message: "Some error occurred in server." });  
  }
}
  
  const removeVotedSongs = async (req, res) => {
    const { song_id } = req.body;
    try {
      const deletedSong = await songModel.deleteMany({ _id: song_id });
      console.log("deletedSong");
      console.log(deletedSong);
      const deletedVotes = await voteModel.deleteMany({ song_id });
      console.log("deletedVotes");
      console.log(deletedVotes);
      
      return res
      .status(200)
      .json({ success: true, message: "Votes and songs deleted." });
    } catch (error) {
      return res
      .status(500)
      .json({ success: false, message: "Some error occured in the server." });
    }
  };
  
  const fetchPlayersScores = async (req, res) => {
    try {
      const { room_id } = req.body;
      
      const schema = Joi.object({
        room_id: Joi.string().min(4).required().label("Room ID"),
      });
      // Validation of details recieved starts here
      const validate = schema.validate({ room_id });
      const { error } = validate;
      if (error) {
        message = error.details[0].message;
        return res.status(400).json({ success: false, message });
      }

      let scoreData = await scorePointModel.find({ room_id });

      return res
      .status(200)
      .json({ success: true, scoreData, message: "Player scores successfully fetched." });
    } catch(error) {
      return res
        .status(500)
        .json({ success: false, message: "Some error occured in the server." });
    }
  }
  
module.exports = {
  addSong,
  deleteSong,
  getRoomSongs,
  getPlayerSongs,
  getSongById,
  chooseRandomRoomSong,
  votePlayer,
  fetchUserVote,
  fetchVotedPlayers,
  removeVotedSongs,
  fetchPlayersScores,
};
