import React from 'react';
import Control from './control';
import PlayStopControl from './playStopControl';
import { changeVol } from '../services/playerService';
import './playerControls.scss';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import { volTimeout } from '../config.json';

const PlayerControls = ({ playerStatus, t }) => {
  const volDisabled = playerStatus.vol < 0;

  const handleVolChange = async delta => {
    const { data: vol } = await changeVol(delta);
    toast.info(`${t('volume')}: ${vol}%`, { autoClose: volTimeout });
  };

  return (
    <div className="player-controls">
      <div className="btn-group w-100">
        <Control
          icon="fas fa-volume-down"
          disabled={volDisabled}
          onClick={() => handleVolChange('-5')}
        />
        <Control
          icon="fas fa-volume-up"
          disabled={volDisabled}
          onClick={() => handleVolChange('+5')}
        />
        <PlayStopControl playing={playerStatus.playing} />
      </div>
    </div>
  );
};

export default withTranslation()(PlayerControls);
