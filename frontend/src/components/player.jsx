import React from 'react';
import PlayerStatus from './playerStatus';
import PlayerControls from './playerControls';
import './player.scss';

const Player = ({ playerStatus }) => {
  return (
    <div className="player p-2">
      <PlayerStatus playerStatus={playerStatus} />
      <PlayerControls playerStatus={playerStatus} />
    </div>
  );
};

export default Player;
