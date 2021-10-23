import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { DATA_URL } from "../../index";
import Swal from "sweetalert2";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaCopy } from "react-icons/fa";

import { createRandomPassCode } from "../../functionalities/createPage.function";
import "./create-room.styles.css";

const CreateRoom = () => {
  const userName = "Godson";
  const [roomID, setRoomID] = useState("");
  const [roomName, setRoomName] = useState("");
  const [passCode, setPassCode] = useState("");
  const [noOfPlayers, setNoOfPlayers] = useState(1);
  const [roomRules, setRoomRules] = useState("");

  const refPassInput = useRef(null);
  const [createRoomStatus, setCreateRoomStatus] = useState(false);
  // createRoomStatus will True if room is successfully created

  const fetchRoomID = async () => {
    try {
      const response = await axios.get(
        `${DATA_URL}/playlist/api/room/createRoomID`
      );
      if (response.status === 200) {
        setRoomID(response.data.roomID);
      } else {
        console.log(response);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Room Code set during mount
    fetchRoomID();
  }, []);

  // Functions to copy text for roomID and room passcode to clipboard
  const copyPassCode = () => {
    refPassInput.current.select();
    navigator.clipboard.writeText(refPassInput.current.defaultValue);
  };
  const copyRoomID = () => {
    navigator.clipboard.writeText(roomID);
  };
  // Function for Validation for create room data
  const validateCreateRoom = () => {
    let title = "",
      text = "";
    if (roomName.length === 0) {
      title = "Room name empty";
      text = "Room name should not be empty.";
    } else if (roomName.length < 3) {
      title = "Room Name too short";
      text = "RoomName should be atleast 3 characters long.";
    } else if (passCode.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    } else if (passCode.length < 6) {
      title = "Password too short";
      text = "Set a secure Password atleast 6 characters long.";
    }
    if (title.length !== 0) {
      Swal.fire({
        icon: "error",
        title: title,
        text: text,
      });
      return false;
    } else {
      return true;
    }
  };
  // Function for createRoom api call
  const createRoom = async () => {
    // console.log("create room function called");
    try {
      const roomData = {
        room_id: roomID,
        host_name: userName,
        room_name: roomName,
        password: passCode,
        no_of_players: noOfPlayers,
        room_rules: roomRules,
      };
      // console.log(roomData);
      // api call for creating room in Database
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/createRoom`,
        roomData
      );
      // console.log(response);
      if (response.status === 200) {
        Swal.fire({
          icon: response.data.status,
          title: response.data.status === "success" ? "Success" : "Error",
          text: response.data.message,
        });
        if (response.data.status === "success") setCreateRoomStatus(true);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "Room could not be created...",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!!",
      });
    }
  };

  // handleCreateRoom to submit room data when create Room button is clicked
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (validateCreateRoom()) {
      createRoom();
    }
  };

  // createRoomStatus is true redirect to joinRoom page
  if (createRoomStatus) {
    return <Redirect to='/joinRoom' />;
  } else {
    return (
      <div className='main-container'>
        <MainHeaderDiv title='Join Room' routeName='joinRoom' />
        <div className='create-room-div'>
          <Container className='pb-1' fluid>
            <Row>
              <Col xs={12} md={6} lg={8}>
                <h1>Create Room</h1>
              </Col>
              <Col xs={12} md={6} lg={4}>
                <div
                  className='w-full bg-primary text-light rounded py-2 px-3 d-flex align-items-center justify-content-center'
                  style={{ fontSize: "20px" }}
                >
                  ROOM ID: <span className='px-2'>{roomID}</span>
                  <OverlayTrigger
                    placement='top'
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Copy your RoomID</Tooltip>}
                  >
                    <Button className='p-0 px-2'>
                      <FaCopy
                        style={{ fontSize: "20px" }}
                        onClick={copyRoomID}
                      />
                    </Button>
                  </OverlayTrigger>
                </div>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <Row xs={1} md={2}>
              <Col xs={12} md={6}>
                <Row className='py-2'>
                  <Form.Label>User Name:</Form.Label>
                  <Col xs={12} className='py-1'>
                    <Form.Control type='text' value={userName} disabled />
                  </Col>
                </Row>
                <Row className='py-2'>
                  <Form.Label>Room Name:</Form.Label>
                  <Col xs={12} className='py-1'>
                    <Form.Control
                      type='text'
                      onChange={(e) => setRoomName(e.target.value)}
                      value={roomName}
                    />
                  </Col>
                </Row>
                <Row className='py-2'>
                  <Form.Label> Passcode: </Form.Label>
                  <Col xs={12} md={8} className='py-1'>
                    <Form.Control
                      ref={refPassInput}
                      type='text'
                      value={passCode}
                      onChange={(e) => setPassCode(e.target.value)}
                    />
                  </Col>
                  <Col xs={12} md={4} className='py-1'>
                    <OverlayTrigger
                      placement='top'
                      delay={{ show: 250, hide: 400 }}
                      overlay={<Tooltip>Copy your Passcode</Tooltip>}
                    >
                      <Button
                        onClick={copyPassCode}
                        style={{ fontSize: "20px", width: "100%" }}
                      >
                        <FaCopy />
                      </Button>
                    </OverlayTrigger>
                  </Col>
                </Row>
                <Row className='py-2'>
                  <Col>
                    <Button
                      onClick={() => setPassCode(createRandomPassCode())}
                      style={{ width: "100%" }}
                    >
                      GENERATE PASSCODE
                    </Button>
                  </Col>
                </Row>
              </Col>

              <Col xs={12} md={6}>
                <Row className='py-2'>
                  <Form.Label>Number of Participants:</Form.Label>
                  <Col xs={12} className='py-1'>
                    <Form.Select
                      value={noOfPlayers}
                      onChange={(e) => setNoOfPlayers(e.target.value)}
                    >
                      <option value='1'>1</option>
                      <option value='2'>2</option>
                      <option value='3'>3</option>
                      <option value='4'>4</option>
                      <option value='5'>5</option>
                      <option value='6'>6</option>
                      <option value='7'>7</option>
                      <option value='8'>8</option>
                      <option value='9'>9</option>
                      <option value='10'>10</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row className='py-2'>
                  <Form.Label> Room Rules: </Form.Label>
                  <Col xs={12} className='py-1'>
                    <Form.Control
                      as='textarea'
                      value={roomRules}
                      onChange={(e) => setRoomRules(e.target.value)}
                      style={{ height: "100px" }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row className='d-flex justify-content-center my-1 py-4'>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Button
                  size='lg'
                  className='mt-5'
                  style={{ width: "100%" }}
                  onClick={handleCreateRoom}
                >
                  CREATE ROOM
                </Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
};

export default CreateRoom;