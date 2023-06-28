import React from "react";
import "./Player.css";

function Player() {
  return (
    <div>
      <div id="videos">
        <video
          className="video-player"
          id="user-1"
          autoPlay
          playsInline
        ></video>
        <video
          className="video-player"
          id="user-2"
          autoPlay
          playsInline
        ></video>
      </div>

      <div id="controls">
        <div class="control-container" id="camera-btn">
            <img src="video-solid.png" alt="Video on-off"/>
        </div>
        <div class="control-container" id="mic-btn">
            <img src="microphone-solid.png" alt="Audio on-off"/>
        </div>
        <a href="lobby.html">
        <div class="control-container" id="leave-btn">
            <img src="phone-solid.png" alt="Leave Meeting"/>
        </div>
        </a>
      </div>
    </div>
  );
}
export default Player;
