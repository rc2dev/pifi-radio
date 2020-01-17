import http from './httpService';

const apiEndpoint = '/streams';

export function getStreams() {
  return http.get(apiEndpoint);
}
