import React, { Component } from 'react';
import MiniPlayer from './miniPlayer';
import Player from './player';
import './drawer.scss';

class Drawer extends Component {
  state = { open: false };

  getClassNames() {
    return (
      'drawer fixed-bottom bg-dark text-white' +
      (this.state.open ? ' drawer--open' : '')
    );
  }

  handleToggle = ({ target }) => {
    if (target.tagName === 'BUTTON') return;
    this.setState({ open: !this.state.open });
  };

  render() {
    const { playerStatus } = this.props;

    return (
      <div className={this.getClassNames()} onClick={this.handleToggle}>
        {this.state.open ? (
          <Player playerStatus={playerStatus} />
        ) : (
          <MiniPlayer playerStatus={playerStatus} />
        )}
      </div>
    );
  }
}

export default Drawer;
