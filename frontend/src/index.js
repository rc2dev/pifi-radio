import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Loader from './components/loader';
import './i18n';
import './index.scss';

// Bootstrap
//import 'bootstrap/dist/css/bootstrap.css';
import 'bootswatch/dist/darkly/bootstrap.min.css'; // This replaces default Bootstrap file
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.js';

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
