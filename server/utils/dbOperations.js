const UserModel = require("../model/userModel");
const RoomModel = require("../model/roomModel");
const SongModel = require("../model/songModel");
const VoteModel = require("../model/voteModel");
const ScorePointModel = require("../model/scorePointModel");


const playerJoinRoom = async (user_id, room_id) => {
  
}

const deletePlayer = async (user_id, room_id) => {
  try {
    const roomInfo = await RoomModel.findOne({ room_id });
    
    let deletedData;
    // deletedData = await ScorePointModel.deleteMany({ room_id, player_id: user_id });
    // console.log('deleted score points');
    console.log(deletedData);
    deletedData = await SongModel.deleteMany({ room_id, player_id: user_id });
    console.log('deleted songs');
    console.log(deletedData);
    deletedData = await VoteModel.deleteMany({ room_id, player_id: user_id });
    console.log('deleted votes');
    console.log(deletedData);
  } catch (error) {
    console.log('Server Error');
    console.log(error);
  }
};

const removeVotedSongs = async (song_id) => {
  try {
    const deletedSong = await SongModel.deleteMany({ _id: song_id });
    const deletedVotes = await VoteModel.deleteMany({ song_id });
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = { deletePlayer, removeVotedSongs };
