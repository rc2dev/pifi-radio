import React, { Component } from 'react';
import MiniPlayer from './miniPlayer';
import Player from './player';
import './drawer.scss';

class Drawer extends Component {
  state = { open: false };

  handleToggle = ({ target }) => {
    const blackList =
      (target.tagName === 'BUTTON' || target.tagName === 'I') &&
      !target.className.includes('drawer__toggler');
    if (blackList) return;

    this.setState({ open: !this.state.open });
  };

  render() {
    const { playerStatus } = this.props;
    const classes =
      'drawer fixed-bottom bg-dark text-white' +
      (this.state.open ? ' drawer--open' : '');

    return (
      <div className={classes} onClick={this.handleToggle}>
        {this.state.open ? (
          <React.Fragment>
            <i className="drawer__toggler fas fa-chevron-down fa-lg p-3" />
            <Player playerStatus={playerStatus} />{' '}
          </React.Fragment>
        ) : (
          <MiniPlayer playerStatus={playerStatus} />
        )}
      </div>
    );
  }
}

export default Drawer;
