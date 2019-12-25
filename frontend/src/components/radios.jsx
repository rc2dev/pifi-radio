import React, { Component } from 'react';
import { playRadio } from '../services/playerService';
import { getStreams } from '../services/streamsService';
import './radios.scss';

class Radios extends Component {
  state = { streams: {} };

  async componentDidMount() {
    const { data: streams } = await getStreams();
    this.setState({ streams });
  }

  isPlaying = name => {
    return (
      name === this.props.playerStatus.title && this.props.playerStatus.playing
    );
  };

  handleItemClick = name => {
    if (this.isPlaying(name)) return;
    this.props.onAlert('Tunning...', name);
    playRadio(name);
  };

  getItemClasses = name => {
    const classes = 'radios__item ellipsis list-group-item';
    return this.isPlaying(name) ? classes + ' active' : classes;
  };

  renderList() {
    const { streams } = this.state;

    if (!streams) return <h3>No streams available.</h3>;

    return (
      <ul className="list-group list-group-flush list-group-striped">
        {Object.keys(streams).map(name =>
          streams[name] === '' ? (
            <li className="radios__header ellipsis" key={name}>
              {name}
            </li>
          ) : (
            <li
              className={this.getItemClasses(name)}
              key={name}
              onClick={() => this.handleItemClick(name)}
            >
              {name}
            </li>
          )
        )}
      </ul>
    );
  }
  render() {
    return <div className="radios">{this.renderList()}</div>;
  }
}

export default Radios;
