import React, { Component } from 'react';
import Control from './control';
import { play, stop } from '../services/playerService';

class PlayStopControl extends Component {
  render() {
    const { playing, small } = this.props;
    return (
      <Control
        icon={playing ? 'fas fa-stop' : 'fas fa-play'}
        onClick={() => {
          playing ? stop() : play();
        }}
        background={playing ? 'btn-danger' : 'btn-secondary'}
        small={small}
      />
    );
  }
}
export default PlayStopControl;
