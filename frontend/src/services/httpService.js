import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Translation } from 'react-i18next';

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // We already alert about these with a backdrop on App.js
  const networkError = !error.response;

  // Ugly, but i18n only worked this way
  if (!expectedError && !networkError) {
    toast.error(
      <Translation>
        {(t, { i18n }) => <p>{t('errorUnexpected')}</p>}
      </Translation>
    );
  }
  // This expected error is universal in our app, so we'll place it here
  if (error.response && error.response.status === 403)
    toast.error(
      <Translation>{(t, { i18n }) => <p>{t('errorForbidden')}</p>}</Translation>
    );

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post
};
