import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode"
import { Container, Row, Col, Button } from "react-bootstrap";
import HeaderDiv from "../../components/Header/Header";
import FooterComponent from "../../components/Footer/FooterComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import FloatingDiv from "../../components/FloatingDiv/FloatingDiv";
// import LoadingSpinner from "../../components/layouts/LoadingSpinner/LoadingSpinner";

import "./homepage.styles.css";
import { DATA_URL } from "../..";
import axios from "axios";
import Swal from "sweetalert2";

const HomePage = () => {
  let history = useNavigate();
  const [ cookies, removeCookie ] = useCookies(["playlist_token"]);
  const positionValue = [0, 16]; // postion left and top, in vw and vh respectively
  const paddingValue = [10, 5, 10, 5]; // top, right, bottom, left in pixels
  const borderRadiusValue = [0, 20, 20, 0]; // left top, right top, right bottom, left bottom in pixels

  // states for useInfo
  const [isLoaded, setIsLoaded] = useState(false);
  // const [userInfo, setUserInfo] = useState(null);
  const [userSignInStatus, setUserSignInStatus] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      checkValidToken();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const checkValidToken = async () => {
    try {
      var decoded = await jwt_decode(cookies.playlist_token);
      if (decoded) {
        setUserSignInStatus(true);          
        // const response = await axios.get(
        //   `${DATA_URL}/playlist/api/user/get-data`,
        //   {
        //     withCredentials: true,
        //   }
        // );
        // console.log(response);
        // setUserInfo(response.data);
        // setIsLoaded(true);
      }
      setIsLoaded(true);
    } catch (err) {
      if (err.response) {
        console.log(err.response);
      } else {
        console.log(err);
      }
      setIsLoaded(true);
    }
  };

  // logout user api call
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${DATA_URL}/playlist/api/user/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log('logout');
        removeCookie("playlist_token");
        history({
          pathname: "/",
          search: "?logout=success",
        })
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully logged out of your account.",
        });
        return;
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message
        });
      } else {
        // console.log(error.message);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong."
        });
      }
      return;
    }
  };

  // if (!isLoaded) {
  //   return (
  //     <div className='main-container mt-5 d-flex justify-content-center'>
  //       <LoadingSpinner />
  //     </div>
  //   );
  // } else {
    return (
      <div className='main-container'>
        <FloatingDiv
          position={positionValue}
          padding={paddingValue}
          borderRadius={borderRadiusValue}
          bgColor='orange'
          textDivColor='red'
          textColor='black'
          color='white'
          title={`${
            !userSignInStatus ? "It seems you are not signed in." : "You are logged In"
            // !userInfo ? "It seems you are not signed in." : "You are logged In"
          }`}
        >
          {!userSignInStatus ? (
          // {!userInfo ? (
            <div className='d-flex justify-content-around w-100'>
              <Button
                variant='warning'
                className='rounded-pill border-1 border-dark'
                onClick={() =>
                  history({
                    pathname: "/login-signup",
                    state: {
                      signUp: false,
                    },
                  })
                }
              >
                Log In
              </Button>
              <Button
                variant='info'
                className='rounded-pill border-1 border-dark'
                onClick={() =>
                  history({
                    pathname: "/login-signup",
                    state: {
                      signUp: true,
                    },
                  })
                }
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <Button
              variant='warning'
              className='rounded-pill border-1 border-dark mt-2'
              onClick={handleLogout}
            >
              Log Out
            </Button>
          )}
        </FloatingDiv>
        <Container>
          <Row>
            <Col>
              <HeaderDiv
                headerText='A multiplayer Social Game to play along with your friends in a private
          room.'
              />
            </Col>
          </Row>
          <Row xs={1} lg={2}>
            <Col className='d-flex justify-content-center'>
              <CardComponent
                cardHeading='Create Room'
                textContent='Play along with your friends'
              />
            </Col>
            <Col className='d-flex justify-content-center'>
              <CardComponent
                cardHeading='Join Room'
                textContent='Play along with your friends'
              />
            </Col>
          </Row>
        </Container>
        <FooterComponent />
      </div>
    );
  // }
};

export default HomePage;
