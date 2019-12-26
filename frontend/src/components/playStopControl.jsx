import React from 'react';
import Control from './control';
import { play, stop } from '../services/playerService';

const PlayStopControl = ({ playing, small }) => {
  return (
    <Control
      icon={playing ? 'fas fa-stop' : 'fas fa-play'}
      onClick={() => {
        playing ? stop() : play();
      }}
      background={playing ? 'btn-danger' : 'btn-secondary'}
      small={small}
    />
  );
};

export default PlayStopControl;
