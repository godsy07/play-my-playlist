import React from "react";
import { Container, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import {
  FaPlay,
  FaMusic,
  FaCloudUploadAlt,
  FaPlusCircle,
  FaTrashAlt,
} from "react-icons/fa";

const SongListDiv = ({
  roomObjID,
  songLink,
  songsList,
  onChangeSongLink,
  onClickAddSong,
  handlePlaySong,
  onClickRemoveSong,
  onClickStartGame,
}) => {
  return (
    <>
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
                <FaCloudUploadAlt style={{ fontSize: "24px", width: "50px" }} />
              </InputGroup.Text>
            </InputGroup>
          </Col>
          <Col xs={12} md={2}>
            <Button
              variant='light'
              className='d-flex w-100 justify-content-center align-items-center'
              onClick={onClickAddSong}
              title='Add Song'
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
                    <FaPlay
                      onClick={(e) => handlePlaySong(e, song.song)}
                      style={{ fontSize: "24px", width: "50px" }}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
              <Col xs={12} md={2}>
                <Button
                  variant='danger'
                  className='d-flex w-100 justify-content-center align-items-center'
                  onClick={(e) => onClickRemoveSong(e, song._id, song.song)}
                  title='Delete Song'
                >
                  <FaTrashAlt className='ms-1' size={22} />
                  REMOVE
                </Button>
              </Col>
            </Row>
          ))}
      </Container>
      <button
        className='start-game-button'
        onClick={(e) => onClickStartGame(e, roomObjID)}
      >
        START GAME
      </button>
    </>
  );
};

export default SongListDiv;
