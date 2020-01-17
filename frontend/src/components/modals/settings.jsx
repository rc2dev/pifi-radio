import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../common/modal';
import Select from '../common/select';
import theme from '../../theme';
import { languages } from '../../config.json';

const Settings = () => {
  const { t, i18n } = useTranslation();

  const [themeId, setThemeId] = useState('');

  useEffect(() => {
    setThemeId(theme.getCurrentId());
  }, []);

  const handleThemeChange = ({ target }) => {
    const newThemeId = target.value;
    theme.change(newThemeId);
    setThemeId(newThemeId);
  };

  return (
    <Modal id="settings" title={t('settings')}>
      <Select
        id="theme-select"
        label={t('theme')}
        data={theme.availableThemes}
        row
        value={themeId}
        onChange={e => handleThemeChange(e)}
      />
      <Select
        id="language-select"
        label={t('language')}
        data={languages}
        row
        value={i18n.language}
        onChange={e => i18n.changeLanguage(e.target.value)}
      />
    </Modal>
  );
};

export default Settings;
