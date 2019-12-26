import React from 'react';
import { withTranslation } from 'react-i18next';

const SearchBox = ({ value, onChange, t }) => {
  return (
    <input
      className="form-control mb-4"
      type="text"
      id="query"
      placeholder={t('search')}
      autoComplete="off"
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => onChange('')}
    ></input>
  );
};

export default withTranslation()(SearchBox);
