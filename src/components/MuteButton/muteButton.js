import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./MuteButton.css"

class MuteButton extends Component {

  render() {
    if (this.props.isMuted === true) {
      return (
        <div onClick={this.props._toggleMuteButton} className='Volume_container'>
          <FontAwesomeIcon icon="volume-mute" className='icon-icon'/>
        </div>
      )
    }
    return ( 
      <div onClick={this.props._toggleMuteButton} className='Volume_container'>
        <FontAwesomeIcon icon="volume-up"  />
      </div>
    )
  }
}

export default MuteButton;