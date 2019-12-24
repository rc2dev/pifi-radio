import React, { Component } from 'react';

class PlayerStatus extends Component {
  render() {
    const { playing, title } = this.props.playerStatus;
    return (
      <div className="text-center">
        <h5 className="small">{playing ? 'PLAYING' : 'STOPPED'}</h5>
        <h4>{title}</h4>
      </div>
    );
  }
}

export default PlayerStatus;
