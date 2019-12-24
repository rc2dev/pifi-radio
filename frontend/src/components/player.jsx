import React from 'react';
import PlayerStatus from './playerStatus';
import PlayerControls from './playerControls';
import DownArrow from './common/downArrow';
import './player.scss';

const Player = ({ playerStatus }) => {
  return (
    <div className="player p-4">
      <DownArrow />
      <PlayerStatus playerStatus={playerStatus} />
      <PlayerControls playerStatus={playerStatus} />
    </div>
  );
};

export default Player;
