import React from "react";
import "../../App";
import Container from "./Container";
import group260 from "../../images/group260.png";

export default function Profile(props) {
  return (
    <>
      <Container>
        <section className="profileInnerContainer">
          <img className="profileItem" src={group260}></img>
          <button
            className="profileButton clickable"
            onClick={props.onClickPlayGame}
          >
            Play Rizz
          </button>
          <button
            className="profileButton clickable"
            onClick={props.onClickLeaderboard}
          >
            Leaderboard
          </button>
          <button
            className="profileButton clickable"
            onClick={props.onClickScoreHistory}
          >
            Your Account's Rizz Points
          </button>
        </section>
      </Container>
    </>
  );
}
