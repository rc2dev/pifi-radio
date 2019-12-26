import axios from 'axios';

axios.interceptors.response.use(null, error => {
  // log
  // alert -- We do that on App.js
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post
};
