import React from 'react';

const PromoAndEvents = () => {
  const events = [
    {
      title: 'Campeonato Mundial Prestige 2026',
      date: '15 de Diciembre, 2026',
      prize: '$1,000,000 USD Jackpot',
      image: '👑',
      tag: 'MAJOR',
      color: 'var(--gold-accent)'
    },
    {
      title: 'Torneo Relámpago Sabatino',
      date: 'Cada Sábado 20:00 UTC',
      prize: '500 USD + VIP Status',
      image: '⚡',
      tag: 'WEEKLY',
      color: '#3b82f6'
    },
    {
      title: 'Blitz Mania Nocturna',
      date: 'Diario 02:00 UTC',
      prize: 'X2 ELO Points & Diamantes',
      image: '🌙',
      tag: 'DAILY',
      color: '#8b5cf6'
    },
    {
      title: 'Copa Primavera Prestige',
      date: 'Inicia en 3 días',
      prize: '2,500 USD Pool Total',
      image: '🌱',
      tag: 'SEASONAL',
      color: '#10b981'
    }
  ];

  const promos = [
    {
      title: 'Bono de Bienvenida Cripto',
      desc: 'Duplica tu primer depósito hasta $100 en BTC o ETH.',
      tag: 'HOT',
      btn: 'Reclamar Bono',
      icon: '🚀'
    },
    {
      title: 'Refiere y Gana Diamantes',
      desc: 'Gana $5 por cada amigo que alcance el Rango Plata.',
      tag: 'UNLIMITED',
      btn: 'Invitar Amigos',
      icon: '💎'
    },
    {
      title: 'Suscripción Élite -50%',
      desc: 'Solo por este fin de semana. ¡Acceso a entrenamientos exclusivos!',
      tag: 'FLASH SALE',
      btn: 'Ser Premium',
      icon: '🔥'
    }
  ];

  return (
    <div style={{ padding: '1rem', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      {/* Sección Eventos Destacados */}
      <div>
        <h2 className="heading-premium" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>🌍</span> Eventos Globales de Élite
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {events.map((ev, idx) => (
            <div key={idx} className="glass-panel panel-glow" style={{ padding: '2rem', borderTop: `5px solid ${ev.color}` }}>
              <div style={{
                position: 'absolute', top: 0, right: 0,
                background: ev.color, color: '#000',
                padding: '0.3rem 1.2rem', borderBottomLeftRadius: '12px',
                fontSize: '0.75rem', fontWeight: '900'
              }}>
                {ev.tag}
              </div>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>{ev.image}</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.8rem', textAlign: 'center' }}>{ev.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>📅 {ev.date}</p>
              <p style={{ color: ev.color, fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', textShadow: `0 0 10px ${ev.color}44` }}>
                🎁 Premio: {ev.prize}
              </p>
              <button style={{
                marginTop: '1.5rem', width: '100%', padding: '0.8rem', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)',
                color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
              }} onMouseOver={e => e.target.style.background = ev.color + '33'}
                onMouseOut={e => e.target.style.background = 'rgba(255,255,255,0.05)'}>
                Inscribirse al Evento
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sección Promociones y Sorteos */}
      <div className="glass-panel" style={{ padding: '2.5rem', background: 'linear-gradient(rgba(251, 191, 36, 0.05), transparent)' }}>
        <h2 className="heading-premium" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span>🎁</span> Ofertas y Recompensas Hot
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {promos.map((pr, idx) => (
            <div key={idx} style={{ textAlign: 'center', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{pr.icon}</div>
              <span style={{
                display: 'inline-block', padding: '0.2rem 0.8rem',
                background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444',
                borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', marginBottom: '1rem'
              }}>
                {pr.tag}
              </span>
              <h3 style={{ marginBottom: '0.8rem', fontSize: '1.2rem' }}>{pr.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: '3rem' }}>{pr.desc}</p>
              <button style={{
                width: '100%', padding: '0.8rem', borderRadius: '10px',
                background: 'var(--gold-accent)', color: '#000',
                border: 'none', cursor: 'pointer', fontWeight: 'bold',
                transition: 'all 0.3s', boxShadow: '0 4px 15px var(--gold-glow)'
              }}
                onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                {pr.btn}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PromoAndEvents;
