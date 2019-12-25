import React from 'react';
import './alert.scss';

const Alert = ({ title, body }) => {
  let classes = 'alert2';
  classes += title ? ' alert2--visible' : '';

  return (
    <div className={classes}>
      <div className="alert__content">
        <h3 className="alert__title ellipsis">{title}</h3>
        <h5 className="alert__text">{body}</h5>
      </div>
    </div>
  );
};

export default Alert;
