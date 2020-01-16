import http from './httpService';

const apiEndpoint = `${process.env.REACT_APP_API_URL}/config`;

export function getConfig() {
  return http.get(apiEndpoint);
}
