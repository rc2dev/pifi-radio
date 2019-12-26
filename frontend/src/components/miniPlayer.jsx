import React, { Component } from 'react';
import PlayStopControl from './playStopControl';
import './miniPlayer.scss';

class MiniPlayer extends Component {
  render() {
    const { title, playing } = this.props.playerStatus;
    return (
      <div class="miniplayer p-3">
        <div class="miniplayer__left ellipsis">
          <i className="fas fa-bars fa-lg my-2 mr-3" />
          <span className={playing ? '' : 'text-muted font-italic'}>
            {title}
          </span>
        </div>
        <PlayStopControl playing={playing} small="true" />
      </div>
    );
  }
}

export default MiniPlayer;
