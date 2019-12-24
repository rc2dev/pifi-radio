import React from 'react';
import './loader.scss';

const Loader = () => {
  return (
    <div className="loader">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
