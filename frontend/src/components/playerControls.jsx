import React from 'react';
import PlayStopControl from './playStopControl';
import { changeVol } from '../services/playerService';
import { toast } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import './playerControls.scss';
import { volTimeout } from '../config.json';

const PlayerControls = ({ playerStatus, t }) => {
  const volDisabled = playerStatus.vol < 0;

  const handleVolChange = async delta => {
    const { data: vol } = await changeVol(delta);
    toast.info(`${t('volume')}: ${vol}%`, { autoClose: volTimeout });
  };

  const renderVolButton = (delta, icon) => (
    <button
      className="btn btn-dark p-3"
      disabled={volDisabled}
      onClick={() => handleVolChange(delta)}
    >
      <i className={'fas ' + icon} />
    </button>
  );

  return (
    <div className="player-controls btn-group w-100">
      {renderVolButton('-5', 'fa-volume-down')}
      {renderVolButton('+5', 'fa-volume-up')}
      <PlayStopControl playing={playerStatus.playing} />
    </div>
  );
};

export default withTranslation()(PlayerControls);
