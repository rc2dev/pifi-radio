import React from 'react';
import { withTranslation } from 'react-i18next';

const PlayerStatus = ({ playerStatus, t }) => {
  const { playing, title } = playerStatus;

  return (
    <div className="text-center">
      <h5 className="small text-uppercase">
        {playing ? t('playing') : t('stopped')}
      </h5>
      <h3 className="ellipsis">{title}</h3>
    </div>
  );
};

export default withTranslation()(PlayerStatus);
