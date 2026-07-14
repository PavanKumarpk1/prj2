import React, { useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLoginSuccess = (userToken, userData) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div style={styles.app}>
      {!token ? (
        <div style={styles.centered}>
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <Home user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

const styles = {
  app: { minHeight: '100vh', background: '#f3f4f6', fontFamily: 'system-ui, sans-serif', display: 'flex', flexDirection: 'column' },
  centered: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }
};
