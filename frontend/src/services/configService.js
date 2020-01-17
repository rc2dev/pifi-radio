import http from './httpService';

const apiEndpoint = '/config';

export function getConfig() {
  return http.get(apiEndpoint);
}
