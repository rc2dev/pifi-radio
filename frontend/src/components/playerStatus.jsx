import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class PlayerStatus extends Component {
  render() {
    const { playing, title } = this.props.playerStatus;
    const { t } = this.props;
    return (
      <div className="text-center mt-4">
        <h5 className="small">{playing ? t("playing") : t("stopped")}</h5>
        <h3 className="ellipsis">{title}</h3>
      </div>
    );
  }
}

export default withTranslation()(PlayerStatus);
