import React, { Component } from 'react';
import MiniPlayer from './miniPlayer';
import Player from './player';
import './drawer.scss';
import DownArrow from './common/downArrow';

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
          <React.Fragment>
            <DownArrow />
            <Player playerStatus={playerStatus} />
          </React.Fragment>
        ) : (
          <MiniPlayer playerStatus={playerStatus} />
        )}
      </div>
    );
  }
}

export default Drawer;
