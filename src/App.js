import React from 'react';

import Navigation from './components/navigation/navigation';
import Home from './components/home/home';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation />
      </header>
      <Home />
    </div>
  );
}

export default App;