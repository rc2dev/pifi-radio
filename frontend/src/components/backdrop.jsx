import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  return (
    <div className={title ? 'backdrop backdrop--visible' : 'backdrop'}>
      <h3 className="ellipsis">{title}</h3>
      <h5>{body}</h5>
    </div>
  );
};

export default Backdrop;
