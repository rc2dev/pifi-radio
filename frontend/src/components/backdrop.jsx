import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  let classes = 'backdrop p-2';
  if (title) classes += ' backdrop--visible';

  return (
    <div className={classes}>
      <h3>{title}</h3>
      <h5>{body}</h5>
    </div>
  );
};

export default Backdrop;
