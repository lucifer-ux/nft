import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class MuteButton extends Component {

  render() {
    if (this.props.isMuted === true) {
      return (
        <div onClick={this.props._toggleMuteButton}>
          <FontAwesomeIcon icon="volume-up" size="3x" />
        </div>
      )
    }
    return ( 
      <div onClick={this.props._toggleMuteButton}>
        <FontAwesomeIcon icon="volume-mute" size="3x" />
      </div>
    )
  }
}

export default MuteButton;