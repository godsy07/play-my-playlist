import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";

import axios from "axios";
import { DATA_URL } from "../index";
import LoadingSpinner from "../components/layouts/LoadingSpinner/LoadingSpinner";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const [cookies] = useCookies(["playlist_token"]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // On mount check if the token data exists in DB
  useEffect(() => {
    if (!userInfo) {
      checkValidToken();
    }
  }, [userInfo]);
  // // API call to check if the token available is valid
  function checkValidToken() {
    var decoded = jwt_decode(cookies.playlist_token);
    fetchUserData(decoded.id)
  }

  const fetchUserData = async (user_id) => {
    try {
      const response = await axios.post(
        `${DATA_URL}/playlist/api/user/get-user-details`,
        {
          user_id,
        }
      );

      if (response.status === 200) {
        setUserInfo(response.data.userInfo);
        setIsLoaded(true);
      }

    } catch(error) {
      if (error.response) {
        console.log(error.response);
      } else {
        console.log(error);
      }
      setIsLoaded(true);
    }
  }

  if (!cookies.playlist_token) {
    return <Redirect to={{
      pathname: "/login-signup",
      search: "?user=unauthorized",
      state: { signup: false }
    }}
  />;
  }

  if (!isLoaded) {
    return (
      <div className='main-container mt-5 d-flex justify-content-center'>
        <LoadingSpinner className="mt-5" />
      </div>
    );
  } else {
    return (
      <Route
        {...restOfProps}
        render={(props) => <Component {...props} userInfo={userInfo} />}
      />
    );
  }
}

export default ProtectedRoute;
