import React, { Component, createContext} from "react";
import Header from "./foundation/Header";
import Profile from "./foundation/Profile";
import PlayGame from "./foundation/PlayGame";
import html2canvas from 'html2canvas';
import canvas2image from "canvas2image-2";
import * as htmlToImage from 'html-to-image';

import LeadershipBoard from "./foundation/LeadershipBoard";
import ScoreHistory from "./foundation/ScoreHistory";
import ScorePage from "./foundation/ScorePage";

import leftImage from "../images/gangster.png";
import rightImage from "../images/pointing.png";
import landingImage from "../images/landingPage.png";
import "../App.css";

const openers = [
  "I honestly can't be bothered. You have something you want to say?",
  "Heyyy 🙂",
  "I'm not in the mood today . . . what the fuck do you want?"
];

const default_state = {
  header: {
    display: "show",
    walletAddress: "Wallet ID",
  },
  reset: {
    isTrue: false
  },
  profile: {
    displayPage: true,
  },
  play_game: {
    displayPage: false,
    most_recent_text: "",
  },
  leaderboard: {
    displayPage: false,
  },
  score_history: {
    displayPage: false,
  },
  score_page: {
    displayPage: false,
  },
  game:
    [
      {
        id : "ai",
        message: openers[Math.floor(Math.random() * (3) )],
      }
    ]
};

export const ClickContext = createContext();

export default class Foundation extends Component {
  constructor(props) {
    super(props);
    this.state = default_state;
  }

  componentDidMount = () => {
    this.iswalletConnected();
    this.state["game"] = [{
      id : "ai",
      message: openers[Math.floor(Math.random() * (3) )],
    }]
  };

  iswalletConnected = async () => {
    if (window.ethereum) {
      await window.ethereum
        .request({
          method: "eth_accounts",
        })
        .then((result) => {
          if (result[0]) {
            if (result[0].length > 0) {
              this.state["header"]["walletAddress"] = result[0];
              this.updateDefaultState();
            }
          } else {
            console.log("NOT SIGNED IN");
          }
        });
    }
  };

  onPressed = async () => {
    if (window.ethereum) {
      await window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((result) => {
          if (result[0]) {
            if (result[0].length > 0) {
              this.state["header"]["walletAddress"] = result[0];
              this.updateDefaultState();
              console.log("SUCCESS: ", this.state);
            } else {
              console.log("INVALID WALLET ADDRESS");
            }
          }
        });
    }
  };

  updateDefaultState() {
    this.setState(this.state);
  }

  // onClick for going to leaderboard
  onClickLeaderboard = () => {
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["leaderboard"]["displayPage"] = true;
    this.updateDefaultState();
  };

  onClickProfile = () => {
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["profile"]["displayPage"] = true;
    this.updateDefaultState();
  };

  // FIX THIS

  // onClickDownload = () => {
  //   html2canvas(document.body).then(canvas => {
  //     var a = document.createElement('a');
  //     // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
  //     a.href = canvas.toDataURL("image/png").replace("image/jpeg", "image/octet-stream");
  //     a.download = 'somefilename.jpg';
  //     a.click();
  //   });
  // };

  onClickDownload = () => {
    document.body.classList.add("flash");
    const navbar = document.querySelector(".navbar");
    navbar.style.display = 'none';
    if(this.state.leaderboard.displayPage){
      document.querySelector(".container").style.height = "1200px";
      document.querySelector(".leaderboardContainer").style.maxHeight = "1100px";
    } 
    if(!this.state.leaderboard.play_game){
      this.forceUpdate()
    }
    htmlToImage.toJpeg(document.querySelector(".inner-container")).then(
      (dataUrl) => {
        var link = document.createElement('a');
        link.download = 'my-image-name.jpeg';
        link.href = dataUrl;
        link.click();
      }
    ).then(()=>{
      if(this.state.play_game.displayPage){
        navbar.style.display = 'flex'
      } else {
        navbar.style.display = 'block';
        document.querySelector(".container").style.height = "574px";
        document.querySelector(".leaderboardContainer").style.maxHeight = "450px";
      }
    })
    setTimeout(()=> document.body.classList.remove("flash"), "5000");
  };

  goToScorePage = (chat) => {
    this.state["game"] = chat
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["score_page"]["displayPage"] = true;
    this.updateDefaultState();
  };

  onClickPlayGame = () => {
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["play_game"]["displayPage"] = true;
    this.updateDefaultState();
  };

  onClickHandlers = {
    onClickLeaderboard: this.onClickLeaderboard,
    onClickProfile: this.onClickProfile,
    onClickDownload: this.onClickDownload,
    goToScorePage: this.goToScorePage,
    onClickPlayGame: this.onClickPlayGame
  };

  onClickScoreHistory = () => {
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["score_history"]["displayPage"] = true;
    this.updateDefaultState();
  };

  onClickScoreHistory = () => {
    Object.values(this.state).forEach((element) => {
      element.displayPage && (element.displayPage = !element.displayPage);
    });
    this.state["score_history"]["displayPage"] = true;
    this.updateDefaultState();
  };

  render() {
    return (
      <div className="background">
        {this.state["header"]["walletAddress"] == "Wallet ID" ? (
          <div className="component_container landing_page">
            <div className="outer-container landing_page">
              <div className="title_text">Rizz to earn</div>
              <img className="landing-page-image" src={landingImage} />
              <div className="connect-button" onClick={this.onPressed}>
                Connect Wallet to play
              </div>
              <div className="instructions-container">
                <div className="instructions-title">How to play: </div>
                <div className="instructions-text">
                Win Rizz Points by talking to Aiyesha. 
                Points will be used to mint RIZZ NFTs that farm $RIZZ, our native tradeable token.
                <br></br>
                <br></br>
                Note: Each game the chat log is reset after 90 seconds. 
                Like all AI, Aiyesha is not perfect and her responses could sometimes be inconsistent. 
                Aiyesha might miss your message sometimes, so if she doesn't reply after a few seconds 
                message her again or restart the game! 
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <Header state={this.state} />
            <div className="component_container">
              <div className="outer-container">
                <div className="inner-container">
                  <ClickContext.Provider value={this.onClickHandlers}>
                    {this.state["leaderboard"]["displayPage"] ? (
                      <LeadershipBoard />
                    ) : (
                      <></>
                    )}
                    {this.state["profile"]["displayPage"] ? (
                      <Profile
                        onClickLeaderboard={this.onClickLeaderboard}
                        onClickScoreHistory={this.onClickScoreHistory}
                        onClickPlayGame={this.onClickPlayGame}
                      />
                    ) : (
                      <></>
                    )}
                    {this.state["score_page"]["displayPage"] ? (
                      <ScorePage
                        onClickScoreHistory={this.onClickScoreHistory}
                        walletAddress={this.state["header"]["walletAddress"]}
                        chat={this.state['game']}
                      />
                    ) : (
                      <></>
                    )}
                    {this.state["score_history"]["displayPage"] ? (
                      <ScoreHistory 
                        walletAddress={this.state["header"]["walletAddress"]}
                      />
                    ) : (
                      <></>
                    )}
                    {this.state["play_game"]["displayPage"] ? (
                      <PlayGame 
                        state = {this.state}
                      />
                    ) : (
                      <></>
                    )}
                  </ClickContext.Provider>
                </div>
                <img className="left_image" src={leftImage} />
                <img className="right_image" src={rightImage} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
