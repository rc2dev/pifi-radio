import React, { Component } from 'react';
import { playRadio } from '../services/playerService';
import { getStreams } from '../services/streamsService';
import { withTranslation } from 'react-i18next';
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
    this.props.onAlert(this.props.t('tunning'), name);
    playRadio(name);
  };

  getItemClasses = name => {
    const classes = 'radios__item ellipsis list-group-item';
    return this.isPlaying(name) ? classes + ' active' : classes;
  };

  renderList() {
    const { streams } = this.state;

    if (Object.keys(streams).length === 0)
      return <h4 className="p-4">{this.props.t('noStreams')}</h4>;

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
    return <div className="radios p-4">{this.renderList()}</div>;
  }
}

export default withTranslation()(Radios);
