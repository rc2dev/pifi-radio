import React, { Component } from 'react';
import Player from './components/player';
import Streams from './components/streams';
import Drawer from './components/drawer';
import Loader from './components/loader';
import Alert from './components/alert';
import { getStatus } from './services/playerService';
import { withTranslation } from 'react-i18next';
import { updateInterval, alertTimeout } from './config.json';
import './App.css';

// d-none d-md-block
class App extends Component {
  state = { playerStatus: {}, loading: true, networkError: false, alert: {} };

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

  handleAlert = (title, body = '') => {
    this.setState({ alert: { title, body } });
    setTimeout(() => this.setState({ alert: {} }), alertTimeout);
  };

  render() {
    const { loading, networkError, alert, playerStatus } = this.state;
    const { t } = this.props;

    if (networkError) return <Alert title={t('networkError')} />;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Alert title={t('disconnectedMPD')} />;

    return (
      <div className="app">
        <Alert title={alert.title} body={alert.body} />
        <main className="app-main">
          <Player playerStatus={playerStatus} />
          <Streams onAlert={this.handleAlert} playerStatus={playerStatus} />
        </main>
        <Drawer playerStatus={playerStatus} />
      </div>
    );
  }
}

export default withTranslation()(App);
