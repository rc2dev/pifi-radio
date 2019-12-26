import React, { Component } from 'react';

class Control extends Component {
  getClassNames() {
    return (
      'control ' +
      (this.props.small ? '' : 'py-3 px-4 m-0') +
      ` btn ${this.props.background || 'btn-dark'}`
    );
  }

  render() {
    const { icon, background, onClick, ...rest } = this.props;
    return (
      <button className={this.getClassNames()} onClick={onClick} {...rest}>
        <i className={icon}></i>
      </button>
    );
  }
}

export default Control;
