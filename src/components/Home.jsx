import React, { useState, useEffect } from 'react';

export default function Home({ user, onLogout }) {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // API 2: Public Real-time API
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1')
      .then(res => res.json())
      .then(data => {
        setCryptoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching market data: ", err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.welcome}>Welcome back, {user?.name || 'User'}!</h1>
          <p style={styles.email}>{user?.email}</p>
        </div>
        <button onClick={onLogout} style={styles.logoutBtn}>Logout</button>
      </header>

      <section style={styles.dashboard}>
        <h2 style={styles.secTitle}>📈 Real-time Market Watch (API 2)</h2>
        {loading ? (
          <p>Loading live rates...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Symbol</th>
                <th style={styles.th}>Price (USD)</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((coin) => (
                <tr key={coin.id} style={styles.tr}>
                  <td style={styles.td}>{coin.name}</td>
                  <td style={styles.td}>{coin.symbol.toUpperCase()}</td>
                  <td style={styles.td}>${coin.current_price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: { width: '100%', maxWidth: '900px', margin: '0 auto', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px' },
  welcome: { margin: 0, fontSize: '28px' },
  email: { margin: '4px 0 0 0', color: '#6b7280' },
  logoutBtn: { padding: '10px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  dashboard: { background: 'white', padding: '24px', borderRadius: '12px' },
  secTitle: { margin: '0 0 20px 0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', borderBottom: '2px solid #e5e7eb', textAlign: 'left' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px' }
};
