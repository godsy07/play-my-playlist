import React, { useEffect, useRef } from "react";
import { Button, Figure, Image } from "react-bootstrap";
import {
  FaCheck,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash,
  FaTrophy,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
// import { FaRegCheckCircle } from "react-icons/fa";
import { BiWifiOff } from "react-icons/bi";
import thoughtCloudImage from "../../images/avatar/thought_clouds.png";
import winnerTrophy from "../../images/avatar/winner.png";

import userProfilePic from "../../images/user/user-profile.png";
import "./avatar-icon.styles.css";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdWhereToVote } from "react-icons/md";

const AvatarIcon = ({
  AvatarWidth = 100,
  imageUrl,
  showStatus,
  votedStatus,
  votedStatusValue,
  onVotedStatusChange,
  statusDetails = "connected",
  streamButtons,
  streamStatus,
  streamData,
  passVideo,
  passAudio,
  toggleAudio,
  toggleVideo
}) => {
  const streamVideoRef = useRef(null);
  // console.log(streamData)

  useEffect(() => {
    if (streamVideoRef.current !== null) {
      console.log(streamData)
      streamVideoRef.current.srcObject = streamData;
    }
    // if (streamVideoRef !== null) streamVideoRef.current.srcObject = streamData
  }, [streamVideoRef, streamData])

  return (
    <Figure
      style={{ height: `${AvatarWidth}px`, width: `${AvatarWidth}px` }}
      className='avatar-icon-shape'
    >
      {votedStatus && (
        <Button
          onClick={onVotedStatusChange}
          className={`${
            votedStatusValue ? "bg-success" : "bg-warning"
          } d-flex justify-content-center align-items-center p-0`}
          title='Click here to vote'
          style={{
            position: "absolute",
            left: "10px",
            top: "10px",
            zIndex: "2",
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            fontSize: "20px",
          }}
        >
          <MdWhereToVote />
        </Button>
      )}
      {passVideo ? (
        <>
          <video
            className="video-stream"
            ref={streamVideoRef}
            height={`${AvatarWidth}px`}
            width={`${AvatarWidth}px`}
            autoPlay
          >
            <p>
              Your browser doesn't support HTML5 video.
            </p>
          </video>
        </>
      ) : (
        <Figure.Image
          // height={`${AvatarWidth}px`}
          // width={`${AvatarWidth}px`}
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
          alt='profile-image'
          src={imageUrl ? imageUrl : userProfilePic }
          className='avatar-icon'
          roundedCircle
        />
      )}

      {streamButtons && (
        <div className="d-flex" style={{ position: "absolute", bottom: "0", left: "50%",  transform: 'translate(-50%, -50%)' }}>
          <span
            className='d-flex justify-content-center align-items-center mx-2'
            style={{
              height: "20px",
              width: "20px",
              border: "1px solid rgb(0,0,0,0.4)",
              borderRadius: "50%",
              backgroundColor: `${passAudio ? "rgb(100, 200, 100)" : "rgb(250, 100, 100)" }`,
            }}
          >
            {!passAudio ? <FaMicrophoneAltSlash onClick={toggleAudio} /> : <FaMicrophoneAlt onClick={toggleAudio} /> }
          </span>
          <span
            className='d-flex justify-content-center align-items-center mx-2'
            style={{
              height: "20px",
              width: "20px",
              border: "1px solid rgb(250,250,250,0.9)",
              borderRadius: "50%",
              backgroundColor: `${passVideo ? "rgb(100, 200, 100)" : "rgb(250, 100, 100)" }`,
            }}
            >
            {!passVideo ? <FaVideoSlash onClick={toggleVideo} /> : <FaVideo onClick={toggleVideo} /> }
          </span>

        </div>
      )}

      {showStatus && (
        <div
          className='user-status'
          style={{
            // backgroundColor: statusDetails ? "#05D505" : "#07C9C9",
            top: statusDetails === "thinking" ? "-12px" : "0px",
            right: statusDetails === "thinking" ? "-10px" : "0px",
            backgroundColor:
              statusDetails === "connected"
                ? "#05D505"
                : statusDetails === "network-issue"
                ? "rgb(244, 153, 61)"
                : statusDetails === "thinking"
                && "#11ffee00",
                // ? "rgb(100,100,200)"
                // : statusDetails === "winner" && "rgb(50,50,50, 0.7)",
            color: statusDetails === "winner" && "yellow",
          }}
        >
          {statusDetails === "connected" ? (
            <FaCheck />
          ) : statusDetails === "network-issue" ? (
            <BiWifiOff />
          ) : statusDetails === "thinking" ? (
            // <IoChatbubbleEllipsesOutline />
            <Image src={thoughtCloudImage} style={{ width: "300px" }} />
          ) : (
            statusDetails === "winner" && (
            // <FaTrophy />
            <Image src={winnerTrophy} width={35} />
            )
          )}
          {/* {statusDetails ? <FaCheck /> : <BiWifiOff />} */}
          {/* {statusDetails ? <FaRegCheckCircle /> : <BiWifiOff />} */}
        </div>
      )}
    </Figure>
  );
};

export default AvatarIcon;
