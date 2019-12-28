import React from 'react';
import PlayerStatus from './playerStatus';
import PlayerControls from './playerControls';
import './player.scss';

const Player = ({ playerStatus }) => (
  <div className="player p-4">
    <PlayerStatus playerStatus={playerStatus} />
    <PlayerControls playerStatus={playerStatus} />
  </div>
);
export default Player;
