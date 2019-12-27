import React, { Component } from 'react';
import MiniPlayer from './miniPlayer';
import Player from './player';
import './drawer.scss';

class Drawer extends Component {
  state = { open: false };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClick = ({ target }) => {
    const blackList =
      (target.tagName === 'BUTTON' || target.tagName === 'I') &&
      !target.className.includes('drawer__toggler');
    if (blackList) return;

    this.toggle();
  };

  handleTouchStart = e => {
    this.setState({ touchStartY: e.touches[0].clientY });
  };

  handleTouchMove = e => {
    const { open, touchStartY } = this.state;
    const touchEndY = e.changedTouches[0].clientY;
    const touchUp = touchEndY < touchStartY;
    const touchDown = touchEndY > touchStartY;

    if (touchDown && open) this.toggle();
    else if (touchUp && !open) this.toggle();
  };

  render() {
    const { playerStatus } = this.props;
    const classes =
      'drawer fixed-bottom bg-dark text-white' +
      (this.state.open ? ' drawer--open' : '');

    return (
      <div
        className={classes}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
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
