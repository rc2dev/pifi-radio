import React from 'react';
import Modal from './common/modal';
import { getTheme, changeTheme, themes } from '../theme';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { languages } from '../config.json';

const Settings = ({ t }) => {
  const renderFooter = () => (
    <button className="btn btn-secondary" data-dismiss="modal">
      Close
    </button>
  );

  const renderLanguage = () => (
    <div className="form-group row">
      <label htmlFor="language-selector" className="col-sm-2 col-form-label">
        {`${t('language')}:`}
      </label>
      <div className="col-sm-10">
        <select
          id="language-selector"
          className="form-control"
          value={i18next.language}
          onChange={e => {
            i18next.changeLanguage(e.target.value);
          }}
        >
          {languages.map(lang => (
            <option key={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderTheme = () => (
    <div className="form-group row">
      <label htmlFor="theme-selector" className="col-sm-2 col-form-label">
        {`${t('theme')}:`}
      </label>
      <div className="col-sm-10">
        <select
          id="theme-selector"
          className="form-control"
          value={getTheme()}
          onChange={e => {
            changeTheme(e.target.value);
          }}
        >
          {themes.map(theme => (
            <option key={theme}>{theme}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <Modal id="settings" title={t('settings')} footer={renderFooter()}>
      {renderLanguage()}
      {renderTheme()}
    </Modal>
  );
};

export default withTranslation()(Settings);
