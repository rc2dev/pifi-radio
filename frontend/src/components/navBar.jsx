import React from 'react';
import { withTranslation } from 'react-i18next';
import './navBar.scss';

const NavBar = ({ t, onToggleURLDialog }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <a className="navbar-brand" href="#">
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
        <div className="navbar-nav">
          <a className="nav-item nav-link" href="#" onClick={onToggleURLDialog}>
            {t('playURL')}
          </a>
        </div>
        <div className="navbar-nav">
          <a
            className="nav-item nav-link"
            href="#"
            data-toggle="modal"
            data-target="#settings"
          >
            {t('settings')}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default withTranslation()(NavBar);
