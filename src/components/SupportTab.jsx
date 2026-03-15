import React, { useState } from 'react';

const SupportTab = () => {
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(topic && message) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setTopic('');
        setMessage('');
      }, 3000);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h2 className="heading-premium" style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span>🛡️</span> Soporte Técnico 24/7
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          ¿Problemas técnicos o dudas sobre pagos? Nuestro equipo está en línea y listo para asistirte en cualquier momento.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Mensaje Enviado</h3>
            <p style={{ color: 'var(--text-muted)' }}>Un agente se comunicará contigo al correo de tu cuenta en breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tema de la Consulta</label>
              <select 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                style={{
                  padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                  background: 'rgba(0, 0, 0, 0.4)', color: 'var(--text-main)', outline: 'none'
                }}
                required
              >
                <option value="">Selecciona un tema...</option>
                <option value="pago">Problemas con Pago/Suscripción</option>
                <option value="cuenta">Recuperación de Cuenta</option>
                <option value="reporte">Reportar a un Jugador</option>
                <option value="bug">Error en el Juego</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Mensaje</label>
              <textarea 
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe tu problema en detalle..."
                rows="5"
                style={{
                  padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)',
                  background: 'rgba(0, 0, 0, 0.4)', color: 'var(--text-main)', outline: 'none',
                  resize: 'vertical'
                }}
                required
              />
            </div>

            <button type="submit" style={{
              padding: '1rem', borderRadius: '8px', background: '#3b82f6', color: '#fff',
              border: 'none', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
              marginTop: '1rem', transition: 'background 0.2s'
            }}
            onMouseOver={e => e.target.style.background = '#2563eb'}
            onMouseOut={e => e.target.style.background = '#3b82f6'}
            >
              Enviar Ticket a Soporte
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Tiempo estimado de respuesta: &lt; 5 minutos.
            </p>
          </form>
        )}
      </div>

    </div>
  );
};

export default SupportTab;
