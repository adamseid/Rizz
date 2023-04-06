import React, { useContext } from "react";
import homeButton from "../../images/homebutton1.png";
import downloadButton from "../../images/downloadbuttonrizz1.png";
import resetButton from "../../images/resetbutton1.png";
import leaderBoardButton from "../../images/leaderboardbutton1.png";
import "../../App";
import { ClickContext } from "../Foundation";

function Navbar(props) {
  const click = useContext(ClickContext);

  return (
    <nav className="navbar">
      <img
        src={homeButton}
        onClick={click.onClickProfile}
        className="clickable navhover"
      ></img>
      <img 
        src={downloadButton} 
        onClick={click.onClickDownload}
        className="clickable navhover"
      ></img>
      <img 
        src={resetButton} 
        className="hidden"
      ></img>
      <img
        src={leaderBoardButton}
        onClick={click.onClickLeaderboard}
        className="clickable navhover"
      ></img>
    </nav>
  );
}

export default Navbar;
