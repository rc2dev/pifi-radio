import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Translation } from 'react-i18next';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  // Some errors cause our app to only render a backdrop warning.
  // Queuing toasts would be redundant.
  const hasToastify = document.querySelector('.Toastify');

  if (hasToastify) {
    if (!expectedError)
      toast.error(<Translation>{t => t('errorUnexpected')}</Translation>);

    // Universal expected error
    if (error.response && error.response.status === 403)
      toast.error(<Translation>{t => t('errorForbidden')}</Translation>);
  }

  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post
};
