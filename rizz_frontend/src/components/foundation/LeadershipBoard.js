import React, { useState, useEffect, Component } from "react";
import axios from "axios";

import Container from "./Container";

export default function LeadershipBoard() {
  // Have the leaderboard scores as a state. Set initial state.
  const [leaderBoardScores, setLeaderBoardScores] = useState([]);

  function leadershipBoardHttpRequest() {
    const url =
      process.env.REACT_APP_.BACKEND_BASE_URL +
      process.env.REACT_APP_.LEADERBOARD_API_URL;
    axios
      .get(url)
      .then((response) => {
        setLeaderBoardScores(response.data["profile_response"]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    leadershipBoardHttpRequest();
  }, []);

  return (
    <>
      <Container>
        <div className="leaderboardWrapper">
          <div className="leaderboardContainer" id="style-1">
            <p>Leaderboard</p>
            <ol className="leaderboardList">
              {leaderBoardScores.map((user, index) => {
                return (
                  <li key={index}>
                    <div className="leaderboardUser">
                      <div>{user.userid}</div>
                      <div className="leaderboardScore">{user.score}</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </Container>
    </>
  );
}
