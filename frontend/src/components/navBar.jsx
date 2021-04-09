import React from 'react';
import { useTranslation } from 'react-i18next';
import Settings from './modals/settings';
import URLDialog from './modals/urlDialog';
import About from './modals/about';
import './navBar.scss';
import logo from '../assets/logo.svg';
const bootstrap = require('bootstrap');

const NavBar = () => {
  const { t } = useTranslation();

  const toggleModal = (id) => {
    const modal = new bootstrap.Modal(document.getElementById(id), null);
    modal.toggle();
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-text-bottom mr-2"
              alt=""
            />
            PiFi Radio
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav pt-1 ml-2">
              {/* We use buttons and different class names instead of Bootstrap's
             anchor, so we don't get a warning for href="#". */}
              <button
                className="btn btn-link nav-link"
                onClick={() => toggleModal('url-dialog')}
              >
                {t('playURL')}
              </button>
              <button
                className="btn btn-link nav-link"
                onClick={() => toggleModal('settings')}
              >
                {t('settings')}
              </button>
              <button
                className="btn btn-link nav-link"
                onClick={() => toggleModal('about')}
              >
                {t('about')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <URLDialog />
      <Settings />
      <About />
    </>
  );
};
export default NavBar;
