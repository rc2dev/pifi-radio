import React, { useEffect } from 'react';
import PlayerStatus from './playerStatus';
import PlayerControls from './playerControls';
import './player.scss';

const Player = ({ playerStatus }) => {
  useEffect(positionPlayerTop);

  return (
    <div className="player">
      <PlayerStatus playerStatus={playerStatus} />
      <PlayerControls playerStatus={playerStatus} />
    </div>
  );
};

// Calculate and set top for Player
// Needed for desktop view with sticky
const positionPlayerTop = () => {
  const navHeight = document.querySelector('nav').clientHeight;
  const topMargin = 24;
  document.querySelector('.player').style.top = navHeight + topMargin + 'px';
};

export default Player;
