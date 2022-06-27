import React from "react";
import AvatarIcon from "./AvatarIcon/AvatarIcon";
import { Container } from "react-bootstrap";
import { DATA_URL } from "../index";

const PlayerLobby = ({
  roomPlayers,
  streamVideo,
  passAudio,
  passVideo,
  toggleAudio,
  toggleVideo,
}) => {
  return (
    <>
      <Container
        className='px-4 py-2'
        style={{
          backgroundColor: "rgb(255, 210, 210)",
          minHeight: "200px",
          borderRadius: "5px",
        }}
      >
        <div className='w-full text-center mb-3'>
          <h3>Waiting Lobby...</h3>
        </div>
        <div className='profile-icons-div'>
          {roomPlayers.length !== 0 &&
            roomPlayers.map((item, index) => (
              <div
                key={index}
                // className='d-flex flex-column justify-content-center align-items-center p-2 m-1'
                className='d-flex flex-column align-items-center p-2 m-1 text-center'
              >
                <AvatarIcon
                  imageUrl={
                    item.profile_pic_url &&
                    DATA_URL + "/" + item.profile_pic_url
                  }
                  // statusDetails={true}
                  statusDetails='connected'
                  showStatus={true}
                  streamButtons={true}
                  streamData={streamVideo}
                  passAudio={passAudio}
                  passVideo={passVideo}
                  toggleAudio={toggleAudio}
                  toggleVideo={toggleVideo}
                  // toggleAudio={() => setPassAudio(!passAudio)}
                  // toggleVideo={() => setPassVideo(!passVideo)}
                />
                <span>{item.name.split(" ")[0]}</span>
                <span>
                  {item.songsCount ? item.songsCount : "No"} songs added
                </span>
              </div>
            ))}
        </div>
      </Container>
    </>
  );
};

export default PlayerLobby;
