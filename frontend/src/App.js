import React, { Component } from 'react';
import Player from './components/player';
import Radios from './components/radios';
import Drawer from './components/drawer';
import Loader from './components/loader';
import Alert from './components/alert';
import { getStatus } from './services/playerService';
import { updateInterval, alertTimeout } from './config.json';
import './App.css';

// d-none d-md-block
class App extends Component {
  state = { playerStatus: {}, loading: true, networkError: false, alert: {} };

  componentDidMount() {
    // Runs earlier than the one by setInterval
    this.updatePlayerStatus();
    setInterval(() => this.updatePlayerStatus(), updateInterval);
  }

  async updatePlayerStatus() {
    try {
      const { data: playerStatus } = await getStatus();
      this.setState({ playerStatus, loading: false, networkError: false });
    } catch (ex) {
      this.setState({ networkError: true });
    }
  }

  handleAlert = (title, body = '') => {
    this.setState({ alert: { title, body } });
    setTimeout(() => this.setState({ alert: {} }), alertTimeout);
  };

  render() {
    const { loading, networkError, alert, playerStatus } = this.state;

    if (networkError) return <Alert title="No connection to PiFi server" />;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Alert title="Disconnected from MPD" />;

    return (
      <div className="app">
        <Alert title={alert.title} body={alert.body} />

        <main className="app-main">
          <Player playerStatus={playerStatus} />
          <Radios onAlert={this.handleAlert} playerStatus={playerStatus} />
        </main>
        <Drawer playerStatus={playerStatus} />
      </div>
    );
  }
}

export default App;
