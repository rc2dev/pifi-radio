import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { withTranslation } from 'react-i18next';
import NavBar from './components/navBar';
import Settings from './components/modals/settings';
import URLDialog from './components/modals/urlDialog';
import About from './components/modals/about';
import Loader from './components/common/loader';
import Backdrop from './components/common/backdrop';
import Main from './components/main';
import { getStatus } from './services/playerService';
import { updateInterval, backdropTimeout } from './config.json';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    playerStatus: {},
    loading: true,
    networkError: false,
    backdrop: {},
  };

  componentDidMount() {
    this.updatePlayerStatus();
  }

  componentDidUpdate() {
    this.setDocumentTitle();
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

  setDocumentTitle = () => {
    const { playerStatus: status, networkError } = this.state;

    if (!networkError && status.playing)
      document.title = 'PiFi 🔊 ' + status.title;
    else document.title = 'PiFi Radio';
  };

  render() {
    const { loading, networkError, backdrop, playerStatus } = this.state;
    const { t } = this.props;

    if (networkError) return <Backdrop title={t('errorNetwork')} />;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Backdrop title={t('disconnectedMPD')} />;

    return (
      <div className="app">
        <ToastContainer pauseOnFocusLoss={false} />
        <Backdrop title={backdrop.title} body={backdrop.body} />
        <NavBar />
        <Main onBackdrop={this.handleBackdrop} playerStatus={playerStatus} />
        <URLDialog />
        <Settings />
        <About />
      </div>
    );
  }
}

export default withTranslation()(App);
