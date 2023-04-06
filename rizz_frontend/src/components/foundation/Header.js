import React, { Component } from 'react'

export default class Header extends Component {

  render() {
    return (
        <div className='header-container'>
          <div className='connect-button header'>
            {
              this.props.state['header']['walletAddress'] == "Wallet ID" ? (
                this.props.state['header']['walletAddress']
              ) : 
              this.props.state['header']['walletAddress'].substring(0, 6) + "..." +  this.props.state['header']['walletAddress'].substring(38, 42)
            }
          </div>
        </div>
    )
  }
}
