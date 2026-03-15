import React from 'react';

const SubscriptionPlans = ({ onClose, onSubscribe }) => {
  const plans = [
    {
      name: 'Bronce (Estándar)',
      price: '$0.00',
      period: '/ siempre',
      features: ['Partidas contra IA ilimitadas', 'Chat Tradicional', '100 ELO inicial'],
      color: '#cd7f32', 
      popular: false
    },
    {
      name: 'VIP Platinum',
      price: '$19.99',
      period: '/ mes',
      features: ['-30% Comisión de Casino', 'Probabilidad Jackpot +50%', 'Emblema Platinum', 'Soporte Prioritario'],
      color: '#e5e4e2', 
      popular: true
    },
    {
      name: 'Diamante Supremo',
      price: '$99.99',
      period: '/ año',
      features: ['-50% Comisión de Casino', 'Probabilidad Jackpot +200%', 'Torneos Exclusivos con Premio Real', 'Llave de Fundador'],
      color: '#b9f2ff', 
      popular: false
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="panel-glow" style={{
        padding: '2.5rem',
        backgroundColor: 'var(--bg-dark)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '900px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1.5rem',
            background: 'transparent', border: 'none', color: 'var(--text-muted)',
            fontSize: '1.5rem', cursor: 'pointer'
          }}
        >
          ✖
        </button>

        <div style={{ textAlign: 'center', margin: '3rem' }}>
          <h2 className="heading-premium" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            Mejora tu Experiencia
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Planes **asequibles** diseñados para que todos puedan disfrutar de Chess Prestige.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {plans.map((plan, idx) => (
            <div key={idx} style={{
              background: 'var(--square-dark)',
              border: `2px solid ${plan.popular ? plan.color : 'var(--glass-border)'}`,
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              transform: plan.popular ? 'scale(1.05)' : 'none',
              zIndex: plan.popular ? 2 : 1,
              boxShadow: plan.popular ? `0 0 25px ${plan.color}40` : 'none'
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)',
                  background: plan.color, color: 'var(--bg-dark)', fontWeight: 'bold',
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', letterSpacing: '1px'
                }}>
                  MÁS POPULAR
                </div>
              )}
              <h3 style={{ color: plan.color, fontSize: '1.5rem', marginBottom: '1rem' }}>{plan.name}</h3>
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{plan.price}</span>
                <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                 {plan.features.map((feat, i) => (
                   <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <span style={{ color: '#10b981' }}>✓</span> {feat}
                   </li>
                 ))}
              </ul>
              <button 
                onClick={() => onSubscribe(plan.name)}
                style={{
                  marginTop: '2rem', width: '100%', padding: '1rem',
                  background: plan.popular ? plan.color : 'transparent',
                  color: plan.popular ? 'var(--bg-dark)' : 'var(--text-main)',
                  border: plan.popular ? 'none' : `1px solid ${plan.color}`,
                  borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => {
                  if(!plan.popular) {
                    e.target.style.background = `${plan.color}20`;
                  } else {
                    e.target.style.boxShadow = `0 4px 15px ${plan.color}80`;
                  }
                }}
                onMouseOut={e => {
                  if(!plan.popular) {
                    e.target.style.background = 'transparent';
                  } else {
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                Suscribirse
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SubscriptionPlans;
