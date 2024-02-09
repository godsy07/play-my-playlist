import jwtDecode from "jwt-decode";
import { useCookies } from "react-cookie";
import React, { useState, useEffect, createContext, useContext } from "react";

import { getCurrentUser } from "../../utils/api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, removeCookie] = useCookies();

  useEffect(() => {
    let auth = false;
    const token = cookies && cookies.playlist_token;
    if (token && token !== "undefined") {
      const decoded = jwtDecode(cookies.playlist_token);
      if (decoded) {
        // check if expired
        if (decoded.exp * 1000 < Date.now()) {
          if (user) setUser(null);
          removeCookie("playlist_token");
        } else {
          auth = true;
        }
      }
    }
    if (!user && auth) {
      checkAuthUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkAuthUser = async () => {
    setIsLoading(true);
    let data = null;
    try {
      const response = await getCurrentUser();
      if (response.status) {
        const userData = response.user;
        data = {
          id: userData._id,
          name: userData.name,
          user_name: userData.user_name,
          email: userData.email,
          profile_pic_url: userData.profile_pic_url
            ? userData.profile_pic_url
            : "",
        };
        setUser({ ...data });
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      setIsLoading(false);
      return data;
    }
  };

  const value = {
    user,
    setUser,
    checkAuthUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
