import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  let classes = 'backdrop p-2 text-white';

  const getScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  if (title) {
    classes += ' backdrop--visible';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
    document.body.classList.add('body--backdrop');
  } else {
    document.body.classList.remove('body--backdrop');
    document.body.style.paddingRight = 0;
  }

  // We need text-white on the h* because some themes override it
  return (
    <div className={classes}>
      <h3 className="text-white">{title}</h3>
      <h5 className="text-white">{body}</h5>
    </div>
  );
};

export default Backdrop;
