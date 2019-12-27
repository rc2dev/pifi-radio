import http from './httpService.js';

const apiEndpoint = `${process.env.REACT_APP_API_URL}/player`;

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

export function changeVol(delta) {
  return http.post(apiEndpoint, body('change_vol', delta));
}

export function playRadio(name) {
  return http.post(apiEndpoint, body('play_radios', name));
}

export function playURL(url) {
  return http.post(apiEndpoint, body('play_urls', url));
}
