import React from 'react';
import './App.css';
import Background from './components/Background';
import AudioMixer from './components/AudioMixer';

function App() {
  return (
    <div className="App">
      <Background/>
      <AudioMixer/>
    </div>
  );
}

export default App;
