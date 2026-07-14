import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // API 1: Calls custom backend reverse-proxied by Nginx
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        onLoginSuccess(data.token, data.user);
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Cannot connect to login backend api.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back</h2>
      <p style={styles.subtitle}>Sign in to your dashboard</p>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={styles.input} required />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={styles.input} required />
        </div>
        <button type="submit" style={styles.button} disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#ffffff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)', width: '100%', maxWidth: '400px' },
  title: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#1a1a1a', textAlign: 'center' },
  subtitle: { margin: '0 0 24px 0', fontSize: '14px', color: '#666', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#4a5568' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e0' },
  button: { padding: '12px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: 'white', fontWeight: '600', cursor: 'pointer' },
  error: { background: '#fff5f5', color: '#c53030', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }
};
