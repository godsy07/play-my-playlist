import React, { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { FaCaretDown, FaCaretUp, FaPaperPlane } from "react-icons/fa";

import "./floating-text-div.styles.css";

const FloatingTextBlock = ({
  message,
  setMessage,
  onClick,
  textMessages,
  userID,
}) => {
  const [showDiv, setShowDiv] = useState(false);
  return (
    <div className='floating-main-div'>
      <div className='text-dark d-flex justify-content-between floating-div-heading'>
        <span>Chats</span>
        <span
          className='floating-heading-caret'
          onClick={() => setShowDiv(!showDiv)}
        >
          {showDiv ? <FaCaretDown /> : <FaCaretUp />}
        </span>
      </div>
      <div className={`${showDiv ? "d-block" : "d-none"}`}>
        <div className='floating-content-div'>
          {textMessages.length !== 0 &&
            textMessages.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "4px 8px",
                }}
                className='d-flex flex-column'
              >
                <span style={{ fontStyle: "italic" }}>
                  <strong>
                    {userID && userID === item.user_id ? "You," : item.username}
                  </strong>
                  {/* <strong>{item.username},</strong> */}
                  <span className='ms-1'>{item.time}</span>
                </span>
                <span
                  className='bg-light'
                  style={{ borderRadius: "5px", padding: "4px 5px" }}
                >
                  {item.text}
                </span>
              </div>
            ))}
        </div>
        <InputGroup
          style={{
            width: "100%",
            // position: "absolute",
            // bottom: "0",
            padding: "2px",
          }}
        >
          <Form.Control
            type='text'
            size='sm'
            value={message}
            onChange={setMessage}
            placeholder='Enter your message'
            onKeyPress={(e) => {
              if (e.which === 13) {
                onClick(e); // On keypress Enter
              }
            }}
          />
          <Button onClick={onClick}>
            <FaPaperPlane /> Send
          </Button>
        </InputGroup>
      </div>
    </div>
  );
};

export default FloatingTextBlock;
