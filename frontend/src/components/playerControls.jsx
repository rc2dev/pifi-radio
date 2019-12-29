import React from 'react';
import PlayStopControl from './playStopControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { changeVol } from '../services/playerService';
import { volTimeout } from '../config.json';
import './playerControls.scss';

const PlayerControls = ({ playerStatus }) => {
  const { t } = useTranslation;
  
  const volDisabled = playerStatus.vol < 0;

  const handleVolChange = async delta => {
    const { data: vol } = await changeVol(delta);

    const toastId = 'vol';
    const toastMsg = `${t('volume')}: ${vol}%`;
    const toastOpts = { toastId, autoClose: volTimeout };
    if (toast.isActive(toastId)) toast.update(toastId, { render: toastMsg });
    else toast.info(toastMsg, toastOpts);
  };

  const renderVolButton = (delta, icon, label) => (
    <button
      className="btn btn-dark p-3"
      disabled={volDisabled}
      onClick={() => handleVolChange(delta)}
      aria-label={label}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );

  return (
    <div className="player-controls btn-group w-100">
      {renderVolButton('-5', faVolumeDown, 'Volume down')}
      {renderVolButton('+5', faVolumeUp, 'Volume up')}
      <PlayStopControl playing={playerStatus.playing} />
    </div>
  );
};

export default PlayerControls;
