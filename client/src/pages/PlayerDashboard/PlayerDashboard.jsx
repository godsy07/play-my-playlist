import React from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";

import "./player-dashboard.styles.css";
import PlayInstructionsModal from "../../components/PlayInstructions/PlayInstructions";
import SongListDiv from "../../components/SongListDiv";
import PlayerLobby from "../../components/PlayerLobby";
import GameRulesButton from "../../components/GameRulesButton";

const PlayerDashboard = ({
  GameStatus,
  roomID,
  roomObjID,
  hostName,
  hostProfilePic,
  roomDetails,
  roomPlayers,
  songLink,
  handlePlaySong,
  songsList,
  onChangeSongLink,
  showRules,
  streamVideo,
  passAudio,
  passVideo,
  toggleAudio,
  toggleVideo,
  roomButtonOnClick,
  onHideModal,
  onClickAddSong,
  onClickRemoveSong,
  onClickStartGame,
}) => {
  return (
    <>
      <div
        className={`${
          GameStatus === "started" ? "d-none" : "d-flex"
        } px-5 py-3 flex-column align-items-center`}
        // style={{ overflowY: "scroll" }}
      >
        <Container fluid>
          <Row
            className='mb-3 p-2 rounded'
            style={{ backgroundColor: "rgb(200, 200, 200, 0.5)" }}
          >
            <Col lg={9} md={8} sm={7} xs={12} className='d-flex'>
              <AvatarIcon imageUrl={hostProfilePic} />
              {roomDetails && (
                <div className='d-flex flex-column justify-content-center m-2'>
                  <span>RoomID: {roomID}</span>
                  <span>RoomName: {roomDetails.room_name}</span>
                  <span>Host Name: {hostName}</span>
                  {/* <span>Host Name: {roomDetails.host_id}</span> */}
                  <span>Player Limit: {roomDetails.player_limit}</span>
                </div>
              )}
            </Col>
            <Col
              lg={3}
              md={4}
              sm={5}
              xs={12}
              className='d-flex justify-content-center align-items-center'
            >
              <GameRulesButton host_rules={roomDetails && roomDetails.room_rules} />
            </Col>
          </Row>
        </Container>
        <PlayerLobby
          roomPlayers={roomPlayers}
          streamVideo={streamVideo}
          passAudio={passAudio}
          passVideo={passVideo}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
        />
      </div>
      <div
        className={`${
          GameStatus === "started" ? "d-none" : "d-block"
        } add-songs-div`}
      >
        <SongListDiv
          roomObjID={roomObjID}
          songLink={songLink}
          songsList={songsList}
          onChangeSongLink={onChangeSongLink}
          onClickAddSong={onClickAddSong}
          handlePlaySong={handlePlaySong}
          onClickRemoveSong={onClickRemoveSong}
          onClickStartGame={onClickStartGame}
        />
      </div>
    </>
  );
};

export default PlayerDashboard;
