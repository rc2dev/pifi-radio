import axios from 'axios';

axios.interceptors.response.use(null, error => {
  console.log(error);
  // alert
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post
};
