import React, { useState } from 'react';

const PotionsTab = ({ user, onPurchase }) => {
    const [buying, setBuying] = useState(null);

    const potions = [
        { id: 'elo_boost', name: 'Poción de Elocuencia', price: 100, desc: '+50 ELO instantáneo (Un solo uso)', icon: '🧪', color: '#10b981' },
        { id: 'luck_boost', name: 'Filtro de Fortuna', price: 250, desc: 'X2 Recompensas por 1 hora', icon: '🍀', color: '#3b82f6' },
        { id: 'wisdom_essence', name: 'Esencia de Sabiduría', price: 500, desc: 'Muestra la mejor jugada en partida', icon: '🧠', color: '#8b5cf6' },
        { id: 'dragon_breath', name: 'Aliento de Dragón', price: 1000, desc: 'Efecto visual de fuego en tus piezas', icon: '🔥', color: '#ef4444' }
    ];

    const inventory = user.inventory || [];

    const handleBuy = (potion) => {
        if (user.balance < potion.price) {
            alert('Saldo insuficiente en diamantes o divisas.');
            return;
        }
        
        setBuying(potion.id);
        setTimeout(() => {
            onPurchase(potion);
            setBuying(null);
        }, 1200);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2 className="heading-gold" style={{ marginBottom: '2rem' }}>LABORATORIO DE ALQUIMIA</h2>
            
            <div style={{ 
                background: 'rgba(255,255,255,0.03)', 
                padding: '1rem 2rem', 
                borderRadius: '12px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '10px', 
                border: '1px solid var(--gold-border)',
                marginBottom: '2rem'
            }}>
                <span style={{fontSize: '1.2rem'}}>💰</span>
                <span style={{fontWeight: '900', color: 'var(--gold-primary)'}}>{user.balance?.toFixed(2)}</span>
                <span style={{fontSize: '0.7rem', opacity: 0.6}}>SALDO DISPONIBLE</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {potions.map(potion => (
                    <div key={potion.id} className="card-gamer" style={{ padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem',
                            filter: `drop-shadow(0 0 15px ${potion.color})`
                        }}>
                            {potion.icon}
                        </div>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: potion.color }}>{potion.name}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>{potion.desc}</p>
                        <button 
                            className="btn-play" 
                            onClick={() => handleBuy(potion)}
                            disabled={buying === potion.id}
                            style={{ 
                                width: '100%', 
                                padding: '0.8rem',
                                background: buying === potion.id ? 'rgba(255,255,255,0.1)' : ''
                            }}
                        >
                            {buying === potion.id ? 'TRANSFIRIENDO...' : `RECLAMAR (${potion.price} 💎)`}
                        </button>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ marginTop: '3rem', padding: '2rem', border: '1px dashed var(--gold-border)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>📦</span> Tu Inventario de Pociones
                </h3>
                {inventory.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No tienes pociones activas. ¡Visita el laboratorio para mejorar tu juego!</p>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {inventory.map((item, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                padding: '1rem', 
                                borderRadius: '12px', 
                                border: '1px solid var(--glass-border)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{fontSize: '1.5rem'}}>{item.icon}</span>
                                <div>
                                    <div style={{fontSize: '0.8rem', fontWeight: 'bold'}}>{item.name}</div>
                                    <div style={{fontSize: '0.6rem', color: '#10b981'}}>LISTA PARA USAR</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PotionsTab;
