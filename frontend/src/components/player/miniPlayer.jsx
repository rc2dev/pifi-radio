import React from 'react';
import PlayStopControl from './playStopControl';
import './miniPlayer.scss';

const MiniPlayer = ({ playerStatus }) => {
  const { title, playing } = playerStatus;

  return (
    <div className="mini-player p-2">
      <div className="mini-player__left mr-2 ellipsis">
        <span>{title}</span>
      </div>
      <div
        className="mini-player__right ml-2"
        onClick={e => e.stopPropagation()}
      >
        <PlayStopControl playing={playing} />
      </div>
    </div>
  );
};

export default MiniPlayer;
