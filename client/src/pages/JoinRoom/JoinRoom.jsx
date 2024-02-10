import Swal from "sweetalert2";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

import "./join-room.styles.css";
import {
  useCheckRoomExists,
  useJoinRoom,
} from "../../utils/react-query/queries";
import { useUserContext } from "../../components/providers/AuthProvider";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";

const JoinRoom = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [roomID, setRoomID] = useState("");
  const [password, setPassword] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const { mutateAsync: checkRoomExists, isPending: isCheckingAvailability } =
    useCheckRoomExists();
  const { mutateAsync: joinRoom, isPending: isJoiningRoom } = useJoinRoom();

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
    const response = await checkRoomExists({ roomID });
    Swal.fire({
      icon: response.room ? "success" : "question",
      title: response.room ? "Exists" : "Not Exists",
      text: response.message,
    });
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

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!validateJoinRoom()) return;
    const data = {
      room_id: roomID,
      password: password,
      player_id: user.id,
    };
    const response = await joinRoom(data);
    Swal.fire({
      icon: response.status ? "success" : "error",
      title: response.status ? "Success" : "Error",
      text: response.message,
    });
    if (response.status) {
      // console.log("join room api call");
      // console.log(response);
      navigate(`/dashboard/${response.room._id}/${roomID}`, {
        state: { room_id: response.room._id },
      });
      // navigate({ pathname: "/dashboard", search: `/${response.data.roomInfo._id}/${roomID}`, state: { room_id: response.data.roomInfo._id } });
    }
  };

  return (
    <div className="main-container">
      <MainHeaderDiv title="Create Room" routeName="/CreateRoom" />
      <div className="join-room-div">
        <Container className="pb-1" fluid>
          <Row>
            <Col xs={12} sm={6} md={8} lg={9}>
              <h1>Join Room</h1>
            </Col>
            <Col xs={12} sm={6} md={4} lg={3}>
              <Button size="lg" style={{ width: "100%" }}>
                HOW TO PLAY
              </Button>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col xs={12} md={9}>
              <Row className="py-2">
                <Form.Label>Room ID:</Form.Label>
                <Col xs={12} md={8} className="py-1">
                  <Form.Control
                    type="text"
                    value={roomID}
                    onChange={(e) => setRoomID(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={4} className="py-1">
                  <Button
                    style={{ width: "100%" }}
                    disabled={isCheckingAvailability}
                    onClick={handleCheckServer}
                  >
                    {isCheckingAvailability ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Check Server"
                    )}
                  </Button>
                </Col>
              </Row>
              <Row className="py-2">
                <Form.Label> Passcode: </Form.Label>
                <Col xs={12} md={8} className="py-1">
                  <Form.Control
                    type={`${viewPassword ? "text" : "password"}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={4} className="py-1">
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
          <Row className="d-flex justify-content-center my-1 py-4">
            <Col xs={12} sm={6} md={4} lg={3}>
              <Button
                size="lg"
                className="mt-5"
                style={{ width: "100%" }}
                onClick={handleJoinRoom}
                disabled={isJoiningRoom}
              >
                {isJoiningRoom ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "JOIN ROOM"
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default JoinRoom;
