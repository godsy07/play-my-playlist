import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";

import LoadingSpinner from './LoadingSpinner/LoadingSpinner';

const MainContainer = () => {
  const location = useLocation();
  const history = useNavigate();

  const [cookies] = useCookies(["playlist_token"]);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) checkValidToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // // API call to check if the token available is valid
  function checkValidToken() {
    try {
      if (cookies.playlist_token) {
        var decoded = jwt_decode(cookies.playlist_token);
        if (decoded) {
          if (location.pathname === "/login-signup") {
            history("../home");
          }
        }
      } else {
        if (
          !(
            location.pathname === "/home" ||
            location.pathname === "/login-signup"
          )
        ) {
          history("../login-signup");
        }
      }
      setLoaded(true);
    } catch (e) {
      if (
        !(
          location.pathname === "/home" || location.pathname === "/login-signup"
        )
      ) {
        history("../home");
      }
      setLoaded(true);
    }
  }

  if (loaded) {
    return (
      <div className='main-container-div'>
        <Outlet />
      </div>
    );
  } else {
    return (
      <div className='main-container-div d-flex justify-content-center mt-5'>
        {/* <h1>Loading.......</h1> */}
        <LoadingSpinner />
      </div>
    );
  }
};

export default MainContainer;
