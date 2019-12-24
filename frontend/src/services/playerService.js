import http from './httpService.js';
import { apiUrl } from '../config.json';

const apiEndpoint = `${apiUrl}/player`;

function body(method, params = null) {
  const body = new FormData();
  body.set('method', method);
  if (params) body.set('params', params);
  return body;
}

export function getStatus() {
  return http.get(apiEndpoint);
}

export function play() {
  return http.post(apiEndpoint, body('play'));
}

export function stop() {
  return http.post(apiEndpoint, body('stop'));
}

export function vol_up() {
  return http.post(apiEndpoint, body('change_vol', '+5'));
}

export function vol_down() {
  return http.post(apiEndpoint, body('change_vol', '-5'));
}

export function playRadio(name) {
  return http.post(apiEndpoint, body('play_radios', name));
}
