import React, { useState } from 'react';

const AdminDashboard = ({ setAdminMode }) => {
  // Estadísticas y configuraciones simuladas
  const [earnings, setEarnings] = useState(125430.50);
  const [activePlayers, setActivePlayers] = useState(1204);
  const [tournaments, setTournaments] = useState(3);
  
  const handleSimulatePayment = () => {
    setEarnings(prev => prev + Math.random() * 500);
    setActivePlayers(prev => prev + Math.floor(Math.random() * 5));
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', padding: '2rem' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <div>
          <h1 className="heading-premium" style={{ margin: 0, fontSize: '2.5rem' }}>
            Panel de Control <span className="text-gold">Admin</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Propietario de Chess Prestige</p>
        </div>
        <button 
          onClick={() => setAdminMode(false)}
          style={{ padding: '0.8rem 1.5rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cerrar Panel Admin
        </button>
      </header>
    
      {/* Grid de Estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Ganancias Totales</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold-accent)', margin: '1rem 0' }}>
            ${earnings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <button 
            onClick={handleSimulatePayment}
            style={{ padding: '0.5rem 1rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Simular Nuevo Pago
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Jugadores Activos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa', margin: '1rem 0' }}>
            {activePlayers}
          </p>
          <p style={{ color: '#10b981', fontSize: '0.9rem' }}>+12% vs ayer</p>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-muted)' }}>Torneos Activos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#c084fc', margin: '1rem 0' }}>
            {tournaments}
          </p>
          <button 
            style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #c084fc', color: '#c084fc', borderRadius: '4px', cursor: 'pointer' }}
          >
            Gestionar
          </button>
        </div>

      </div>

      {/* Acciones de Administrador */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Administración Rápida</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ flex: 1, padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '8px', cursor: 'pointer' }}>
            Banear Jugadores Sospechosos
          </button>
          <button style={{ flex: 1, padding: '1rem', background: 'rgba(251, 191, 36, 0.2)', border: '1px solid var(--gold-accent)', color: 'var(--gold-accent)', borderRadius: '8px', cursor: 'pointer' }}>
            Ajustar Premios Globales
          </button>
          <button style={{ flex: 1, padding: '1rem', background: 'rgba(96, 165, 250, 0.2)', border: '1px solid #60a5fa', color: '#60a5fa', borderRadius: '8px', cursor: 'pointer' }}>
            Anunciar Mantenimiento
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
