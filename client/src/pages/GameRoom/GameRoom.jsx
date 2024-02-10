import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Image,
  Modal,
  Table,
} from "react-bootstrap";

import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";
import { FaPlay, FaMusic, FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { MdWhereToVote } from "react-icons/md";
import musicImage from "../../images/gameroom/music.png";
// import musicImage from "../../images/chatroomimg.png";

import "./game-room.styles.css";
import { BASE_URL } from "../../config/constants";

const GameRoom = ({
  userID,
  hostID,
  votedData,
  votedPlayer,
  setVotedPlayer,
  userData,
  showVoteCollectModal,
  toggleVoteCollectModal,
  GameStatus,
  GameEvent,
  roomDetails,
  roomPlayers,
  currentSongID,
  currentSong,
  handlePlaySong,
  scoresData,
  answerData,
  topPlayer,
  roomScores,
  showScoreboard,
  streamVideo,
  passAudio,
  passVideo,
  toggleAudio,
  toggleVideo,
  handleVotes,
  handleCollectVotes,
  handleCheckResults,
  handleNextSong,
  handleFinishGame,
  handleExitRoom,
  handleVotingPlayer,
}) => {
  return (
    <>
      <>
        <Modal
          size="lg"
          show={showVoteCollectModal}
          onHide={() => toggleVoteCollectModal()}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter text-center">
              Select User to Vote
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex">
            {roomPlayers.length !== 0 &&
              roomPlayers.map((player, index) => (
                <div
                  key={index}
                  className="d-flex flex-column justify-content-center align-items-center p-2 m-1"
                  style={{
                    cursor: "pointer",
                    border: "1px solid rgb(100,100,100)",
                    borderRadius: "10px",
                    backgroundColor:
                      userData !== null
                        ? userData.voted_player.length !== 0 &&
                          userData.vote[0].song_id === currentSongID &&
                          userData.voted_player[0]._id === player._id
                          ? "rgb(102, 255, 102)"
                          : "rgb(153, 204, 255)"
                        : "rgb(153, 204, 255)",
                    height: "140px",
                    width: "140px",
                  }}
                  title={
                    userData !== null
                      ? userData.voted_player.length !== 0 &&
                        userData.vote[0].song_id === currentSongID &&
                        userData.voted_player[0]._id === player._id
                        ? "You have voted this player"
                        : "Click here to vote this player"
                      : "Click here to vote this player"
                  }
                  // onClick={setVotedPlayer(player._id)}
                  onClick={(e) =>
                    handleVotingPlayer(e, currentSongID, player._id)
                  }
                >
                  <AvatarIcon
                    imageUrl={
                      player.profile_pic_url &&
                      BASE_URL + "/" + player.profile_pic_url
                    }
                    AvatarWidth="100"
                  />
                  <h6 value={player._id}>{player.name}</h6>
                </div>
              ))}
          </Modal.Body>
          {userID === hostID && (
            <Modal.Footer>
              <Button variant="primary" onClick={() => handleVotes()}>
                <FaThumbsUp size={20} className="me-2" />
                Submit
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </>

      <div
        className={`${
          GameStatus === "started" ? "d-flex" : "d-none"
        } flex-column align-items-center bg-light`}
        style={{ minHeight: "calc(100vh - 62px)", padding: "20px" }}
      >
        <div>
          <i>
            {roomDetails !== null && (
              <div>
                <span className="me-2">
                  <b>Room Name:</b> {roomDetails.room_name}
                </span>
                |
                <span className="ms-2">
                  <b>RoomID:</b> {roomDetails.room_id}
                </span>
              </div>
            )}
          </i>
        </div>
        <Container
          className={` ${
            GameEvent !== "end" &&
            "d-flex justify-content-center align-items-center p-0"
          } py-0`}
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            minHeight: "calc(100vh - 100px)",
            // minWidth: "calc(100vw - 60px)",
          }}
          fluid
        >
          {GameEvent !== "end" ? (
            <Row
              style={{
                height: "100%",
                width: "100%",
                padding: "10px",
                display: "grid",
                gridGap: "10px",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <Col
                className="d-flex flex-column justify-content-center align-items-center rounded"
                style={{
                  border: GameEvent !== "end" ? "1px solid gray" : "none",
                  backgroudColor: "yellow",
                  minHeight: GameEvent !== "end" ? "120px" : "50px",
                  gridColumnStart: "2",
                  gridColumnEnd: "3",
                  gridRowStart: "1",
                  gridRowEnd: "2",
                  position: "relative",
                }}
              >
                {showScoreboard === "hide" ? (
                  <>
                    <div
                      className="d-flex justify-content-center align-items-center p-0 my-2"
                      style={{
                        // backgroundColor: "rgb(150, 200, 100)",
                        height: "100%",
                        width: "200px",
                        borderRadius: "50%",
                      }}
                    >
                      <Image
                        src={musicImage}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <InputGroup
                      className="mb-2"
                      style={{ position: "relative" }}
                    >
                      <InputGroup.Text
                        className="px-1"
                        style={{
                          position: "relative",
                          borderRadius: "50% 0px 0px 50%",
                        }}
                      >
                        <span
                          style={{
                            // position: "absolute",
                            zIndex: "4",
                            left: "3px",
                            top: "3px",
                            height: "33px",
                            width: "35px",
                            overflow: "hidden",
                            backgroundColor: "rgb(250, 100, 100)",
                            boxShadow:
                              "1px 1px 3px rgb(100,100,100), -1px -1px 3px rgb(100,100,100)",
                            border: "2px solid #fff",
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#fff",
                          }}
                        >
                          <FaMusic />
                        </span>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        value={currentSong !== "" ? currentSong : ""}
                        disabled
                      />
                      <InputGroup.Text className="px-1">
                        <FaPlay
                          onClick={(e) => handlePlaySong(e, currentSong)}
                          style={{ fontSize: "24px", width: "50px" }}
                        />
                      </InputGroup.Text>
                    </InputGroup>
                  </>
                ) : (
                  showScoreboard === "show_scores" && (
                    <>
                      <h2 className="mb-2 text-center">Game Scores</h2>
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <Table
                          className="text-center"
                          style={{ captionSide: "top" }}
                          striped
                          bordered
                          hover
                        >
                          {!roomScores && (
                            <caption className="text-center">
                              Right Answer:{" "}
                              {answerData.length !== 0 &&
                                answerData[0].player.name}
                            </caption>
                          )}
                          <thead>
                            <tr>
                              <th>Sl.No.</th>
                              <th>Player</th>
                              {!roomScores && <th>Voted</th>}
                              {!roomScores && <th>Scores</th>}
                              {roomScores ? <th>Scores</th> : <th>Total</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {scoresData.map((score, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                {!roomScores ? (
                                  <td>{score.player.name}</td>
                                ) : (
                                  <td>{score.name}</td>
                                )}
                                {!roomScores && (
                                  <td>{score.voted_player.name}</td>
                                )}
                                {!roomScores && <td>{score.current_points}</td>}
                                <td>{score.score_points[0].points}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </>
                  )
                )}

                <Button
                  className="w-100 text-center mb-2"
                  variant={
                    GameEvent === "results" ||
                    GameEvent === "next" ||
                    GameEvent === "finish" ||
                    GameEvent === "exit"
                      ? "warning"
                      : "primary"
                  }
                  onClick={(e) => {
                    if (GameEvent === "start") {
                      toggleVoteCollectModal();
                      return;
                    } else if (GameEvent === "vote") {
                      handleVotes();
                    } else if (GameEvent === "collect") {
                      handleCollectVotes();
                    } else if (GameEvent === "results") {
                      handleCheckResults();
                    } else if (GameEvent === "next") {
                      handleNextSong();
                    } else if (GameEvent === "finish") {
                      handleFinishGame();
                    } else if (GameEvent === "end") {
                      handleExitRoom();
                    }
                  }}
                >
                  {GameEvent === "start"
                    ? "TAKE VOTES"
                    : GameEvent === "collect"
                    ? "SUBMIT VOTES"
                    : GameEvent === "results"
                    ? "CHECK RESULTS"
                    : GameEvent === "next"
                    ? "PLAY NEXT SONG"
                    : GameEvent === "finish"
                    ? "FINISH GAME"
                    : "EXIT ROOM"}
                </Button>
                {/* Check every player has voted using socket IO and accordingly fetch a new song to all players using socket IO */}
              </Col>

              {roomPlayers.map((player, index) => (
                <Col
                  key={index}
                  className="d-sm-none d-none d-md-flex flex-column justify-content-center align-items-center text-center rounded"
                  style={{
                    backgroudColor: "yellow",
                    minHeight: "120px",
                  }}
                >
                  <div className="player-info">
                    <div className="avatar1" style={{ position: "relative" }}>
                      <AvatarIcon
                        imageUrl={
                          player.profile_pic_url &&
                          BASE_URL + "/" + player.profile_pic_url
                        }
                        AvatarWidth="180"
                        votedStatus={true}
                        votedStatusValue={
                          player.voted_player.length !== 0 &&
                          player.vote[0].song_id === currentSongID
                            ? true
                            : false
                        }
                        votedStatusText={
                          player.voted_player.length !== 0 &&
                          player.vote[0].song_id === currentSongID
                            ? "Player has voted"
                            : "Player has not voted"
                        }
                        streamButtons={true}
                        streamData={streamVideo}
                        passAudio={passAudio}
                        passVideo={passVideo}
                        toggleAudio={toggleAudio}
                        toggleVideo={toggleVideo}
                        // toggleAudio={() => setPassAudio(!passAudio)}
                        // toggleVideo={() => setPassVideo(!passVideo)}
                      />
                    </div>
                    <div className="text-center">
                      {player.name.split(" ")[0]}{" "}
                      {player.voted_player.length !== 0 &&
                        player.vote[0].song_id === currentSongID &&
                        "has voted " + player.voted_player[0].name + "."}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <>
              <Row>
                <Col
                  md={8}
                  className="d-flex flex-column justify-content-center align-content-center"
                  style={{ borderRadius: "10px 0 0 10px" }}
                >
                  {topPlayer !== null && (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <h3 className="text-center">Winner</h3>
                      <AvatarIcon
                        imageUrl={
                          topPlayer.profile_pic_url &&
                          BASE_URL + "/" + topPlayer.profile_pic_url
                        }
                        AvatarWidth="180"
                        showStatus={true}
                        statusDetails="winner"
                        streamButtons={true}
                        streamData={streamVideo}
                        passAudio={passAudio}
                        passVideo={passVideo}
                        toggleAudio={toggleAudio}
                        toggleVideo={toggleVideo}
                        // toggleAudio={() => setPassAudio(!passAudio)}
                        // toggleVideo={() => setPassVideo(!passVideo)}
                      />
                      <div className="text-center">
                        {topPlayer.name.split(" ")[0] +
                          " : " +
                          topPlayer.score_points[0].points +
                          " points"}
                      </div>
                    </div>
                  )}

                  <div
                    style={{ minHeight: "260px" }}
                    className="my-3 d-flex justify-content-between"
                  >
                    {scoresData.map((player, index) => {
                      if (index !== 0) {
                        return (
                          <div
                            key={index}
                            className="d-flex flex-column justify-content-center align-items-center"
                          >
                            <AvatarIcon
                              imageUrl={
                                player.profile_pic_url &&
                                BASE_URL + "/" + player.profile_pic_url
                              }
                              AvatarWidth="140"
                              streamButtons={true}
                              streamData={streamVideo}
                              passAudio={passAudio}
                              passVideo={passVideo}
                              toggleAudio={toggleAudio}
                              toggleVideo={toggleVideo}
                              // toggleAudio={() => setPassAudio(!passAudio)}
                              // toggleVideo={() => setPassVideo(!passVideo)}
                            />
                            <div className="text-center">
                              {player.name.split(" ")[0] +
                                ": " +
                                player.score_points[0].points +
                                " points"}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                  <Button
                    className="w-100 text-center mb-2"
                    variant="warning"
                    onClick={(e) => handleExitRoom()}
                  >
                    EXIT ROOM
                  </Button>
                </Col>
                <Col
                  md={4}
                  className="bg-info"
                  style={{ borderRadius: "0 10px 10px 0" }}
                >
                  <h4>Chat Room:</h4>
                  <hr />
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
    </>
  );
};

export default GameRoom;
