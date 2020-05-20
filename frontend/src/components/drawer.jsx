import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import MiniPlayer from './player/miniPlayer';
import Player from './player/player';
import './drawer.scss';

class Drawer extends Component {
  state = { open: false };

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  handleClick = () => {
    this.toggle();
  };

  handleTouchStart = (e) => {
    this.setState({ touchStartY: e.touches[0].clientY });
  };

  handleTouchMove = (e) => {
    const { open, touchStartY } = this.state;
    const touchEndY = e.changedTouches[0].clientY;
    const touchUp = touchEndY < touchStartY;
    const touchDown = touchEndY > touchStartY;

    if (touchDown && open) this.toggle();
    else if (touchUp && !open) this.toggle();
  };

  renderToggleButton = () => (
    <button
      className="drawer__toggler btn btn-primary-outline"
      aria-label="Toggle player"
    >
      <FontAwesomeIcon
        icon={this.state.open ? faChevronDown : faChevronUp}
        className="fa-lg"
      />
    </button>
  );

  render() {
    const { playerStatus } = this.props;
    const { open } = this.state;

    let classes =
      'drawer fixed-bottom bg-secondary shadow-lg p-2';

    if (open) {
      classes += ' drawer--open';
      document.body.classList.add('body--drawer');
    } else document.body.classList.remove('body--drawer');

    return (
      <div
        className={classes}
        onClick={this.handleClick}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
      >
        {this.renderToggleButton()}
        {open ? (
          <Player playerStatus={playerStatus} />
        ) : (
          <MiniPlayer playerStatus={playerStatus} />
        )}
      </div>
    );
  }
}

export default Drawer;
