import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ToastContainer,
  ToastHeader,
  Toast,
  Modal,
} from "react-bootstrap";
import ReactPlayer from 'react-player';
import axios from "axios";
import Peer from "peerjs";
import io from "socket.io-client";

import { DATA_URL } from "../../index";
import Swal from "sweetalert2";
import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";
import {
  FaPlay,
  FaMusic,
  FaCloudUploadAlt,
  FaPlus,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";

import "./dashboard.styles.css";
import moment from "moment";
import PlayInstructionsModal from "../../components/PlayInstructions/PlayInstructions";
import FloatingTextBlock from "../../components/layouts/FloatingTextBlock/FloatingTextBlock";
import PlayerDashboard from "../PlayerDashboard/PlayerDashboard";
import GameRoom from "../GameRoom/GameRoom";
// import { NotificationToast } from "../../functionalities/pageFunctions";

let socket;
let myPeer = new Peer();

const Dashboard = (props) => {
  let history = useHistory();

  const {id, room_id} = useParams()
  
  const ENDPOINT = DATA_URL;
  const [GameStatus, setGameStatus] = useState("not_started");
  const [GameEvent, setGameEvent] = useState("start");
  const [joinRoomStatus, setJoinRoomStatus] = useState(false);
  const [userID, setUserID] = useState("");
  const [roomID, setRoomID] = useState(room_id);
  const [roomObjID, setObjRoomID] = useState(id);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [hostName, setHostName] = useState("");
  const [hostID, setHostID] = useState("");
  const [hostProfilePic, setHostProfilePic] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [roomDetails, setRoomDetails] = useState(null); // For room Details to be saved
  const [message, setMessage] = useState("");
  const [chatBoxData, setChatBoxData] = useState([]);
  const [currentSongID, setCurrentSongID] = useState("");
  const [currentSong, setCurrentSong] = useState("");

  const [votedPlayer, setVotedPlayer] = useState("");
  const [votedData, setVotedData] = useState([]);

  const [PlayerSongCount, setPlayerSongCount] = useState(null);
  const [songLink, setSongLink] = useState("");
  const [PlayerSongsList, setPlayerSongsList] = useState([]);
  const [showRules, setShowRules] = useState(false);
  const [RoomSongs, setRoomSongs] = useState([]);
  const [RoomSongsCount, setRoomSongsCount] = useState("");

  const [streamVideo, setStreamVideo] = useState(null);
  const [passAudio, setPassAudio] = useState(false);
  const [passVideo, setPassVideo] = useState(false);

  const [showScoreboard, setShowScoreboard] = useState("hide");
  const [scoresData, setScoresData] = useState([]);
  const [answerData, setAnswerData] = useState([]);
  const [roomScores, setRoomScores] = useState(false);
  const [allPlayersVoted, setAllPlayersVoted] = useState(false);
  const [toastData, setToastData] = useState(null);
  // const [notifyData, setNotifyData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  
  const [showPlaySong, setShowPlaySong] = useState(false);
  const [songURL, setSongURL] = useState("");
  
  const [showVoteCollectModal,setShowVoteCollectModal] = useState(false);

  // Function to set user Details
  const setUserDetails = () => {
    // Set userID, UserName/GuestName, RoomID
    setUserID(props.userInfo._id);
    setGuestName(props.userInfo.name);
    // setRoomID(room_id);
    fetchRoomDetails(room_id);
    fetchRoomPlayers(id);
    fetchSongs(id, props.userInfo._id);
  };

  // Function to fetch room Details
  const fetchRoomDetails = async (room_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/get-room-details`,
        { room_id }
      );

      if (response.status === 200) {
        console.log("fetchRoomDetails function called");
        // console.log(response);
        setRoomDetails(response.data.roomDetails);
        setObjRoomID(response.data.roomDetails._id);
        setHostName(response.data.hostDetails.name);
        setHostID(response.data.hostDetails._id);
        // set host profile pic
        let profile_pic = response.data.hostDetails.profile_pic_url;
        setHostProfilePic(profile_pic && DATA_URL +"/"+ profile_pic);
      }

    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error.response.data.message,
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: "Something went wrong.",
        });
      }
    }
  };

  // Function to fetch room Players
  const fetchRoomPlayers = async (room_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/get-room-users`,
        { room_id }
      );
      
      if (response.status === 200) {
        console.log("fetchRoomPlayers function called");
        console.log(response);
        setRoomPlayers(response.data.roomUsers);
      }

    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error.response.data.message,
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: "Something went wrong.",
        });
      }
    }
  };

  // Function to fetch songs of the user
  const fetchSongs = async (room_id, player_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/get-player-songs`,
        {
          room_id,
          player_id,
        }
      );

      if (response.status === 200) {
        console.log("fetchSongs called");
        console.log(response.data);
        // Reset song input data to empty
        setPlayerSongsList(response.data.songsData);
        setPlayerSongCount(response.data.songsCount);
        return;
      }

    } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops..",
        //   text: error.response.data.message,
        // });
      } else {
        console.log(error);
        // Swal.fire({
        //   icon: "error",
        //   title: "Oops..",
        //   text: "Something went wrong.",
        // });
      }
    }
  };
  
  const fetchVotedPlayers = async (room_id, song_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/fetch-voted-players`,
        {
          room_id,
          song_id,
        }
      );

      if (response.status === 200) {
        console.log("fetchVotedPlayers");
        console.log(response);
        // Fetch voted players data with roomUsers data to mark who voted whom
        
        // let allVoted = true;
        // room_users.forEach((user) => {
        //   // turn userLeft to true, if someone has not voted (i.e. their vote data does not exist in response)
        //   if (
        //     !response.data.votedData.find(
        //       (data) => data.player_id === user.user_id
        //     )
        //   ) {
        //     allVoted = false;
        //   }
        // });
        // setAllPlayersVoted(allVoted);
        // fetchScores(allVoted);
        // Loop through voted players and roomplayers to find player names to display
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    // Run only on mounting of all components
    if (!props.location.state) {
      console.log("room_id does not exist");
      history.push("/joinRoom");
    }
    setUserDetails();
  },[]);

  useEffect(() => {
    socket = io(ENDPOINT);
    
    // let conn = myPeer.connect(props.userInfo._id);
    
    // myPeer.on("connection", function (conn) {
    //   conn.on("data", function (data) {
    //     // Will print 'hi!'
    //     console.log("peer js connection done");
    //     console.log(data);
    //   });
    // });

      if (userID.length !== 0) {
      if (!joinRoomStatus) {
        socket.emit("join_room", {
          user_id: userID,
          room_id: roomID,
          name: guestName,
          songs_list: PlayerSongsList,
          song_count: PlayerSongCount,
        });
        setJoinRoomStatus(true);
      }

      socket.on("message", (message) => {
        console.log(message);
        setChatBoxData((chatBoxData) => [...chatBoxData, message]);
      });

      socket.on("game_status", ({ game_status }) => {
        if (game_status === true) {
          setGameEvent("start");
          setGameStatus("started");
          resetRoomSongs(roomObjID);
          handlePickRandomSong(roomObjID);
          setToastData({
            title: "Success",
            message: "Welcome, the game is ON...!!!",
            type: "success",
            time: new Date(),
          });
          setShowToast(true);
          return;
        }
      });

      socket.on("recieve-song", ({ song_details, room_id }) => {
        console.log("recieve-song");
        console.log(song_details)
        if (song_details) {
          checkPlayerVotedStatus(song_details.room_id, song_details._id);
          setCurrentSongID(song_details._id);
          setCurrentSong(song_details.song);
        } else {
          setCurrentSongID("");
          setCurrentSong("");
          fetchRoomScores(room_id);
          setGameEvent("finish");
        }
      });

      socket.on("change_game_event", ({ game_event, song_id, room_obj_id }) => {
        console.log("next game event")
        if (game_event === "results") {
          setGameEvent("results");
        } else if (game_event === "next") {
          setGameEvent("next");
          fetchScores(song_id, room_obj_id);
        } else if (game_event === "start") {
          setShowScoreboard("hide"); // Hide scoreboard
          let status = handlePickRandomSong(room_obj_id);
          if (status) {
            setGameEvent("start");
          }
        } else if (game_event === "end") {
          setGameEvent("end");
          setShowScoreboard("hide");
          fetchRoomScores(room_id);
        } else if (game_event === "exit") {
          // console.log("Game ends here");
          console.log("Time to exit");
          Swal.fire({
            title: "Do you really want to exit?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
              history.push("/joinRoom");
              return;
            } else if (result.isDenied) {
              return;
            }
          });
          // history.push("/joinRoom");
        }
      })


      socket.on("roomUsers", ({ users }) => {
        console.log("roomUsers");
        if (users) {
          // setRoomPlayers(users);
          fetchRoomPlayers(roomObjID);
        }
      });

      socket.on(
        "fetchVoters",
        async ({ song_id }) => {
          console.log("fetchVoters");
          await fetchVotedPlayers(roomObjID, song_id);
        }
      );

      socket.on("notification", ({ success, message }) => {
        console.log({ success, message });
        setToastData({
          title: "Success",
          message: message,
          type: "success",
          time: new Date(),
        });
        setShowToast(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userID]);

  useEffect(() => {
    // Cleanup function to be run on Unmounting the component
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Access the user's video and audio
    navigator.mediaDevices
      .getUserMedia({
        video: passVideo,
        audio: passAudio,
      })
      .then((stream) => {
        setStreamVideo(stream);
        // roomPlayers
      }).catch(err => {
        console.log(err)
        console.log(err.name)
        if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
            //required track is missing 
        } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
            //webcam or mic are already in use 
        } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
            //constraints can not be satisfied by avb. devices 
        } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
            //permission denied in browser 
        } else if (err.name == "TypeError" || err.name == "TypeError") {
            //empty constraints object 
        } else {
            //other errors 
        }
      });
  }, [passAudio, passVideo])

  useEffect(() => {
    setTimeout(() => {
      if (showToast) {
        setShowToast(false);
        setToastData(null);
      }
    }, 3000)
  }, [showToast]);

  // Function to emit Chat messages to Socket IO
  const emitChatMessages = () => {
    socket.emit("chat_message", {
      user_id: userID,
      room_id: roomID,
      name: guestName,
      message: message,
    });
  };

  const fetchRoomScores = async (room_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/fetch-room-scores`,
        {
          room_id,
        }
      );
      console.log("Fetch scores of the room");
      if (response.status === 200) {
        console.log(response.data);
        setRoomScores(true);
        setScoresData(response.data.scoreData);
        setShowScoreboard("show_scores"); // Show scoreboard
      } else {
        setToastData({
          title: "Wait...",
          message: response.data.message,
          type: "warning",
          time: new Date(),
        });
        setShowToast(true);
      }
      // check votes to display scoreboard
      // then fetch new song if exists, or display exiyt room option
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  }

  const resetRoomSongs = async (room_id) => {
    try {
      const response = await axios.post(`${DATA_URL}/playlist/api/room/reset-room-songs-status`, {
        room_id
      });

      if (response.status === 200) {
        console.log("Reset Songs status");
        console.log(response);
      }

    } catch(error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  }
  // Check player vote status
  const checkPlayerVotedStatus = async (room_id, song_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/check-vote-status`,
        {
          room_id,
          song_id,
          // room_id: roomObjID,
          // song_id: currentSongID,
        }
      );

      if (response.status === 200) {
        console.log("checking player voted status");
        // console.log(response);
        // console.log("players");
        // console.log(roomPlayers);
        setVotedData(response.data.votedPlayers);
        // let tempArr;
        // roomPlayers.forEach((data) => {
        //   let tempObj = {};
        //   // if this player exists in voted list, then add their details
        //   response.data.votedPlayers.find(item => {
        //     if (data._id === item.) {}
        //   }) 
        // })
      }

    } catch(error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  }

  // Fetch Scores
  const fetchScores = async (song_id, room_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/fetch-players-scores`,
        {
          room_id,
          song_id,
        }
      );
      console.log("Fetch scores of players");
      if (response.status === 200) {
        console.log(response.data);
        setScoresData(response.data.scoreData);
        setAnswerData(response.data.songData);
        setShowScoreboard("show_scores"); // Show scoreboard
      } else {
        setToastData({
          title: "Wait...",
          message: response.data.message,
          type: "warning",
          time: new Date(),
        });
        setShowToast(true);
      }
      // check votes to display scoreboard
      // then fetch new song if exists, or display exiyt room option
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };

  const checkAllVotes = async () => {
    try {
      console.log("Check if all players voted");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/check-all-votes`,
        {
          room_id: roomObjID,
          song_id: currentSongID,
        }
      );
      if (response.status === 200) {
        
        // setToastData({
        //   title: "Success",
        //   message: response.data.message,
        //   type: "success",
        //   time: new Date(),
        // });
        // setShowToast(true);
        return true;
        
      }
      return false;
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
      return false;
    }
  };

  const handleCollectVotes = async () => {
    if (hostID === userID) {
      let all_voted = await checkAllVotes();
      if (all_voted) {
        socket.emit("game_event",{
          game_event: "results",
        });
      } else {
        setToastData({
          title: "Wait...",
          message: "All players have not voted.",
          type: "warning",
          time: new Date(),
        });
        setShowToast(true);

      }
    } else {
      setToastData({
        title: "Oops...",
        message: "Action allowed only to room host",
        type: "warning",
        time: new Date(),
      });
      setShowToast(true);
    }
  }

  const handleCheckResults = async () => {
    if (hostID === userID) {
      changeSongStatus("played");
      socket.emit("game_event",{
        game_event: "next",
        song_id: currentSongID,
        room_obj_id: roomObjID
      });
    } else {
      setToastData({
        title: "Oops...",
        message: "Action allowed only to room host",
        type: "warning",
        time: new Date(),
      });
      setShowToast(true);
    }
  }
  const handleNextSong = () => {
    if (hostID === userID) {
      socket.emit("game_event",{
        game_event: "start",
        room_obj_id: roomObjID
      });
    } else {
      setToastData({
        title: "Oops...",
        message: "Action allowed only to room host",
        type: "warning",
        time: new Date(),
      });
      setShowToast(true);
    }
  }
  const handleFinishGame = () => {
    if (hostID === userID) {
      socket.emit("game_event",{
        game_event: "end",
        room_obj_id: roomObjID
      });
    } else {
      setToastData({
        title: "Oops...",
        message: "Action allowed only to room host",
        type: "warning",
        time: new Date(),
      });
      setShowToast(true);
    }
  }
  const handleExitRoom = () => {
    if (hostID === userID) {
      socket.emit("game_event",{
        game_event: "exit",
        room_obj_id: roomObjID
      });
      // delete votes and store scores in some other collection (i.e. high_scores) then delete scores for the room in score_points
    } else {
      setToastData({
        title: "Oops...",
        message: "Action allowed only to room host",
        type: "warning",
        time: new Date(),
      });
      setShowToast(true);
    }
  }

  // Function to add songs to the list
  const addSongs = async (e) => {
    e.preventDefault();
    if (songLink === "") {
      Swal.fire({
        icon: "warning",
        title: "Song Link Empty",
        text: "Song Link cannot be empty.",
      });
      return;
    }
    try {
      console.log("add songs function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/add-song`,
        {
          room_id: roomObjID,
          player_id: userID,
          song: songLink,
        }
      );
      if (response.status === 200) {
        fetchSongs(roomObjID, userID);
        // fetchRoomPlayers(roomID);
        socket.emit("add_songs", {
          name: guestName,
          new_song: songLink,
        });
        setToastData({
          title: "Success",
          message: response.data.message,
          type: "success",
          time: new Date(),
        });
        setShowToast(true);
        // Reset song input data to empty
        setSongLink("");
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: response.data.message,
        });
        return;
      }
    } catch (error) {
      // console.log(error);
      if (error.response.data.message) {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops..",
          text: "Something went wrong.",
        });
      }
    }
  };

  const handleDeleteSong = async (e, song_id, song_name) => {
    e.preventDefault();
    try {
      const deleteConfirm = await Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Are you sure to remove this song from the list?",
        showDenyButton: true,
        confirmButtonText: "Yes",
      });

      console.log("handleDeleteSong function");
      if (deleteConfirm.isConfirmed) {
        const response = await axios.post(
          `${DATA_URL}/playlist/api/song/delete-song`,
          {
            song_id,
          }
        );
        if (response.status === 200) {
          fetchSongs(roomObjID, userID);
          socket.emit("remove_songs", {
            name: guestName,
          });
          // fetchRoomPlayers(roomID);
          setToastData({
            title: "Success",
            message: response.data.message,
            type: "success",
            time: new Date(),
          });
          setShowToast(true);
          // Swal.fire("Success", response.data.message, "success");
          return;
        }
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response,
        });
      }
    }
  };

  const handleStartGame = async (e, room_id) => {
    e.preventDefault();
    try {
      if (userID === roomDetails.host_id) {
        // Fetch all users data and check if they have added atleast 3 songs for now
        // emit roomID to fetch users songCount Details
        // socket.emit("request_song_details", { room_id: roomID });
        
        let countStatus = true;
        roomPlayers.forEach((user) => {
          // minimum of 2 songs for now
          if (user.songsCount < 2) {
            countStatus = false;
          }
        });
        if (!countStatus) {
          Swal.fire({
            icon: "error",
            title: "Songs Required",
            text: "Every Player needs to add atleast 2 songs to continue.",
          });
          return;
        }
        // Change the song to 'not_played' status
        await changeRoomSongsStatus(room_id);
        // Redirect to GameRoom emitting an event so others might also join
        socket.emit("start_game");
        return;
      } else {
        Swal.fire({
          icon: "warning",
          title: "Not Authorized",
          text: "Only the Room Host can start the Game",
        });
        return;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };

  // Change Room songs status to not_played before start of the game
  const changeRoomSongsStatus = async (room_id) => {
    try {
      console.log("handleFetchRoomSongs function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/reset-room-songs-status`,
        { room_id }
      );
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };

  // Game Room function calls
  // const handleFetchRoomSongs = async (room_id, player_id) => {
  //   try {
  //     console.log("handleFetchRoomSongs function");
  //     const response = await axios.post(
  //       `${DATA_URL}/playlist/api/song/get-room-songs`,
  //       { room_id, player_id }
  //     );
  //     if (response.status === 200) {
  //       console.log(response);
  //       setRoomSongs(response.data.songsData);
  //       setRoomSongsCount(response.data.songsCount);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       console.log(error.response);
  //     } else {
  //       console.log(error);
  //     }
  //   }
  // };

  const checkRoomSongCount = async (room_id) => {
    try {
      console.log("checkRoomSongCount function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song//get-room-songs`,
        { room_id }
      );

      if (response.status === 200) {
        console.log(response);
        if (response.data.songsCount === 0) {
          // setGameStatus('end');
          alert("Game Ended");
        } else {
          console.log("call fetch roomSongs function");
          handleDeleteRoomSong(currentSongID);
          console.log("call fetch roomSongs function");
          handlePickRandomSong(roomObjID);
        }
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };
  // delete song after everyone votes
  const handleDeleteRoomSong = async (song_id) => {
    try {
      console.log("handleDeleteRoomSong function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/delete-song`,
        { song_id }
      );
      
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  };
  
  const changeSongStatus = async (status) => {
    try {
      console.log("changeSongStatus function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song//change-song-status`,
        { room_id: roomObjID, song_id: currentSongID, status }
      );

      if (response.status === 200) {
        console.log(response);
      }

    } catch(error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
    }
  }
  
  // pick using node js and socket io
  const handlePickRandomSong = async (room_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/get-random-room-song`,
        { room_id }
        );

      console.log("handlePickRandomSong function");
      if (response.status === 200) {
        console.log(response);
        // if (response.data.songsData.length === 0) {
        //   setGameEvent("finish");
        //   return false;
        // }
        // emit event to socketIO
        socket.emit("send-random-song", {
          song_details: response.data.randomSong,
          room_id,
        });
        // Swal.fire({
        //   icon: "success",
        //   title: "Success",
        //   text: response.data.message,
        // });
        return true;
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong.",
        });
      }
      return true;
    }
  };
  const handleVotingPlayer = async (e, song_id, voted_player_id) => {
    e.preventDefault();
    try {
      if (!song_id) {
        Swal.fire({
          icon: "warning",
          title: "Song Unavailable",
          text: "Please fetch a song to vote",
        });
        return;
      }

      console.log("handleVotingPlayer function");
      const response = await axios.post(
        `${DATA_URL}/playlist/api/song/vote-player`,
        {
          room_id: roomObjID,
          song_id: song_id,
          voted_player_id,
          player_id: userID,
        }
      );
      if (response.status === 200) {
        console.log(response);
        setGameEvent("collect");
        setShowVoteCollectModal(false);
        // setVotedPlayer(votedPlayer.push(userID));
        // Fetch votes for current song from backend using socket io by everyone
        await socket.emit("player-vote", {
          song_id: song_id,
          voted_player_id: voted_player_id,
        });
      }

    } catch (error) {
      if (error.response) {
        console.log(error.response);
        Swal.fire({
          icon: "error",
          title: "Oops...!!!",
          text: error.response.data.message,
        });
      } else {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...!!!",
          text: "Something went wrong.",
        });
      }
    }
  };
  
  const handlePlaySong = async (e,song_link) => {
    e.preventDefault();
    console.log("Play song on player");
    setSongURL(song_link);
    setShowPlaySong(true);
  }

  return (
    <div className='main-container'>
      <MainHeaderDiv
        title='Exit Room'
        routeName='Home'
        redirectPromt={true}
        promptMessage='Are you sure, you want to leave the room?'
        userInfo={props.userInfo}
      />

      {/* <Button variant="primary" onClick={() => setShowPlaySong(true)}>
        Custom Width Modal
      </Button> */}
      <>
        <Modal
          // size="lg"
          backdrop="static"
          show={showPlaySong}
          keyboard={false}
          onHide={() => setShowPlaySong(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Play Song
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center align-items-center">
            <ReactPlayer url={songURL.length !== 0 ? songURL : 'https://www.youtube.com/watch?v=ysz5S6PUM-U'} controls={true} style={{ maxWidth: "400px" }} />
          </Modal.Body>
        </Modal>
      </>

      <PlayerDashboard
        GameStatus={GameStatus}
        roomID={roomID}
        roomObjID={roomObjID}
        hostName={hostName}
        hostProfilePic={hostProfilePic}
        roomDetails={roomDetails}
        roomPlayers={roomPlayers}
        songLink={songLink}
        handlePlaySong={handlePlaySong}
        songsList={PlayerSongsList}
        streamVideo={streamVideo}
        passAudio={passAudio}
        passVideo={passVideo}
        // toggleAudio={() => setPassAudio(!passAudio)}
        toggleVideo={() => setPassVideo(!passVideo)}
        onChangeSongLink={(e) => setSongLink(e.target.value)}
        showRules={showRules}
        roomButtonOnClick={() => setShowRules(true)}
        onHideModal={() => setShowRules(false)}
        onClickAddSong={addSongs}
        onClickRemoveSong={handleDeleteSong}
        // onClickRemoveSong={(e, song_id) => handleDeleteSong(e, song_id)}
        onClickStartGame={handleStartGame}
      />

      <GameRoom
        userID={userID}
        votedData={votedData}
        votedPlayer={votedPlayer}
        setVotedPlayer={(e) => setVotedPlayer(e.target.value)}
        showVoteCollectModal={showVoteCollectModal}
        toggleVoteCollectModal={() => setShowVoteCollectModal(!showVoteCollectModal)}
        GameStatus={GameStatus}
        GameEvent={GameEvent} // start_game, collect_votes, check_results, next_song, finish, exit_room
        roomDetails={roomDetails}
        roomPlayers={roomPlayers}
        currentSongID={currentSongID}
        currentSong={currentSong}
        handlePlaySong={handlePlaySong}
        scoresData={scoresData}
        answerData={answerData}
        roomScores={roomScores}
        showScoreboard={showScoreboard}
        fetchPlayerScores={fetchScores}
        handleCollectVotes={handleCollectVotes}
        handleCheckResults={handleCheckResults}
        handleNextSong={handleNextSong}
        handleFinishGame={handleFinishGame}
        handleExitRoom={handleExitRoom}
        streamVideo={streamVideo}
        passAudio={passAudio}
        passVideo={passVideo}
        // toggleAudio={() => setPassAudio(!passAudio)}
        toggleVideo={() => setPassVideo(!passVideo)}
        onClickFetchSong={(e) => {
          e.preventDefault();
          handlePickRandomSong(roomObjID);
        }}
        handleVotingPlayer={handleVotingPlayer}
      />

      {/* <ToastContainer position="top-end" className="p-3 mt-5"> */}
      <ToastContainer style={{ position: "fixed", top: "60px", right: "10px", zIndex: "100" }}>
        {toastData !== null && (
          <Toast
            style={{
              transition: "all ease-in 0.5s",
              border: "1px solid rgb(100,100,100)",
              boxShadow: "5px 5px 10px #fff",
              zIndex: "100",
              backgroundColor: toastData.type === "success"
                ? "rgb(70,245,117)"
                : toastData.type === "error"
                ? "rgb(251,83,83)"
                : toastData.type === "warning"
                ? "rgb(243,240,88)"
                : "rgb(83,243,216)"
            }}
            show={showToast}
            onClose={() => {
              setShowToast(false);
              setToastData(null);
            }}
          >
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded me-2'
                alt=''
              />
              <strong className='me-auto'>{toastData.title}</strong>
              {/* <small className="text-muted">{moment(toastData.time).startOf('minutes').fromNow()}</small> */}
            </Toast.Header>
            <Toast.Body>{toastData.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>

      <FloatingTextBlock
        textMessages={chatBoxData}
        message={message}
        userID={userID}
        setMessage={(e) => setMessage(e.target.value)}
        onClick={(e) => {
          e.preventDefault();
          if (message !== "") {
            emitChatMessages();
            setMessage("");
          }
        }}
      />
    </div>
  );
};

export default Dashboard;
