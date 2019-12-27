import React, { Component } from 'react';
import Modal from './common/modal';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { languages } from '../config.json';

class SettingsDialog extends Component {
  handleLanguageChange = ({ target }) => {
    i18next.changeLanguage(target.value);
  };

  render() {
    const { t } = this.props;

    return (
      <Modal id="settings" title={t('settings')}>
        <div className="form-group row">
          <label htmlFor="inputState" className="col-sm-2 col-form-label">
            {`${t('language')}:`}
          </label>
          <div className="col-sm-10">
            <select
              id="inputState"
              className="form-control"
              value={i18next.language}
              onChange={this.handleLanguageChange}
            >
              {languages.map(lang => (
                <option key={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withTranslation()(SettingsDialog);
