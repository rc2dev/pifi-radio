import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { play, stop } from '../../services/playerService';

const PlayStopControl = ({ playing }) =>
  playing ? (
    <button className="btn btn-danger" onClick={stop} aria-label="Stop">
      <FontAwesomeIcon icon={faStop} />
    </button>
  ) : (
    <button className="btn btn-dark" onClick={play} aria-label="Play">
      <FontAwesomeIcon icon={faPlay} />
    </button>
  );

export default PlayStopControl;
