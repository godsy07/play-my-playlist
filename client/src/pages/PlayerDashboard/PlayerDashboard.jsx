import React from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";
import {
  FaPlay,
  FaMusic,
  FaCloudUploadAlt,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";

import "./player-dashboard.styles.css";
import PlayInstructionsModal from "../../components/PlayInstructions/PlayInstructions";
import { DATA_URL } from "../..";

const PlayerDashboard = ({
  GameStatus,
  roomID,
  hostName,
  hostProfilePic,
  roomDetails,
  roomPlayers,
  songLink,
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
              <Button
                size='lg'
                style={{ height: "60px", width: "100%", borderRadius: "10px" }}
                onClick={roomButtonOnClick}
              >
                Room Rules
              </Button>
            </Col>
          </Row>
          <PlayInstructionsModal show={showRules} onHide={onHideModal}>
            Game rules set by the Host.
          </PlayInstructionsModal>
        </Container>
        <Container
          className='px-4 py-2'
          style={{
            backgroundColor: "rgb(255, 210, 210)",
            minHeight: "200px",
            borderRadius: "5px",
          }}
        >
          <div className='w-full text-center mb-3'>
            <h3>Waiting Lobby...</h3>
          </div>
          <div className='profile-icons-div'>
            {roomPlayers.length !== 0 &&
              roomPlayers.map((item, index) => (
                <div
                  key={index}
                  // className='d-flex flex-column justify-content-center align-items-center p-2 m-1'
                  className='d-flex flex-column align-items-center p-2 m-1 text-center'
                >
                  <AvatarIcon
                    imageUrl={ item.profile_pic_url && DATA_URL +"/"+ item.profile_pic_url }
                    // statusDetails={true}
                    statusDetails='connected'
                    showStatus={true}
                    streamButtons={true}
                    streamData={streamVideo}
                    passAudio={passAudio}
                    passVideo={passVideo}
                    toggleAudio={toggleAudio}
                    toggleVideo={toggleVideo}
                    // toggleAudio={() => setPassAudio(!passAudio)}
                    // toggleVideo={() => setPassVideo(!passVideo)}
                  />
                  <span>{item.name.split(" ")[0]}</span>
                  <span>
                    {item.songsCount ? item.songsCount : "No"} songs added
                  </span>
                </div>
              ))}
          </div>
        </Container>
      </div>
      <div
        className={`${
          GameStatus === "started" ? "d-none" : "d-block"
        } add-songs-div`}
      >
        <Container className='text-center py-3'>
          <Row className='mb-2'>
            <h3 className='text-white'>Add your songs here....</h3>
          </Row>
          <Row xs={1} md={2} className='mb-2 px-4'>
            <Col xs={12} md={10}>
              <InputGroup>
                <Form.Control
                  type='url'
                  value={songLink}
                  onChange={onChangeSongLink}
                  placeholder='Place link here'
                />
                <InputGroup.Text className='px-1'>
                  <FaCloudUploadAlt
                    style={{ fontSize: "24px", width: "50px" }}
                  />
                </InputGroup.Text>
              </InputGroup>
            </Col>
            <Col xs={12} md={2}>
              <Button
                variant='light'
                className='d-flex w-100 justify-content-center align-items-center'
                onClick={onClickAddSong}
              >
                <FaPlusCircle className='me-1 text-success' size={22} />
                ADD
              </Button>
            </Col>
          </Row>
          {songsList.length !== 0 &&
            songsList.map((song, index) => (
              <Row key={index} className='mb-2 px-4'>
                <Col xs={12} md={10}>
                  <InputGroup style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
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
                    <Form.Control
                      type='url'
                      value={song.song}
                      style={{
                        paddingLeft: "50px",
                        borderRadius: "50px 0 0 50px",
                      }}
                      disabled
                    />
                    <InputGroup.Text className='px-1'>
                      <FaPlay style={{ fontSize: "24px", width: "50px" }} />
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col xs={12} md={2}>
                  <Button
                    variant='danger'
                    className='d-flex w-100 justify-content-center align-items-center'
                    onClick={(e) => onClickRemoveSong(e, song._id, song.song)}
                  >
                    <FaTrashAlt className='ms-1' size={22} />
                    REMOVE
                  </Button>
                </Col>
              </Row>
            ))}
        </Container>
        <button className='start-game-button' onClick={onClickStartGame}>
          START GAME
        </button>
      </div>
    </>
  );
};

export default PlayerDashboard;
