import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  return (
    <div className={title ? 'p-2 backdrop backdrop--visible' : 'p-2 backdrop'}>
      <h3>{title}</h3>
      <h5>{body}</h5>
    </div>
  );
};

export default Backdrop;
