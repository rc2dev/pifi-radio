import React from 'react';
import { play, stop } from '../services/playerService';

const PlayStopControl = ({ playing }) =>
  playing ? (
    <button className="btn btn-danger" onClick={stop}>
      <i className="fas fa-stop" />
    </button>
  ) : (
    <button className="btn btn-secondary" onClick={play}>
      <i className="fas fa-play" />
    </button>
  );

export default PlayStopControl;
