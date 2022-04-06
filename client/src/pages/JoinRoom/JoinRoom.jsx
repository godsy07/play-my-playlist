import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { DATA_URL } from "../../index";
import Swal from "sweetalert2";
import "./join-room.styles.css";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";

const JoinRoom = (props) => {
  let history = useHistory();
  const [roomID, setRoomID] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  // Function to check if server exists
  const handleCheckServer = async (e) => {
    e.preventDefault();
    // if roomID not entered return error
    if (roomID.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No RoomID",
        text: "You have not entered the room ID.",
      });
      return;
    }
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/check-room`,
        { roomID }
      );
      // console.log(response);
      if (response.status === 200) {
        Swal.fire({
          icon: response.data.status,
          title:
            response.data.status === "success" ? "Available" : "Not Available",
          text: response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
      }
    } catch (err) {
      console.log(err.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }
  };

  // Function for Validation for join room data
  const validateJoinRoom = () => {
    let title = "",
      text = "";
    if (roomID.length === 0) {
      title = "RoomID empty";
      text = "Room ID should not be empty.";
    } else if (roomID.length < 3) {
      title = "RoomID too short";
      text = "RoomName should be atleast 3 characters long.";
    } else if (password.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
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
  // Function to check submit room details
  const joinRoom = async () => {
    try {
      let joinData = {
        room_id: roomID,
        password: password,
        player_id: props.userInfo._id,
      };
      // console.log(joinData);
      const response = await axios.post(
        `${DATA_URL}/playlist/api/room/join-room`,
        joinData
      );
      // console.log(response);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
        });
        history.push({ pathname: "/dashboard", search: `?room_id=${roomID}` });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message,
        });
      }
    } catch (err) {
      // console.log(err.response.data.message);
      if (err.response.data.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      }
    }
  };
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (validateJoinRoom()) {
      joinRoom();
    }
  };

  return (
    <div className='main-container'>
      <MainHeaderDiv
        title='Create Room'
        routeName='CreateRoom'
        userInfo={props.userInfo}
      />
      <div className='join-room-div'>
        <Container className='pb-1' fluid>
          <Row>
            <Col xs={12} sm={6} md={8} lg={9}>
              <h1>Join Room</h1>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Button size='lg' style={{ width: "100%" }}>
                HOW TO PLAY
              </Button>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col xs={12} md={9}>
              <Row className='py-2'>
                <Form.Label>Room ID:</Form.Label>
                <Col xs={12} md={8} className='py-1'>
                  <Form.Control
                    type='text'
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={4} className='py-1'>
                  <Button style={{ width: "100%" }} onClick={handleCheckServer}>
                    Check Server
                  </Button>
                </Col>
              </Row>
              <Row className='py-2'>
                <Form.Label> Passcode: </Form.Label>
                <Col xs={12} md={8} className='py-1'>
                  <Form.Control
                    type={`${viewPassword ? "text" : "password"}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={4} className='py-1'>
                  <Button
                    style={{ fontSize: "20px", width: "100%" }}
                    onClick={() => setViewPassword(!viewPassword)}
                  >
                    {viewPassword ? <IoIosEyeOff /> : <IoMdEye />}
                  </Button>
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
                onClick={handleJoinRoom}
              >
                JOIN ROOM
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default JoinRoom;
