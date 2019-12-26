import React from 'react';
import Control from './control';
import PlayStopControl from './playStopControl';
import { vol_up, vol_down } from '../services/playerService';
import './playerControls.scss';

const PlayerControls = ({ playerStatus }) => {
  const volDisabled = playerStatus.vol < 0;

  return (
    <div className="player-controls">
      <div className="btn-group">
        <Control
          icon="fas fa-volume-down"
          disabled={volDisabled}
          onClick={vol_down}
        />
        <Control
          icon="fas fa-volume-up"
          disabled={volDisabled}
          onClick={vol_up}
        />
        <PlayStopControl playing={playerStatus.playing} />
      </div>
    </div>
  );
};

export default PlayerControls;
