import React from 'react';
import logo from './logo.svg';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import Button from '@mui/material/Button';
import Hero from './Hero';
import MakeSwap from './MakeSwap';
import TakeSwap from './TakeSwap';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload, duh!
        </p>
        <Button>
          Learn React
        </Button>
        <Routes>
          <Route path="/" element={<App />} />
          <Route index element={<Hero />} />
          <Route path="make" element={<MakeSwap />} />
          <Route path="take" element={<TakeSwap />} />
      </Routes>
      </header>
    </div>
  );
}

export default App;
