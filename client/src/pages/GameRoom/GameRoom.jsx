import React from "react";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Image,
} from "react-bootstrap";

import AvatarIcon from "../../components/AvatarIcon/AvatarIcon";
import { FaPlay, FaMusic } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { MdWhereToVote } from "react-icons/md";
import musicImage from "../../images/chatroomimg.png";

import "./game-room.styles.css";

const GameRoom = ({
  GameStatus,
  roomDetails,
  roomPlayers,
  currentSongID,
  currentSong,
  onClickFetchSong,
  handleTakingVotes,
  handleVotingPlayer,
}) => {

  return (
    <>

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
                <span className='me-2'>
                  <b>Room Name:</b> {roomDetails.room_name}
                </span>
                |
                <span className='ms-2'>
                  <b>RoomID:</b> {roomDetails.room_id}
                </span>
              </div>
            )}
          </i>
        </div>
        <Container
          className='d-flex justify-content-center align-items-center p-0'
          style={{
            border: "1px solid black",
            borderRadius: "10px",
            minHeight: "calc(100vh - 100px)",
            // minWidth: "calc(100vw - 60px)",
          }}
          fluid
        >
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
              className='d-flex flex-column justify-content-center align-items-center rounded'
              style={{
                border: "1px solid gray",
                backgroudColor: "yellow",
                minHeight: "120px",
                gridColumnStart: "2",
                gridColumnEnd: "3",
                gridRowStart: "1",
                gridRowEnd: "2",
                position: "relative",
              }}
            >
              <div
                className='bg-primary text-white d-flex text-center p-1'
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "10px",
                  borderRadius: "50%",
                }}
              >
                {/* <FaCloudDownloadAlt /> */}
                <FiRefreshCcw
                  onClick={onClickFetchSong}
                  title='Fetch random song'
                />
              </div>

              <div
                className='d-flex justify-content-center align-items-center p-0 my-2'
                style={{
                  // backgroundColor: "rgb(150, 200, 100)",
                  height: "200px",
                  width: "200px",
                  borderRadius: "50%",
                }}
              >
                <Image
                  src={musicImage}
                  style={{ height: "100%", width: "100%" }}
                />
              </div>
              <InputGroup className='mb-2' style={{ position: "relative" }}>
                <InputGroup.Text
                  className='px-1'
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
                  type='text'
                  value={currentSong !== '' ? currentSong : ""}
                  disabled
                />
                <InputGroup.Text className='px-1'>
                  <FaPlay style={{ fontSize: "24px", width: "50px" }} />
                </InputGroup.Text>
              </InputGroup>
              <Button
                className='w-100 text-center mb-2'
                onClick={handleTakingVotes}
              >
                TAKE VOTES
              </Button>
              {/* Check every player has voted using socket IO and accordingly fetch a new song to all players using socket IO */}
            </Col>

            {roomPlayers.map((player, index) => (
              <Col
                key={index}
                className='d-sm-none d-none d-md-flex flex-column justify-content-center align-items-center text-center rounded'
                style={{
                  backgroudColor: "yellow",
                  minHeight: "120px",
                }}
              >
                <div className='player-info'>
                  <div className='avatar1' style={{ position: "relative" }}>
                    <Button
                      onClick={(e) =>
                        handleVotingPlayer(
                          e,
                          currentSongID,
                          player.user_id
                        )
                      }
                      className={`${
                        player.song_details ? "bg-success" : "bg-warning"
                      } d-flex justify-content-center align-items-center p-0`}
                      title='Click here to vote'
                      style={{
                        position: "absolute",
                        left: "10px",
                        top: "10px",
                        zIndex: "100",
                        height: "30px",
                        width: "30px",
                        borderRadius: "50%",
                        fontSize: "20px",
                      }}
                    >
                      <MdWhereToVote />
                    </Button>
                    <AvatarIcon
                      imageUrl={player.profile_pic_url}
                      // imageUrl='https://robohash.org/32?set=set2'
                      AvatarWidth='180'
                      // streamButtons={true}
                      // streamData={streamVideo}
                      // passAudio={passAudio}
                      // toggleAudio={() => setPassAudio(!passAudio)}
                      // passVideo={passVideo}
                      // toggleVideo={() => setPassVideo(!passVideo)}
                    />
                  </div>
                  <div>
                    {player.name.split(" ")[0]} {player.song_details && "has voted."}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default GameRoom;
