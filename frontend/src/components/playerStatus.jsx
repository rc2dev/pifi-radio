import React, { Component } from 'react';

class PlayerStatus extends Component {
  render() {
    const { playing, title } = this.props.playerStatus;
    return (
      <div className="text-center mt-4">
        <h5 className="small">{playing ? 'PLAYING' : 'STOPPED'}</h5>
        <h3 className="ellipsis">{title}</h3>
      </div>
    );
  }
}

export default PlayerStatus;
