import React from 'react';
import Modal from './common/modal';
import { getThemeId, changeTheme, themes } from '../theme';
import i18next from 'i18next';
import { withTranslation } from 'react-i18next';
import { languages } from '../config.json';
import Select from './common/select';

const Settings = ({ t }) => {
  const renderFooter = () => (
    <button className="btn btn-secondary" data-dismiss="modal">
      {t('close')}
    </button>
  );

  return (
    <Modal id="settings" title={t('settings')} footer={renderFooter()}>
      <Select
        id="theme-select"
        label={t('theme')}
        data={themes}
        row
        value={getThemeId()}
        onChange={e => {
          changeTheme(e.target.value);
        }}
      />
      <Select
        id="language-select"
        label={t('language')}
        data={languages}
        row
        value={i18next.language}
        onChange={e => {
          i18next.changeLanguage(e.target.value);
        }}
      />
      <hr className="mt-5" />
      <p className="small">
        Copyright &copy; 2017-2019&nbsp;
        <a
          href="https://rafaelc.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rafael Cavalcanti
        </a>
      </p>
    </Modal>
  );
};

export default withTranslation()(Settings);
