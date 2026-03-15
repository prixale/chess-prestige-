import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      try {
        const db = JSON.parse(localStorage.getItem('chess_prestige_users_db') || '{}');
        const userList = Object.values(db)
          .map(user => ({
            name: user.username,
            elo: user.elo || 1000,
            rank: user.rank || 'Bronce',
            prize: user.balance > 1000 ? '👑 VIP' : '-',
            avatar: user.avatar || '👤'
          }))
          .sort((a, b) => b.elo - a.elo)
          .slice(0, 10); // Top 10

        setPlayers(userList);
      } catch (err) {
        console.error('Error loading leaderboard:', err);
      }
    };

    loadLeaderboard();
    // Listen for updates
    window.addEventListener('storage', loadLeaderboard);
    return () => window.removeEventListener('storage', loadLeaderboard);
  }, []);

  return (
    <div className="panel-glow" style={{
      padding: '2rem',
      backgroundColor: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
      borderRadius: '16px',
      width: '100%',
      maxWidth: '500px',
      marginTop: '1rem'
    }}>
      <h3 className="heading-premium" style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem' }}>
        Ranking Global Real 🏆
      </h3>
      
      {players.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
          Esperando a los primeros campeones... ♟️
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {players.map((p, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.8rem 1.2rem',
              background: idx === 0 ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.03)',
              border: idx === 0 ? '1px solid var(--gold-accent)' : '1px solid var(--glass-border)',
              borderRadius: '12px',
              transition: 'transform 0.2s'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ 
                  fontWeight: '900', 
                  fontSize: '1.1rem', 
                  minWidth: '25px',
                  color: idx === 0 ? 'var(--gold-accent)' : idx === 1 ? '#d1d5db' : idx === 2 ? '#cd7f32' : 'var(--text-muted)' 
                }}>
                  #{idx + 1}
                </span>
                <div style={{ fontSize: '1.5rem' }}>{p.avatar}</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.rank}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--gold-accent)', fontWeight: 'bold', fontSize: '1rem' }}>{p.elo} <span style={{fontSize: '0.6rem'}}>ELO</span></div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>{p.prize}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
        Actualizado en tiempo real • Basado en victorias oficiales
      </div>
    </div>
  );
};

export default Leaderboard;
