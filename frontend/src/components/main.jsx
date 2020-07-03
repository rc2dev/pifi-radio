import React from 'react';
import Player from './player/player';
import Streams from './streams';
import Drawer from './drawer';
import './main.scss';

const Main = ({ playerStatus, onBackdrop }) => {
  return (
    <main className="main">
      <Drawer playerStatus={playerStatus} />
      <div className="main__primary container">
        <Streams onBackdrop={onBackdrop} playerStatus={playerStatus} />
        <Player playerStatus={playerStatus} />
      </div>
    </main>
  );
};

export default Main;
