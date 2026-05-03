import React, { useState, useEffect } from 'react';
import Home from './pages/Home.js';
import Auth from './components/Auth.js';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('tweeterUser');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if 24 hours have passed
        if (new Date().getTime() < parsed.expiry) {
          return parsed.userData;
        } else {
          localStorage.removeItem('tweeterUser');
        }
      } catch (err) {
        localStorage.removeItem('tweeterUser');
      }
    }
    return null;
  });

  const handleLogin = (userData) => {
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem('tweeterUser', JSON.stringify({ userData, expiry }));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('tweeterUser');
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <Home user={user} onLogout={handleLogout} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
