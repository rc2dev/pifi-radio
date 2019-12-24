import http from './httpService';
import { apiUrl } from '../config.json';

export function getStreams() {
  return http.get(`${apiUrl}/streams`);
}
