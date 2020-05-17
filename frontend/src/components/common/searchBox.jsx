import React from 'react';
import { useTranslation } from 'react-i18next';

const SearchBox = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <input
      className="form-control mb-4"
      type="text"
      id="query"
      placeholder={t('search')}
      aria-label={t('search')}
      autoComplete="off"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => onChange('')}
    ></input>
  );
};

export default SearchBox;
