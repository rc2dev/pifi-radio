import React, { Component } from 'react';
import { vol_up, vol_down } from '../services/playerService';
import Control from './control';
import PlayStopControl from './playStopControl';
import './playerControls.scss';

class PlayerControls extends Component {
  vol_disabled() {
    return this.props.playerStatus.vol < 0;
  }

  render() {
    return (
      <div className="player-controls">
        <div className="btn-group">
          <Control
            icon="fas fa-volume-down"
            disabled={this.vol_disabled()}
            onClick={vol_down}
          />
          <Control
            icon="fas fa-volume-up"
            disabled={this.vol_disabled()}
            onClick={vol_up}
          />
          <PlayStopControl playing={this.props.playerStatus.playing} />
        </div>
      </div>
    );
  }
}

export default PlayerControls;
