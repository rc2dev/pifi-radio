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
  state = { playerStatus: {}, loading: true, alert: {} };

  componentDidMount() {
    setInterval(() => this.updatePlayerStatus(), updateInterval);
  }

  async updatePlayerStatus() {
    const { data: playerStatus } = await getStatus();
    this.setState({ playerStatus, loading: false });
  }

  handleAlert = (title, body = '') => {
    this.setState({ alert: { title, body } });
    setTimeout(() => this.setState({ alert: {} }), alertTimeout);
  };

  render() {
    const { loading, playerStatus, alert } = this.state;
    if (loading) return <Loader />;
    if (!playerStatus.con_mpd) return <Alert title="Disconnected from MPD" />;

    return (
      <React.Fragment>
        <Alert title={alert.title} body={alert.body} />

        <main className="container">
          <Radios onAlert={this.handleAlert} playerStatus={playerStatus} />
        </main>
        <Drawer playerStatus={playerStatus} />
      </React.Fragment>
    );
  }
}

export default App;
