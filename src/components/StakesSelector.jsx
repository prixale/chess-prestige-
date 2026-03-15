import React from 'react';

const StakesSelector = ({ balance, onSelect }) => {
    const tiers = [
        {
            id: 'recruit', name: 'Arena de Reclutas', fee: 1, prize: 1.8,
            desc: 'Perfecto para calentar motores.', color: '#94a3b8', icon: '🛡️'
        },
        {
            id: 'knight', name: 'Duelo de Caballeros', fee: 5, prize: 9,
            desc: 'Donde la estrategia comienza a pesar.', color: '#fbbf24', icon: '⚔️'
        },
        {
            id: 'imperial', name: 'Torneo Imperial', fee: 25, prize: 45,
            desc: 'Solo para veteranos del tablero.', color: '#a855f7', icon: '👑'
        },
        {
            id: 'legend', name: 'Olimpo de Leyendas', fee: 100, prize: 190,
            desc: 'Prestigio máximo. Riesgo total.', color: '#f43f5e', icon: '💎'
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'left' }}>
                <h2 className="heading-gold" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>ARENAS DE PRESTIGIO</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Selecciona tu nivel de apuesta y reclama el botín.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {tiers.map((tier) => {
                    const canAfford = balance >= tier.fee;
                    return (
                        <div
                            key={tier.id}
                            className="card-gamer"
                            onClick={() => canAfford && onSelect(tier)}
                            style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                cursor: canAfford ? 'pointer' : 'not-allowed',
                                border: `2px solid ${canAfford ? 'rgba(255,255,255,0.05)' : '#ef4444'}`,
                                opacity: canAfford ? 1 : 0.6,
                                transition: '0.3s',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {!canAfford && (
                                <div style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    fontSize: '0.6rem', background: '#ef4444', color: '#fff',
                                    padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold'
                                }}>SALDO INSUFICIENTE</div>
                            )}

                            <div style={{ fontSize: '2.5rem' }}>{tier.icon}</div>
                            <div>
                                <h3 style={{ color: tier.color, marginBottom: '0.3rem', fontSize: '1.1rem' }}>{tier.name}</h3>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', minHeight: '2.5rem' }}>{tier.desc}</p>
                            </div>

                            <div style={{
                                marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px', borderLeft: `4px solid ${tier.color}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                    <span>Entrada:</span>
                                    <span style={{ fontWeight: 'bold' }}>${tier.fee}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', marginTop: '5px' }}>
                                    <span>Premio:</span>
                                    <span style={{ fontWeight: 'bold', color: '#10b981' }}>${tier.prize}</span>
                                </div>
                            </div>

                            <button
                                className="btn-play"
                                disabled={!canAfford}
                                style={{
                                    marginTop: 'auto', background: canAfford ? 'var(--gold-brushed)' : '#4b5563',
                                    filter: canAfford ? 'none' : 'grayscale(1)'
                                }}
                            >
                                {canAfford ? 'ENTRAR AHORA' : 'BLOQUEADO'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StakesSelector;
