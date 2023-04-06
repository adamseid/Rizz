import React, { useState, useEffect, useContext, Component } from "react";
import Container from "./Container";
import group262 from "../../images/group262.png";
import group260 from "../../images/group260.png";
import axios from "axios";
import homeButton from "../../images/homebutton1.png";
import downloadButton from "../../images/downloadbuttonrizz1.png";
import resetButton from "../../images/resetbutton1.png";
import leaderBoardButton from "../../images/leaderboardbutton1.png";
import { ClickContext } from "../Foundation";

function ScorePage(props) {
  const click = useContext(ClickContext);

  const text = [
    "Sent to Prizzon",
    "The Last Rizzort",
    "Adolf Rizzler",
    "Need a Rizztraining Order",
    "Corona Virizz",
    "Natural Rizzaster",
    "Night mare before Rizzmas",
    "Averizz",
    "Rizziliguous",
    "Rizz Khalifa",
    "Rizzy Neutron",
    "Artirizzal Intelligence",
    "The Rizzen",
    "Rizzus Christ Best Rizz",
    "The Last Rizzbender",
    "Rizz Norris",
    "Dwayne the Rizz Johnson",
    "Exodirizz",
  ];
  // var score = Math.floor(Math.random() * (1000 - 100) + 100) / 100;
  
  let score = 0;
  const randNum = Math.floor(Math.random() * (101)) // randNum is a random number between 0 and 100
  if(props['chat'].length <= 2){
    score = 0
  } else if(randNum <= 2){ //if number is between 0 and 2, 2/100 chance of score 9.3. 
    score = 9.3
  } else if(randNum <= 7){ //if number is between 2 and 7, 5/100 chance of score 8.0
    score = 8.0
  } else if(randNum <= 17){ //if number is between 7 and 17, 10/100 chance of score 7.4
    score = 7.4
  } else if(randNum <= 37){ //if number is between 37 and 17, 20/100 chance of score 5.3
    score = 5.3
  } else if(randNum <= 67){ //if number is between 37 and 67, 30/100 chance of score 4.7
    score = 4.7
  } else {                  //else number is above 67, 33/100 chance of score 3.2
    score = 3.2
  }

  let displayed_text;
  let displayed_text_class = "displayed_text";

  if (score <= 1.5) {
    displayed_text = text[0];
    displayed_text_class = "displayed_text3";
  } else if (score <= 2) {
    displayed_text = text[1];
    displayed_text_class = "displayed_text4";
  } else if (score <= 2.5) {
    displayed_text = text[2];
    displayed_text_class = "displayed_text5";
  } else if (score <= 3) {
    displayed_text = text[3];
  } else if (score <= 3.5) {
    displayed_text = text[4];
    displayed_text_class = "displayed_text5";
  } else if (score <= 4) {
    displayed_text = text[5];
    displayed_text_class = "displayed_text4";
  } else if (score <= 4.5) {
    displayed_text = text[6];
  } else if (score <= 5) {
    displayed_text = text[7];
    displayed_text_class = "displayed_text6";
  } else if (score <= 5.5) {
    displayed_text = text[8];
    displayed_text_class = "displayed_text7";
  } else if (score <= 6) {
    displayed_text = text[9];
    displayed_text_class = "displayed_text7";
  } else if (score <= 6.5) {
    displayed_text = text[10];
    displayed_text_class = "displayed_text5";
  } else if (score <= 7) {
    displayed_text = text[11];
  } else if (score <= 7.5) {
    displayed_text = text[12];
    displayed_text_class = "displayed_text7";
  } else if (score <= 8) {
    displayed_text = text[13];
  } else if (score <= 8.5) {
    displayed_text = text[14];
  } else if (score <= 9) {
    displayed_text = text[15];
    displayed_text_class = "displayed_text7";
  } else if (score <= 9.5) {
    displayed_text = text[16];
  } else {
    displayed_text = text[17];
    displayed_text_class = "displayed_text7";
  }

  function addScoreHttpRequest() {
    const url =
      process.env.REACT_APP_.BACKEND_BASE_URL +
      process.env.REACT_APP_.ADD_SCORE_API_URL;
    console.log("SCORE PAGE: ", props["walletAddress"]);
    console.log(url);
    console.log(score);
    axios
      .post(url, { walletAddress: props["walletAddress"], score: score })
      .then((response) => {
        console.log("SCORE RESPONSE: ", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    addScoreHttpRequest();
  }, []);

  return (
    <div className="container">
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
          onClick={click.onClickPlayGame}
          className="clickable navhover"
        ></img>
        <img
          src={leaderBoardButton}
          onClick={click.onClickLeaderboard}
          className="clickable navhover"
        ></img>
      </nav>

      <div className="scorePageContainer">
        <div id="scorePageSpeechContainer">
          <img alt="group262" src={group262}></img>
          <div className={displayed_text_class}>{displayed_text}</div>
        </div>
        <img alt="group260" id="scorePageGroup260" src={group260}></img>
        <div className="rizzScore">Rizz Score</div>
        <div className="scorePageScore">
          {Math.round(score * 10) / 10}/10 Rizz
        </div>
        <div
          className="viewAccount clickable"
          onClick={props.onClickScoreHistory}
        >
          View Your Account's Rizz Points
        </div>
      </div>
    </div>
  );
}

export default ScorePage;
