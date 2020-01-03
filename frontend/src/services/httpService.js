import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Translation } from 'react-i18next';

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // Some errors cause our app to only render a backdrop warning.
  // Queuing toasts would be redundant.
  const hasToastify = document.querySelector('.Toastify');

  // The translation is ugly, but 18n only worked this way
  if (hasToastify) {
    if (!expectedError) {
      toast.error(
        <Translation>{t => <p>{t('errorUnexpected')}</p>}</Translation>
      );
    }

    // Universal expected error
    if (error.response && error.response.status === 403)
      toast.error(
        <Translation>{t => <p>{t('errorForbidden')}</p>}</Translation>
      );
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post
};
