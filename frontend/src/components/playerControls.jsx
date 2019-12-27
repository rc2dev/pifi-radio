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

    const toastId = 'vol';
    const toastMsg = `${t('volume')}: ${vol}%`;
    const toastOpts = { toastId, autoClose: volTimeout };
    if (toast.isActive(toastId)) toast.update(toastId, { render: toastMsg });
    else toast.info(toastMsg, toastOpts);
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
