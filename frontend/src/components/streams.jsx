import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Loader from './common/loader';
import SearchBox from './common/searchBox';
import { playRadio } from '../services/playerService';
import { getStreams } from '../services/streamsService';
import './streams.scss';

class Streams extends Component {
  state = { streams: {}, loading: true, query: '' };

  async componentDidMount() {
    const { data: streams } = await getStreams();
    this.setState({ streams, loading: false });
  }

  isPlaying = name => {
    return (
      name === this.props.playerStatus.title && this.props.playerStatus.playing
    );
  };

  handleItemClick = async name => {
    const { t, onBackdrop } = this.props;

    if (this.isPlaying(name)) return;

    onBackdrop(t('tuning'), name);
    try {
      await playRadio(name);
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error(t('errorNotFound'));
    }
  };

  getItemClasses = name => {
    const classes = 'streams__item ellipsis list-group-item ';
    return this.isPlaying(name)
      ? classes + 'active'
      : classes + 'list-group-item-action';
  };

  handleSearch = query => {
    this.setState({ query });
  };

  filteredStreams() {
    const { streams, query } = this.state;

    if (query === '') return streams;

    let filtered = {};
    for (let k in streams) {
      if (k.toLowerCase().includes(query.toLowerCase()) && !streams[k]) {
        filtered[k] = streams[k];
      }
    }
    return filtered;
  }

  renderList() {
    const streams = this.filteredStreams();

    if (Object.keys(streams).length === 0)
      return <h4 className="p-4">{this.props.t('noStreams')}</h4>;

    return (
      <ul className="list-group list-group-flush">
        {Object.keys(streams).map(name =>
          streams[name] ? (
            <li className="streams__header ellipsis" key={name}>
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
    if (this.state.loading) return <Loader />;

    return (
      <div className="streams">
        <SearchBox value={this.state.query} onChange={this.handleSearch} />
        {this.renderList()}
      </div>
    );
  }
}

export default withTranslation()(Streams);
