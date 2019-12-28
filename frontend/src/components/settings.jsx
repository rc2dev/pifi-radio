import React from 'react';
import Modal from './common/modal';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { languages } from '../config.json';

const Settings = ({ t }) => {
  const renderFooter = () => (
    <button className="btn btn-secondary" data-dismiss="modal">
      Close
    </button>
  );

  return (
    <Modal id="settings" title={t('settings')} footer={renderFooter()}>
      <div className="form-group row">
        <label htmlFor="inputState" className="col-sm-2 col-form-label">
          {`${t('language')}:`}
        </label>
        <div className="col-sm-10">
          <select
            id="inputState"
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
    </Modal>
  );
};

export default withTranslation()(Settings);
