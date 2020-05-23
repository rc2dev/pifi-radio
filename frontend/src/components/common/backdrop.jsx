import React from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  const visible = title;
  const bodyStyled = document.body.classList.contains('body--backdrop');

  if (visible && !bodyStyled) {
    // Calculate this BEFORE adding the class.
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
    document.body.classList.add('body--backdrop');
    // We need this check because Bootstrap modals also style paddingRight
  } else if (!visible && bodyStyled) {
    document.body.style.paddingRight = 0;
    document.body.classList.remove('body--backdrop');
  }

  const classes =
    'backdrop p-2 text-white' + (visible ? ' backdrop--visible' : '');

  // We need text-white on h* tags because some themes override it
  return (
    <div className={classes}>
      <h3 className="text-white">{title}</h3>
      <h5 className="text-white">{body}</h5>
    </div>
  );
};

const getScrollbarWidth = () =>
  window.innerWidth - document.documentElement.clientWidth;

export default Backdrop;
