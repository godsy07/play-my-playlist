import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Form,
  Accordion,
  Image,
  InputGroup,
  Col,
} from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import "./UserSettings.css";
import profilePic from "../../images/user/user-profile.png";
import MainHeaderDiv from "../../components/layouts/MainHeaderDiv/MainHeaderDiv";
import { IoAccessibilitySharp } from "react-icons/io5";
import { BASE_URL } from "../../config/constants";

const UserSettings = ({ userInfo }) => {
  const history = useNavigate();
  const [cookie, setCookie] = useCookies();
  const [userID, setUserID] = useState("");
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [userPicURL, setUserPicURL] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [newForgotPassword, setnewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");

  useEffect(() => {
    setUserID(userInfo._id);
    fetchUserDetails(userInfo._id);
  }, []);

  const fetchUserDetails = () => {
    setUserPicURL(
      userInfo.profile_pic_url && BASE_URL + "/" + userInfo.profile_pic_url,
    );
    setuserEmail(userInfo.email);
  };

  const validateUpdateUserPassword = () => {
    let title = "",
      text = "";
    // validate data given by user to login
    if (userEmail.length === 0) {
      title = "Email empty";
      text = "Email should not be empty.";
    } else if (oldPassword.length === 0) {
      title = "Current Password empty";
      text = "Current password should not be empty.";
    } else if (oldPassword.length < 6) {
      title = "Current Password too short";
      text = "Current Password should be atleast 6 characters.";
    } else if (newForgotPassword.length === 0) {
      title = "New Password empty";
      text = "New Password should not be empty.";
    } else if (newForgotPassword.length < 6) {
      title = "New Password too short";
      text = "Set a secure Password atleast 6 characters long.";
    } else if (confirmForgotPassword.length === 0) {
      title = "Confirm Password empty";
      text = "Confirm Password should not be empty.";
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
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      if (!validateUpdateUserPassword()) {
        return;
      }
      var formData = new FormData();
      formData.append("user_id", userID);
      formData.append("email", userEmail);
      formData.append("old_password", oldPassword);
      formData.append("new_password", newForgotPassword);
      formData.append("confirm_new_password", confirmForgotPassword);
      formData.append("profile_pic", userProfilePic);

      const response = await axios({
        method: "POST",
        url: `${BASE_URL}/playlist/api/user/user-update`,
        data: formData,
        header: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        console.log(response);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully updated your profile.",
        });
        return;
      }
    } catch (error) {
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

  return (
    <div className="main-container">
      <MainHeaderDiv title="Exit Room" routeName="Home" userInfo={userInfo} />
      <div className="settings-div">
        <Container fluid className="main1-box">
          <Row md={2} xs={1}>
            <Col>
              <Form.Group className="mb-2 d-flex justify-content-center">
                <Image
                  width={260}
                  height={260}
                  className="bg-secondary p-2 rounded-circle"
                  src={
                    userProfilePic
                      ? URL.createObjectURL(userProfilePic)
                      : userPicURL !== null
                      ? userPicURL
                      : profilePic
                  }
                  // src={userProfilePic ? userProfilePic.name : profilePic}
                  style={{ objectFit: "cover" }}
                />
              </Form.Group>
              <Form.Group className="d-flex flex-column align-self-end">
                <Form.Control
                  type="file"
                  // size="sm"
                  className="mb-2"
                  onChange={(e) => {
                    e.persist();
                    setUserProfilePic(e.target.files[0]);
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-2">
                <Form.Label>Enter your Email ID</Form.Label>
                <Form.Control
                  type="email"
                  value={userEmail}
                  onChange={(e) => setuserEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Enter your current password</Form.Label>
                <Form.Control
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Set up a new password</Form.Label>
                <Form.Control
                  type="password"
                  value={newForgotPassword}
                  onChange={(e) => setnewForgotPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Confirm your password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmForgotPassword}
                  onChange={(e) => setConfirmForgotPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button className="w-100 my-2" onClick={handleUpdateUser}>
                Update User Details
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};
export default UserSettings;
