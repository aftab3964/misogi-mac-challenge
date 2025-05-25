import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    axios.get('https://literate-space-fishstick-q65wg4774r5h9gv5-5000.app.github.dev/')
      .then(res => setMessage(res.data))
      .catch(err => setMessage('❌ Error connecting to backend'));
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '60px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#2c3e50' }}>Welcome to Misogi MAC Challenge</h1>
      <p style={{ fontSize: '18px' }}>Backend says: <strong>{message}</strong></p>
    </div>
  );
}

export default App;
