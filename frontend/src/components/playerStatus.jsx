import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class PlayerStatus extends Component {
  render() {
    const { playing, title } = this.props.playerStatus;
    const { t } = this.props;

    let classes = playing
      ? 'text-center mt-4'
      : 'text-center mt-4 text-muted font-italic';

    return (
      <div className={classes}>
        <h5 className="small text-uppercase">
          {playing ? t('playing') : t('stopped')}
        </h5>
        <h3 className="ellipsis">{title}</h3>
      </div>
    );
  }
}

export default withTranslation()(PlayerStatus);
