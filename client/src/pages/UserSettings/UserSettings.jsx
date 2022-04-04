import React ,{ useState } from "react";
import { Link ,useHistory} from "react-router-dom";
import { Container, Button, Form,Accordion } from "react-bootstrap";
import axios from "axios";
import { DATA_URL } from "../../index";
import Swal from "sweetalert2";
import { useCookies } from "react-cookie";
import "./UserSettings.css"

const UserSettings = ({userInfo}) => {
  const history = useHistory();
  const [cookie, setCookie] = useCookies();
  const [oldPassword, setOldPassword] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [newForgotPassword, setnewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");
  

  const validateUpdateUserPassword = () => {
    let title = "",
      text = "";
    // validate data given by user to login
    if (oldPassword.length === 0) {
      title = "Password empty";
      text = " Old password should not be empty.";
    } else if (newForgotPassword.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    } else if (confirmForgotPassword.length === 0) {
      title = "Password empty";
      text = "Password should not be empty.";
    }else if (newForgotPassword.length < 6) {
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
  const updateUser = async () => {
    try {
      const response = await axios.post(`${DATA_URL}/playlist/api/user/userSettings`, {
        email: userEmail,
        oldpassword:oldPassword,
        newpassword:newForgotPassword,
      });
      // console.log(response);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "You have successfully update your password.",
        });
        setCookie("playlist_token", response.data.token);
        history.push("/");
        // history.push("/");
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
  const handleUpdatePasswordUser = (e) => {
    e.preventDefault();
    // getUser();
    if (validateUpdateUserPassword()) {
      updateUser();
    }
  };
    return(
        <Container fluid className="main1-box">
         <div style={{justifyContent:'center'}} >
           <Accordion className="px-5 py-3 flex accordianclass ">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Update Password  </Accordion.Header>
                 <Accordion.Body>
                    <Form.Group className='mb-2 w-50'>
                      <Form.Label>Enter your Email id</Form.Label>
                        <Form.Control
                            type='email'
                            value={userEmail}
                            onChange={(e) => setuserEmail(e.target.value)}
                         />
                    </Form.Group>
                    <Form.Group className='mb-2 w-50'>
                      <Form.Label>Enter your old password</Form.Label>
                        <Form.Control
                            type='password'
                            value={oldPassword}
                            
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='mb-2 w-50'>
                      <Form.Label>Enter your new password</Form.Label>
                        <Form.Control
                            type='password'
                            value={newForgotPassword}
                            onChange={(e) => setnewForgotPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='mb-2 w-50'>
                      <Form.Label>Confirm your password</Form.Label>
                        <Form.Control
                            type='password'
                            value={confirmForgotPassword}
                            onChange={(e) => setConfirmForgotPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='mb-2 '>
                       <Link to='/userSettings'>
                         <Button className='rounded-pill' onClick={handleUpdatePasswordUser} >
                            Submit
                         </Button>
                        </Link>
                     </Form.Group>
                  </Accordion.Body> 
              </Accordion.Item>
              
              <Accordion.Item eventKey="1">
              <Accordion.Header>Update Image  </Accordion.Header>
                 <Accordion.Body>
                    <Form.Group className='mb-2 w-50'>
                      <Form.Label>Upload new Image</Form.Label>
                        <Form.Control
                            type='file'
                            //name="file"
                           // isInvalid={!!errors.file}
                         />
                        
                    </Form.Group>
                 </Accordion.Body>
              </Accordion.Item>   
          </Accordion>
         </div>  

        </Container>
    );
};
export default UserSettings;