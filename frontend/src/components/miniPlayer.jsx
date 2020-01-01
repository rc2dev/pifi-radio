import React from 'react';
import PlayStopControl from './playStopControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import './miniPlayer.scss';

const MiniPlayer = ({ playerStatus }) => {
  const { title, playing } = playerStatus;
  return (
    <div className="mini-player p-3">
      <div className="mini-player__left ellipsis pr-3">
        <FontAwesomeIcon icon={faChevronUp} className="drawer__toggler mr-3" />
        <span>{title}</span>
      </div>
      <div className="mini-player__right" onClick={e => e.stopPropagation()}>
        <PlayStopControl playing={playing} />
      </div>
    </div>
  );
};

export default MiniPlayer;
