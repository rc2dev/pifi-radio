import React from 'react';
import PlayStopControl from './playStopControl';
import './miniPlayer.scss';

const MiniPlayer = ({ playerStatus }) => {
  const { title, playing } = playerStatus;

  return (
    <div className="mini-player">
      <div className="mini-player__left ellipsis">
        {title}
      </div>
      <div
        className="mini-player__right"
        onClick={e => e.stopPropagation()}
      >
        <PlayStopControl playing={playing} />
      </div>
    </div>
  );
};

export default MiniPlayer;
