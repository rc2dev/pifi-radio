import React, { Component } from 'react';
import PlayStopControl from './playStopControl';
import './miniPlayer.scss';

class MiniPlayer extends Component {
  render() {
    const { title, playing } = this.props.playerStatus;
    return (
      <div className="mini-player p-3">
        <div className="row">
          <div className="col">
            <i className="fas fa-bars fa-lg my-2 mr-3" />
            {title}
          </div>
          <div className="col-3 text-right">
            <PlayStopControl playing={playing} small="true" />
          </div>
        </div>
      </div>
    );
  }
}

export default MiniPlayer;
