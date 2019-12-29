import React, { useState, useEffect } from 'react';
import './backdrop.scss';

const Backdrop = ({ title, body }) => {
  const [bodyStyled, setBodyStyled] = useState(false);

  const getScrollbarWidth = () =>
    window.innerWidth - document.documentElement.clientWidth;

  const doBodyStyle = () => {
    if (title) {
      // Calculate this BEFORE adding the class.
      document.body.style.paddingRight = getScrollbarWidth() + 'px';
      document.body.classList.add('body--backdrop');
      setBodyStyled(true);
      // We need this check because Bootstrap modals also style paddingRight
    } else if (!title && bodyStyled) {
      document.body.style.paddingRight = 0;
      document.body.classList.remove('body--backdrop');
      setBodyStyled(false);
    }
  };

  useEffect(doBodyStyle, [title, body]);

  const classes =
    'backdrop p-2 text-white' + (title ? ' backdrop--visible' : '');

  // We need text-white on h* tags because some themes override it
  return (
    <div className={classes}>
      <h3 className="text-white">{title}</h3>
      <h5 className="text-white">{body}</h5>
    </div>
  );
};

export default Backdrop;
