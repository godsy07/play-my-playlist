import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Row, Col, Button, Form } from "react-bootstrap";
import { useCookies } from "react-cookie";

import "./login-signup.styles.css";
import { BASE_URL } from "../../config/constants";
import { useUserContext } from "../../components/providers/AuthProvider";

const LoginSignUp = () => {
  const history = useNavigate();
  const location = useLocation();
  const { setUser, checkAuthUser } = useUserContext();
  const [cookies, setCookie] = useCookies();
  // State to show signup form if true
  const [signUpShow, setSignUpShow] = useState(false);
  // States to save the user details
  const [userName, setUserName] = useState("");
  const [userHandle, setUserHandle] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");
  // States to get login info
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    if (location.state) {
      if (location.state.signUp) setSignUpShow(location.state.signUp);
    }
  }, []);

  // Function for Validation for create user data
  const validateCreateUser = () => {
    let title = "",
      text = "";
    if (userName.length === 0) {
      title = "Name empty";
      text = "Name should not be empty.";
    } else if (userName.length < 3) {
      title = "Name too short";
      text = "Name should be atleast 3 characters long.";
    } else if (userHandle.length === 0) {
      title = "UserName empty";
      text = "UserName should not be empty.";
    } else if (userHandle.length < 3) {
      title = "UserName too short";
      text = "UserName should be atleast 3 characters long.";
    } else if (userEmail.length === 0) {
      title = "Email empty";
      text = "Email should not be empty.";
    } else if (userPassword.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    } else if (userPassword.length < 6) {
      title = "Password too short";
      text = "Set a secure Password atleast 6 characters long.";
    } else if (userPassword !== confirmUserPassword) {
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
  // Function for createUser api call
  const createUser = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/playlist/api/user/sign-up`,
        {
          name: userName,
          user_name: userHandle,
          email: userEmail,
          password: userPassword,
        },
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message,
          // text: "You have been successfully signed up.",
        });
        // history("/");
        setUserName("");
        setUserHandle("");
        setUserEmail("");
        setUserPassword("");
        setConfirmUserPassword("");
        setSignUpShow(false);
        return;
      }
    } catch (error) {
      // console.log(error);
      if (error.response) {
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

  // handleCreateUser to submit room data when create Room button is clicked
  const handleCreateUser = (e) => {
    e.preventDefault();
    // createUser();
    if (validateCreateUser()) {
      createUser();
    }
  };

  // Validation for login details
  const validateLoginUser = () => {
    let title = "",
      text = "";
    // validate data given by user to login
    if (loginEmail.length === 0) {
      title = "Email empty";
      text = "Email ID should not be empty.";
    } else if (loginPassword.length === 0) {
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
  // function for login api call
  const loginUser = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/playlist/api/user/login`, {
        email: loginEmail,
        password: loginPassword,
        rememberMe: rememberMe,
      });
      // console.log(response);
      if (response.status === 200) {
        setCookie("playlist_token", response.data.token);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully logged in to your account.",
        });
        setLoginEmail("");
        setLoginPassword("");
        await checkAuthUser();
        history({
          pathname: "/",
          search: "?login=success",
          state: {
            message: "You have successfully logged in to your account.",
          },
        });
        history("/");
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
  // handleGetUser to submit and login
  const handleLoginUser = (e) => {
    e.preventDefault();
    // getUser();
    if (validateLoginUser()) {
      loginUser();
    }
  };

  return (
    <main className="p-0 m-0 w-100">
      <Row
        md={2}
        xs={1}
        className="w-100"
        style={{ height: "100vh", overflowY: "hidden" }}
      >
        <Col className="px-5 bg-warning d-flex flex-column justify-content-center align-items-center form-divcolumnsignup">
          {signUpShow && (
            <div className="d-flex  flex-column w-100 m-4 p-5 form-space">
              <h3>SignUp Form</h3>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  placeholder="Enter a name"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>UserName</Form.Label>
                <Form.Control
                  type="text"
                  value={userHandle}
                  placeholder="Set a unique username"
                  onChange={(e) => setUserHandle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userEmail}
                  placeholder="Enter email"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={userPassword}
                  placeholder="Set new password"
                  onChange={(e) => setUserPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmUserPassword}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmUserPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Button className="rounded-pill" onClick={handleCreateUser}>
                  Submit
                </Button>
              </Form.Group>
            </div>
          )}

          {!signUpShow && (
            <div className="d-flex flex-column w-100 m-4 p-5 form-space">
              <h3>Login Form</h3>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={loginEmail}
                  placeholder="Enter your email"
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={loginPassword}
                  placeholder="Enter your password"
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2 d-flex">
                <Form.Check
                  type="checkbox"
                  value={rememberMe}
                  onChange={(e) => setRememberMe(!rememberMe)}
                />
                <Form.Label className="ms-2">Remember Me</Form.Label>
              </Form.Group>
              <Form.Group className="mb-2">
                <Button className="rounded-pill" onClick={handleLoginUser}>
                  Login
                </Button>
                <p className="mt-4">
                  <Link to="/forgot-password">
                    <span className="text-primary">Forgot Password?</span>
                  </Link>
                  .
                </p>
              </Form.Group>
            </div>
          )}
        </Col>
        <Col className="px-5 bg-light d-flex flex-column justify-content-center align-items-center form-divcolumnslogin">
          <div className="d-flex  flex-column text-center m-4 p-5 form-space">
            <p>{signUpShow ? "Already have" : "Don't have"}&nbsp;an Account?</p>
            <Button
              className="rounded-pill"
              onClick={() => setSignUpShow(!signUpShow)}
            >
              {signUpShow ? "Go to Login" : "Go To SignUp"}
            </Button>
            <p className="mt-4">
              Go to{" "}
              <Link to="/">
                <span className="text-primary">HomePage</span>
              </Link>
              .
            </p>
          </div>
        </Col>
      </Row>
    </main>
  );
};

export default LoginSignUp;
