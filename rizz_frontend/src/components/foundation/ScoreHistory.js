import React, { useState, useEffect, Component } from "react";
import Container from "./Container";
import "../../App.css";
import axios from 'axios';


function ScoreHistory({ walletAddress }) {


  const [scores, setScores] = useState({
    scoreBoard : [],
    totalScore : 0
  });

  function scoreHistoryHttpRequest () {
    const url = process.env.REACT_APP_.BACKEND_BASE_URL + process.env.REACT_APP_.SCOREBOARD_API_URL
    axios.post(url, {"walletAddress" : walletAddress}).then((response) => {
        console.log("LEADERBOARD RESPONSE: ",response.data)
        setScores(response.data['profile_response'])
    }).catch(error => {
        console.log(error)
      })
  }


  useEffect(() => {
    scoreHistoryHttpRequest();
  }, []);

  return (
    <Container>
      <div className="scoreHistoryContainer">
        <div className="score_history_wrapper" id="style-1">
          <table className="scoreHistoryTable">
            <thead>
              <tr>
                <th>Games Played</th>
                <th>Rizz Score</th>
                <th>Rizz Points</th>
              </tr>
            </thead>
            <tbody>
              {scores['scoreBoard'].map((game, index) => {
                return (
                  <tr key={index}>
                    <td>{game[0]}</td>
                    <td>{game[1]/100}/10</td>
                    <td>{game[1]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="totalPoints">
            <div>Total Points</div>
            <div>{scores['totalScore']}</div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ScoreHistory;
