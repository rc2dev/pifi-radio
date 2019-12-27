import React, { Component } from 'react';
import NavBar from './components/navBar';
import Player from './components/player';
import Streams from './components/streams';
import Drawer from './components/drawer';
import Settings from './components/settings';
import URLDialog from './components/urlDialog';
import Loader from './components/loader';
import Backdrop from './components/backdrop';
import { ToastContainer } from 'react-toastify';
import { getStatus } from './services/playerService';
import { withTranslation } from 'react-i18next';
import { updateInterval, backdropTimeout } from './config.json';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

// d-none d-md-block
class App extends Component {
  state = {
    playerStatus: {},
    loading: true,
    networkError: false,
    backdrop: {},
    showURLDialog: false
  };

  componentDidMount() {
    this.updatePlayerStatus();
  }

  async updatePlayerStatus() {
    try {
      const { data: playerStatus } = await getStatus();
      this.setState({ playerStatus, loading: false, networkError: false });
    } catch (ex) {
      this.setState({ loading: false, networkError: true });
    }

    setTimeout(() => this.updatePlayerStatus(), updateInterval);
  }

  handleBackdrop = (title, body = '') => {
    this.setState({ backdrop: { title, body } });
    setTimeout(() => this.setState({ backdrop: {} }), backdropTimeout);
  };

  handleToggleURLDialog = () => {
    this.setState({ showURLDialog: !this.state.showURLDialog });
  };

  render() {
    const {
      loading,
      networkError,
      backdrop,
      playerStatus,
      showURLDialog
    } = this.state;
    const { t } = this.props;

    if (networkError) return <Backdrop title={t('errorNetwork')} />;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Backdrop title={t('disconnectedMPD')} />;

    return (
      <div className="app">
        <Backdrop title={backdrop.title} body={backdrop.body} />
        <ToastContainer />
        <NavBar onToggleURLDialog={this.handleToggleURLDialog} />
        <main className="app-main">
          <Player playerStatus={playerStatus} />
          <Streams
            onBackdrop={this.handleBackdrop}
            playerStatus={playerStatus}
          />
          <Settings />
          <URLDialog
            isOpen={showURLDialog}
            toggle={this.handleToggleURLDialog}
          />
        </main>
        <Drawer playerStatus={playerStatus} />
      </div>
    );
  }
}

export default withTranslation()(App);