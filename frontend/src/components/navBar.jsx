import React from 'react';
import { withTranslation } from 'react-i18next';
import './navBar.scss';

const NavBar = ({ t, onToggleURLDialog }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="/">
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
      </div>
    </div>
  </nav>
);
export default withTranslation()(NavBar);
