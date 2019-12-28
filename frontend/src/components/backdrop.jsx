import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  let classes = 'backdrop p-2 text-white';
  if (title) classes += ' backdrop--visible';

  return (
    // We need text-white on the h* because some themes override it
    <div className={classes}>
      <h3 className="text-white">{title}</h3>
      <h5 className="text-white">{body}</h5>
    </div>
  );
};

export default Backdrop;
