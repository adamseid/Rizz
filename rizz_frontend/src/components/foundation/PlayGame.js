import React, { Component } from 'react'
import "../../App.css"
import Home from "../../images/homebutton1.png"
import Download from "../../images/downloadbuttonrizz1.png"
import Reset from "../../images/resetbutton1.png"
import Leaderboard from "../../images/leaderboardbutton1.png"
import UserImage from "../../images/user.png"
import AiImage from "../../images/girldog.png"
import AiImageLoader from "../../images/01.png"
import PlayGameContainer from "./PlayGameContainer";

const openers = [
  "I honestly can't be bothered. You have something you want to say?",
  "Heyyy 🙂",
  "I'm not in the mood today . . . what the fuck do you want?"
];

export default class PlayGame extends Component {
  

  constructor(props) {
		super(props);
	} 
  ws = new WebSocket(process.env.REACT_APP_.BACKEND_BASE_URL_WEBSOCKET + 'main' + '/');
  // ws = new WebSocket('wss://wstest.rizzinu.app/ws/' + 'main' + '/');

  componentDidMount = () => {
    document.getElementById('search-text').focus();
    this.props.state["game"] = [{
      id : "ai",
      message: openers[Math.floor(Math.random() * (3) )],
    }]
    this.setPropsState()
    this.ws.onopen = () => {
      console.log("connected")
      this.ws.send(
          JSON.stringify({
              request: "connect",
              walletAddress: this.props.state['header']['walletAddress']
          })
      )
    }
  }

  handleText = (event) => {
    this.props.state['play_game']['most_recent_text'] = event.target.value
  }

  setPropsState = () => {
    document.getElementById('search-text').focus();
    this.setState(this.props.state)
  }

  handleSubmit = (event) => {
    document.getElementById("loading-container").style.display = "flex"
    document.getElementById("search-text").disabled = true; 
    document.getElementById('search-text').focus();

    event.preventDefault();
    console.log(this.props.state['play_game'])
    var currentMessage = 
    {
      id : "user",
      message: this.props.state['play_game']['most_recent_text'],
    }
    var allMessages = [...this.props.state["game"], currentMessage];
    this.props.state["game"] = allMessages
    this.setPropsState()
    if(this.ws.readyState){
      this.ws.send(
        JSON.stringify({
            request: "chat",
            message: this.props.state['play_game']['most_recent_text'],
        })
      )
    }

    this.ws.onmessage = (e) => {
      document.getElementById("loading-container").style.display = "none"
      document.getElementById("search-text").disabled = false; 
      var currentMessage = 
      {
        id : "ai",
        message: e.data
      }
      var allMessages = [...this.props.state["game"], currentMessage]
      this.props.state["game"] = allMessages
      this.setPropsState()
      document.getElementById('search-text').focus();
    }
    document.getElementById("search-text").value = ""
    document.getElementById('search-text').focus();
  }
  
  onReset = () => {
    this.props.state["game"] = [{id : "ai",message: openers[Math.floor(Math.random() * (3) )]}]
    this.props.state['reset']['isTrue'] = true
    this.setPropsState()
  }

  handleCallback = (childData) =>{
    document.getElementById('search-text').focus();
    this.props.state['reset']['isTrue'] = childData
    this.props.state["game"] = [{
      id : "ai",
      message: openers[Math.floor(Math.random() * (3) )],
    }]
    this.setPropsState()
  } 

  render() {
    return (
      <div className="container play_game">
        <PlayGameContainer
          walletAddress={this.props.state['header']['walletAddress']}
          chat={this.props.state['game']}
          isReset={this.props.state['reset']['isTrue']}
          parentCallback = {this.handleCallback}
        />
        <div className='modal_container' id="text_modal_container">
          <div className='modal_chat'>
            <div className='chat_container' id='style-1'>
              <div className='chat-wrapper'>
                {this.props.state["game"].map((messages, index) => {
                  return (
                    messages['id'] == "ai" ? (
                      <div key={index} className='ai-container'>
                        <div className='image-container'>
                          <img src={AiImage} className='ai-image-small' />
                        </div>
                        <div className='ai-text-container'>
                          {messages['message']}
                        </div>
                      </div>
                    ) : (
                      <div key={index} className='user-container'>
                        <div className='text-container'>
                          {messages['message']}
                        </div>
                        <div className='image-container'>
                          <img src={UserImage} className='user-image' />
                          <div className='user-identifier'>
                            You
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
                <div className='loading-container' id='loading-container'>
                  <div className="stage">
                    <div className="dot-pulse"></div>
                  </div>
                  <div className='ai-image small'>
                    <img src={AiImageLoader} className='ai-image-loader' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <form onSubmit={this.handleSubmit} className = "form_container" autoComplete="off" >
            <input className='modal_submit' type="text" onChange={this.handleText} id="search-text" name="search-text" placeholder='Message Aiyesha' />
            <input type="submit" id = "submit" value="" className='search' />
          </form>
        </div>
        <div className='reset_container' id="reset_modal_container">
          <div className='reset_inner_container'>
            <div className='reset_title'>
              Restart Rizz?
            </div>
            <div className='reset_text'>
              Your progress from this rizz session will be lost
            </div>
            <div className='reset_button' onClick={this.onReset}>
              Restart Session
            </div>
          </div>
        </div>
      </div>
    )
  }
}
