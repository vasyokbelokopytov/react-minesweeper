import React from 'react';
import './App.css';

import Game from './components/Game/Game';

function App() {
  return (
    <div className="App">
      <Game rows={8} columns={10} bombs={10} />
    </div>
  );
}

export default App;
