import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import { play, stop } from '../services/playerService';

const PlayStopControl = ({ playing }) =>
  playing ? (
    <button className="btn btn-danger" onClick={stop}>
      <FontAwesomeIcon icon={faStop} />
    </button>
  ) : (
    <button className="btn btn-dark" onClick={play}>
      <FontAwesomeIcon icon={faPlay} />
    </button>
  );

export default PlayStopControl;
