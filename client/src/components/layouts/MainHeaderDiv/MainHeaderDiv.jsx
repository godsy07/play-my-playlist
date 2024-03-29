import React, { forwardRef } from "react";
import logo from "../../../images/PMPL-LOGO.png";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./main-header.styles.css";
import { Dropdown } from "react-bootstrap";
import AvatarIcon from "../../../components/AvatarIcon/AvatarIcon";
import axios from "axios";
import { useCookies } from "react-cookie";
import { BASE_URL } from "../../../config/constants";
import { useUserContext } from "../../providers/AuthProvider";

const MainHeaderDiv = (
  { title, routeName, redirectPromt, promptMessage },
  ref,
) => {
  const history = useNavigate();
  const { user, logoutUser } = useUserContext();
  const [cookies, removeCookie] = useCookies(["playlist_token"]);

  const promptCall = (path) => {
    Swal.fire({
      title: promptMessage,
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        history(path, { replace: true });
        // history("/");
      } else if (result.isDenied) {
        return;
      }
    });
  };

  const redirectHome = () => {
    if (redirectPromt) {
      promptCall("/");
    } else {
      history("/");
    }
  };

  const redirectPage = () => {
    if (redirectPromt) {
      promptCall(routeName);
    } else {
      history(routeName, { replace: true });
    }
  };

  // logout user api call
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${BASE_URL}/playlist/api/user/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("logout");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully logged out of your account.",
        });
        logoutUser();
        removeCookie("playlist_token");
        history({
          pathname: "/",
          search: "?logout=success",
          state: {
            message: "You have successfully logged out of your account.",
          },
        });

        return;
      }
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response.data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong.",
        });
      }
      return;
    }
  };

  return (
    <div ref={ref} className="main-header">
      <div>
        <img
          src={logo}
          alt="Logo"
          className="logo-image"
          style={{ cursor: "pointer" }}
          onClick={redirectHome}
        />
      </div>

      <div className="username">
        {user && (
          <>
            <AvatarIcon
              imageUrl={
                user.profile_pic_url && BASE_URL + "/" + user.profile_pic_url
              }
              // imageUrl='https://robohash.org/34?set=set2'
              AvatarWidth="30"
            />

            <Dropdown className="d-inline mx-2">
              <Dropdown.Toggle
                className="text-dark"
                as="span"
                id="dropdown-autoclose-true"
              >
                <em>
                  <i>{user.name.split(" ")[0]}</i>
                </em>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="userSettings">
                  Settings
                </Dropdown.Item>
                <Dropdown.Item href="#">Rooms</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        )}

        <span onClick={redirectPage} style={{ cursor: "pointer" }}>
          {title}
        </span>
      </div>
    </div>
  );
};

export default forwardRef(MainHeaderDiv);
