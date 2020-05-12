import React from 'react';
import Player from './player/player';
import Streams from './streams';
import Drawer from './drawer';
import './main.scss';

const Main = ({ playerStatus, handleBackdrop }) => {
  return (
    <main className="main py-4">
      <Drawer playerStatus={playerStatus} />
      <div className="main__primary container">
        <Player playerStatus={playerStatus} />
        <Streams onBackdrop={handleBackdrop} playerStatus={playerStatus} />
      </div>
    </main>
  );
};

export default Main;
