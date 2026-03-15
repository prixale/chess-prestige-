import React, { useState } from 'react';

const DealsTab = ({ currentUser, onReward }) => {
    const [claimed, setClaimed] = useState([]);

    const sponsorships = [
        {
            brand: 'Razer Prestige',
            offer: '20% Off en Periféricos Gamer',
            code: 'CHESSRAZER',
            image: '🖱️',
            color: '#00ff00'
        },
        {
            brand: 'CryptoMaster',
            offer: 'Bono de $50 en tu primer depósito',
            code: 'PRESTIGECRYPTO',
            image: '₿',
            color: '#f7931a'
        },
        {
            brand: 'Guelph Watches',
            offer: 'Edición limitada Chess King',
            code: 'KINGWATCH',
            image: '⌚',
            color: '#e2e8f0'
        }
    ];

    const dailyAds = [
        { id: 'ad1', title: 'Mira este video promocional', type: 'VIDEO', reward: '5.00 USD' },
        { id: 'ad2', title: 'Completa la encuesta de satisfacción', type: 'SURVEY', reward: '10.00 USD' }
    ];

    const handleClaim = (ad) => {
        if (claimed.includes(ad.id)) return;
        setClaimed([...claimed, ad.id]);
        onReward(ad.reward);
    };

    return (
        <div style={{ padding: '1rem', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Patrocinios VIP */}
            <div>
                <h3 className="heading-premium" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem' }}>
                    <span>🌟</span> PATROCINIOS DE ALTO NIVEL
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {sponsorships.map((s, idx) => (
                        <div key={idx} className="glass-panel panel-glow" style={{ padding: '1.5rem', borderLeft: `4px solid ${s.color}` }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.image}</div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{s.brand}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.8rem' }}>{s.offer}</p>
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                textAlign: 'center',
                                border: '1px dashed var(--glass-border)',
                                color: 'var(--gold-accent)',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '0.8rem'
                            }} onClick={() => alert('Código de Descuento Copiado!')}>
                                CÓDIGO: {s.code}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Publicidad Recompensada */}
            <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(rgba(59, 130, 246, 0.1), transparent)' }}>
                <h3 className="heading-premium" style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>🎯 TAREAS RECOMPENSADAS (FONDOS REALES)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {dailyAds.map((ad, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '1.2rem',
                            background: 'rgba(0,0,0,0.3)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            opacity: claimed.includes(ad.id) ? 0.5 : 1
                        }}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{ad.title}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tipo: {ad.type} | Recompensa: <span style={{color: '#10b981'}}>{ad.reward}</span></div>
                            </div>
                            <button 
                                onClick={() => handleClaim(ad)}
                                disabled={claimed.includes(ad.id)}
                                style={{
                                    padding: '0.6rem 1.5rem',
                                    borderRadius: '8px',
                                    background: claimed.includes(ad.id) ? 'transparent' : ad.type === 'VIDEO' ? 'var(--gold-accent)' : '#3b82f6',
                                    color: claimed.includes(ad.id) ? '#fff' : '#000',
                                    border: claimed.includes(ad.id) ? '1px solid #fff' : 'none',
                                    fontWeight: 'bold',
                                    cursor: claimed.includes(ad.id) ? 'default' : 'pointer',
                                    fontSize: '0.75rem'
                                }}
                            >
                                {claimed.includes(ad.id) ? 'COMPLETADO' : `GANA ${ad.reward}`}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                ℹ️ Los fondos de patrocinio se acreditan instantáneamente en su Bóveda.
            </div>

        </div>
    );
};

export default DealsTab;
