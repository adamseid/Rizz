import React, { useContext, useEffect, useState } from "react";
import "../../App.css";
import { ClickContext } from "../Foundation";
import homeButton from "../../images/homebutton1.png";
import downloadButton from "../../images/downloadbuttonrizz1.png";
import resetButton from "../../images/resetbutton1.png";
import leaderBoardButton from "../../images/leaderboardbutton1.png";

function PlayGameContainer({ walletAddress, isReset, parentCallback, chat }) {
  const STARTING_SECONDS = 30;
  const STARTING_MINUTES = 1;
  const [seconds, setSeconds] = useState(STARTING_SECONDS);
  const [minutes, setMinutes] = useState(STARTING_MINUTES);
  const click = useContext(ClickContext);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isReset) {
        setMinutes(1);
        setSeconds(30);
        document.getElementById("reset_modal_container").style.display = "none";
        document
          .getElementById("text_modal_container")
          .classList.remove("active");
        parentCallback(false);
      }
      if (seconds <= 0 && minutes === 0) {
        clearInterval(intervalId);
        console.log("TIMES UP");
        parentCallback(false);
        click.goToScorePage(chat);
      } else if (seconds === 0 && minutes >= 1) {
        setSeconds(59);
        setMinutes((prevMinutes) => prevMinutes - 1);
      } else {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds, minutes]);

  function onClickReset() {
    document.getElementById("reset_modal_container").style.display = "block";
    document.getElementById("text_modal_container").classList.add("active");
  }

  return (
    <nav className="navbar playGameNavbar">
      <img
        alt="homebutton"
        src={homeButton}
        onClick={click.onClickProfile}
        className="clickable navhover"
      ></img>
      <img
        alt="downloadbutton"
        className="clickable navhover"
        src={downloadButton}
        onClick={click.onClickDownload}
      ></img>
      <img
        alt="resetbutton"
        src={resetButton}
        onClick={onClickReset}
        className="clickable navhover"
      ></img>
      <img
        alt="leaderboardbutton"
        src={leaderBoardButton}
        className="clickable navhover"
        onClick={click.onClickLeaderboard}
      ></img>
      <div className="timer">
        <div>
          Time: {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </div>
      </div>
    </nav>
  );
}

export default PlayGameContainer;
