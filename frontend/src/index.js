import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Loader from './components/common/loader';
import * as serviceWorker from './serviceWorker';
import './i18n';
import theme from './theme';
import './index.scss';
// Bootstrap dependencies
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.js';

theme.apply();

ReactDOM.render(
  // Suspense needed for i18n
  <Suspense fallback={<Loader />}>
    <App />
  </Suspense>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
