import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import React, { useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  OverlayTrigger,
  Tooltip,
  Spinner,
} from "react-bootstrap";
import { FaCopy } from "react-icons/fa";
import { useCookies } from "react-cookie";

import "./create-room.styles.css";
import { useUserContext } from "../../components/providers/AuthProvider";
import { createRandomPassCode } from "../../functionalities/createPage.function";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";
import {
  useCreateRoom,
  useGetAUniqueRoomID,
} from "../../utils/react-query/queries";

const CreateRoom = (props) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [cookies] = useCookies(["playlist_token"]);
  const [roomName, setRoomName] = useState("");
  const [passCode, setPassCode] = useState("");
  const [noOfPlayers, setNoOfPlayers] = useState(3);
  const [roomRules, setRoomRules] = useState("");

  // States for copy texts
  const [copyRoomIDText, setCopyRoomIDText] = useState("Copy your RoomID");
  const [copyPasscodeText, setCopyPasscodeText] =
    useState("Copy your Passcode");

  const refPassInput = useRef(null);

  const { data: roomID, isLoading: isFetchingRoomID } = useGetAUniqueRoomID();

  const { mutateAsync: createRoom, isPending: isCreatingRoom } =
    useCreateRoom();

  // Functions to copy text for roomID and room passcode to clipboard
  const copyPassCode = () => {
    refPassInput.current.select();
    navigator.clipboard.writeText(refPassInput.current.defaultValue);
    setCopyPasscodeText("Copied");
    setCopyRoomIDText("Copy your RoomID"); // If copied earlier reset its value
  };

  const copyRoomID = () => {
    if (!roomID) return;
    navigator.clipboard.writeText(roomID);
    setCopyRoomIDText("Copied");
    setCopyPasscodeText("Copy your Passcode"); // If copied earlier reset its value
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

  // handleCreateRoom to submit room data when create Room button is clicked
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!validateCreateRoom()) return;
    const roomData = {
      room_id: roomID,
      host_id: user.id,
      room_name: roomName,
      password: passCode,
      player_limit: noOfPlayers,
      room_rules: roomRules,
    };
    const response = await createRoom(roomData);
    Swal.fire({
      icon: response.status ? "success" : "error",
      title: response.status ? "Success" : "Error",
      text: response.message,
    });
    if (response.status) {
      navigate("/joinRoom");
    }
  };

  return (
    <div className="main-container">
      <MainHeaderDiv title="Join Room" routeName="/joinRoom" />
      <div className="create-room-div">
        <Container className="pb-1" fluid>
          <Row>
            <Col xs={12} md={6} lg={8}>
              <h1>Create Room</h1>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <div
                className="w-full bg-primary text-light rounded py-2 px-3 d-flex align-items-center justify-content-center"
                style={{ fontSize: "20px" }}
              >
                ROOM ID:{" "}
                <span className="px-2">
                  {isFetchingRoomID ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    roomID
                  )}
                </span>
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={<Tooltip>{copyRoomIDText}</Tooltip>}
                >
                  <Button className="p-0 px-2">
                    <FaCopy style={{ fontSize: "20px" }} onClick={copyRoomID} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row xs={1} md={2}>
            <Col xs={12} md={6}>
              <Row className="py-2">
                <Form.Label>User Name:</Form.Label>
                <Col xs={12} className="py-1">
                  <Form.Control type="text" value={user.user_name} disabled />
                </Col>
              </Row>
              <Row className="py-2">
                <Form.Label>Room Name:</Form.Label>
                <Col xs={12} className="py-1">
                  <Form.Control
                    type="text"
                    onChange={(e) => setRoomName(e.target.value)}
                    value={roomName}
                  />
                </Col>
              </Row>
              <Row className="py-2">
                <Form.Label> Passcode: </Form.Label>
                <Col xs={12} md={8} className="py-1">
                  <Form.Control
                    ref={refPassInput}
                    type="text"
                    value={passCode}
                    onChange={(e) => setPassCode(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={4} className="py-1">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>{copyPasscodeText}</Tooltip>}
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
              <Row className="py-2">
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
              <Row className="py-2">
                <Form.Label>Number of Participants:</Form.Label>
                <Col xs={12} className="py-1">
                  <Form.Select
                    value={noOfPlayers}
                    onChange={(e) => setNoOfPlayers(e.target.value)}
                  >
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </Form.Select>
                </Col>
              </Row>
              <Row className="py-2">
                <Form.Label> Room Rules: </Form.Label>
                <Col xs={12} className="py-1">
                  <Form.Control
                    as="textarea"
                    value={roomRules}
                    onChange={(e) => setRoomRules(e.target.value)}
                    style={{ height: "100px" }}
                  />
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
                disabled={isCreatingRoom}
                onClick={handleCreateRoom}
              >
                {isCreatingRoom ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "CREATE ROOM"
                )}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default CreateRoom;
