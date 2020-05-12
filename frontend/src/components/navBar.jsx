import React from 'react';
import { useTranslation } from 'react-i18next';
import './navBar.scss';
import logo from '../assets/logo.svg';

const NavBar = () => {
  const { t } = useTranslation();

  return (
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
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav pt-1 ml-2">
            {/* We use buttons and different class names instead of Bootstrap's
             anchor, so we don't get a warning for href="#". */}
            <button
              className="btn btn-link nav-link"
              data-toggle="modal"
              data-target="#url-dialog"
            >
              {t('playURL')}
            </button>

            <button
              className="btn btn-link nav-link"
              data-toggle="modal"
              data-target="#settings"
            >
              {t('settings')}
            </button>

            <button
              className="btn btn-link nav-link"
              data-toggle="modal"
              data-target="#about"
            >
              {t('about')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
