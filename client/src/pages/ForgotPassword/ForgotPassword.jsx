import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Form, Col, Row } from "react-bootstrap";
import "./ForgotPassword-Style.css";
import axios from "axios";
import { DATA_URL } from "../../index";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";

const ForgotPassword = (props) => {
  const history = useNavigate();
  const [setCookie] = useCookies();
  const [forgotEmail, setForgotEmail] = useState("");
  const [newForgotPassword, setnewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");
  const validateForgotUser = () => {
    let title = "",
      text = "";
    // validate data given by user to login
    if (forgotEmail.length === 0) {
      title = "Email empty";
      text = "Email ID should not be empty.";
    } else if (newForgotPassword.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    } else if (confirmForgotPassword.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    } else if (newForgotPassword.length < 6) {
      title = "Password too short";
      text = "Set a secure Password atleast 6 characters long.";
    } else if (newForgotPassword !== confirmForgotPassword) {
      title = "Password Mismatch";
      text = "Both passwords do not match.";
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
  const forgotUser = async () => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/user/forgot-password`,
        {
          email: forgotEmail,
          password: newForgotPassword,
        },
      );
      // console.log(response);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully reset your password.",
        });
        setCookie("playlist_token", response.data.token);
        history("/");
        // history("/");
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
      console.log(error);
      if (error.response) {
        console.log(error.response);
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
  const handleForgotPasswordUser = (e) => {
    e.preventDefault();
    // getUser();
    if (validateForgotUser()) {
      forgotUser();
    }
  };
  return (
    <Container fluid>
      <Row className="mt-5">
        <Col xs={12} sm={12} md={2} lg={3}></Col>
        <Col>
          <div className="w-100 bg-light p-4 rounded">
            <h3>Forgot Password</h3>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={forgotEmail}
                placeholder="Enter your email"
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newForgotPassword}
                placeholder="Set new password"
                onChange={(e) => setnewForgotPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmForgotPassword}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmForgotPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Button
                className="rounded-pill"
                onClick={handleForgotPasswordUser}
              >
                Reset Password
              </Button>
              &nbsp;
              <Link to="/">Go back to Home</Link>
            </Form.Group>
          </div>
        </Col>
        <Col xs={12} sm={12} md={2} lg={3}></Col>
      </Row>
    </Container>
  );
};
export default ForgotPassword;
