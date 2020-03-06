import React from 'react';
import { useTranslation } from 'react-i18next';

const PlayerStatus = ({ playerStatus }) => {
  const { playing, title } = playerStatus;

  const { t } = useTranslation();

  return (
    <div className="text-center w-100">
      <h5 className="small text-uppercase">
        {playing ? t('playing') : t('stopped')}
      </h5>
      <h3 className="ellipsis">{title}</h3>
    </div>
  );
};

export default PlayerStatus;
