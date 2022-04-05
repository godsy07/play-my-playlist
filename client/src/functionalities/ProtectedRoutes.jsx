import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
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
    setUserInfo({ data: decoded });
    setIsLoaded(true);
  }

  if (!isLoaded) {
    return (
      <div className='main-container mt-5 d-flex justify-content-center'>
        <LoadingSpinner className="mt-5" />
      </div>
    );
  } else if (isLoaded === true && userInfo === null) {
    return (
      <Redirect
        to={{
          pathname: "/login-signup",
          search: "?user=unauthorized",
          state: { signup: false },
        }}
      />
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
