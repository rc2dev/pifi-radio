import React from 'react';
import './alert.scss';

const Alert = ({ title, body }) => {
  return (
    <div className={title ? 'alert2 alert2--visible' : 'alert2'}>
      <h3 className="ellipsis">{title}</h3>
      <h5>{body}</h5>
    </div>
  );
};

export default Alert;
