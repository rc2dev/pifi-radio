import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import NavBar from './components/navBar';
import Player from './components/player/player';
import Streams from './components/streams';
import Drawer from './components/drawer';
import Settings from './components/modals/settings';
import URLDialog from './components/modals/urlDialog';
import About from './components/modals/about';
import Loader from './components/common/loader';
import Backdrop from './components/common/backdrop';
import { getStatus } from './services/playerService';
import { updateInterval, backdropTimeout } from './config.json';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    playerStatus: {},
    loading: true,
    networkError: false,
    backdrop: {}
  };

  componentDidMount() {
    this.updatePlayerStatus();
  }

  componentDidUpdate() {
    this.setDesktopPlayerTop();
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

  // Calculate and set top for Player on desktop view
  setDesktopPlayerTop = () => {
    const nav = document.querySelector('nav');
    const desktopPlayer = document.querySelector('.app-main > .player');
    if (!nav || !desktopPlayer) return;

    const navHeight = nav.clientHeight;
    const topMargin = 24;

    desktopPlayer.style.top = navHeight + topMargin + 'px';
  };

  render() {
    const { loading, networkError, backdrop, playerStatus } = this.state;
    const { t } = this.props;

    if (networkError) return <Backdrop title={t('errorNetwork')} />;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Backdrop title={t('disconnectedMPD')} />;

    return (
      <div className="app">
        <ToastContainer />
        <Backdrop title={backdrop.title} body={backdrop.body} />
        <NavBar />
        <Drawer playerStatus={playerStatus} />

        <main className="app-main p-4">
          <Player playerStatus={playerStatus} />
          <Streams
            onBackdrop={this.handleBackdrop}
            playerStatus={playerStatus}
          />
          <URLDialog />
          <Settings />
          <About />
        </main>
      </div>
    );
  }
}

export default withTranslation()(App);
