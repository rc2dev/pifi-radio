import React from 'react';
import PlayStopControl from './playStopControl';
import './miniPlayer.scss';

const MiniPlayer = ({ playerStatus }) => {
  const { title, playing } = playerStatus;
  return (
    <div className="mini-player p-3">
      <div className="mini-player__left ellipsis">
        <i className="fas fa-bars fa-lg my-2 mr-3" />
        <span className={playing ? '' : 'text-muted font-italic'}>{title}</span>
      </div>
      <PlayStopControl playing={playing} small="true" />
    </div>
  );
};

export default MiniPlayer;
