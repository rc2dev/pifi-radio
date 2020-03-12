import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ISO6391 from 'iso-639-1';
import localeEmoji from 'locale-emoji';
import Modal from '../common/modal';
import Select from '../common/select';
import theme from '../../theme';
import { languages } from '../../config.json';

const Settings = () => {
  const { t, i18n } = useTranslation();

  const [themeId, setThemeId] = useState('');

  const languagesData = languages.sort().map(lang => {
    const isoCode = lang.slice(0, 2);
    return {
      id: lang,
      name: `${localeEmoji(lang)} ${ISO6391.getNativeName(isoCode)}`
    };
  });

  const handleThemeChange = ({ target }) => {
    const newThemeId = target.value;
    theme.change(newThemeId);
    setThemeId(newThemeId);
  };

  useEffect(() => {
    setThemeId(theme.getCurrentId());
  }, []);

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
        data={languagesData}
        row
        value={i18n.language}
        onChange={e => i18n.changeLanguage(e.target.value)}
      />
    </Modal>
  );
};

export default Settings;
