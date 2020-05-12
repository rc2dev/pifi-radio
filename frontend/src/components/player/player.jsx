import React from 'react';
import PlayerStatus from './playerStatus';
import PlayerControls from './playerControls';
import './player.scss';

const Player = ({ playerStatus }) => {
  const renderLogo = () => (
    <img
      src={require('../../assets/logo.svg')}
      alt="Logo"
      className="player-logo m-4"
    />
  );

  return (
    <div className="player">
      <PlayerStatus playerStatus={playerStatus} />
      {renderLogo()}
      <PlayerControls playerStatus={playerStatus} />
    </div>
  );
};

export default Player;
