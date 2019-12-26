import http from './httpService';

const apiEndpoint = `${process.env.REACT_APP_API_URL}/streams`;

export function getStreams() {
  return http.get(apiEndpoint);
}
