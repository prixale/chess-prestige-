import React, { useEffect, useState } from 'react';

const GameOverModal = ({ result, eloChange, lotteryPrize = 0, stakePrize = 0, onRestart, onLobby }) => {
    const [phase, setPhase] = useState('result'); // 'result' -> 'roulette' -> 'reveal'
    const [rouletteValue, setRouletteValue] = useState(0);
    const [spinning, setSpinning] = useState(false);

    const prizes = [0, 0.50, 1, 2, 5, 10, 25, 50, 100, 500, 1000];

    useEffect(() => {
        // After 1.5s show roulette
        const t1 = setTimeout(() => {
            setPhase('roulette');
            setSpinning(true);
        }, 1500);
        return () => clearTimeout(t1);
    }, []);

    useEffect(() => {
        if (!spinning) return;
        let count = 0;
        const maxSpins = 25 + Math.floor(Math.random() * 10);
        const interval = setInterval(() => {
            setRouletteValue(prizes[Math.floor(Math.random() * prizes.length)]);
            count++;
            if (count >= maxSpins) {
                clearInterval(interval);
                setRouletteValue(lotteryPrize);
                setSpinning(false);
                setTimeout(() => setPhase('reveal'), 400);
            }
        }, 80 + count * 5);
        return () => clearInterval(interval);
    }, [spinning]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(16px)'
        }}>
            <div className="panel-glow" style={{
                backgroundColor: '#0d0d1a',
                border: '2px solid var(--gold-primary)',
                borderRadius: '24px',
                padding: '2.5rem',
                textAlign: 'center',
                maxWidth: '520px',
                width: '92%',
                boxShadow: '0 0 80px rgba(212, 175, 55, 0.3), inset 0 0 60px rgba(212, 175, 55, 0.05)',
                animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Casino decorative corners */}
                <div style={{ position: 'absolute', top: '8px', left: '8px', width: '30px', height: '30px', borderTop: '2px solid var(--gold-primary)', borderLeft: '2px solid var(--gold-primary)', borderRadius: '4px 0 0 0' }}></div>
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '30px', height: '30px', borderTop: '2px solid var(--gold-primary)', borderRight: '2px solid var(--gold-primary)', borderRadius: '0 4px 0 0' }}></div>
                <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '30px', height: '30px', borderBottom: '2px solid var(--gold-primary)', borderLeft: '2px solid var(--gold-primary)', borderRadius: '0 0 0 4px' }}></div>
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '30px', height: '30px', borderBottom: '2px solid var(--gold-primary)', borderRight: '2px solid var(--gold-primary)', borderRadius: '0 0 4px 0' }}></div>

                {/* Header */}
                <div style={{ fontSize: '0.65rem', letterSpacing: '0.3rem', color: 'var(--gold-primary)', marginBottom: '0.5rem' }}>♠ ♥ ♦ ♣</div>
                <h2 className="heading-gold" style={{ fontSize: '2rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    {eloChange > 0 ? '¡VICTORIA!' : eloChange < 0 ? 'DERROTA' : 'EMPATE'}
                </h2>
                <div style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.6)' }}>
                    {result}
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem', letterSpacing: '0.1rem' }}>ELO</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: eloChange >= 0 ? '#10b981' : '#ef4444' }}>
                            {eloChange >= 0 ? `+${eloChange}` : eloChange}
                        </div>
                    </div>
                    <div style={{
                        padding: '1rem', background: 'rgba(0,0,0,0.4)', borderRadius: '12px',
                        border: `1px solid ${stakePrize > 0 ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)'}`
                    }}>
                        <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem', letterSpacing: '0.1rem' }}>GANANCIAS</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--gold-primary)' }}>
                            ${(stakePrize || 0).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* CASINO ROULETTE SECTION */}
                <div style={{
                    padding: '1.5rem', marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, rgba(13, 100, 0, 0.3) 0%, rgba(0,0,0,0.5) 100%)',
                    borderRadius: '16px',
                    border: '2px solid rgba(16, 185, 129, 0.3)',
                    position: 'relative'
                }}>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', marginBottom: '0.8rem', letterSpacing: '0.15rem', fontWeight: 'bold' }}>
                        🎰 RULETA DE LA FORTUNA 🎰
                    </div>

                    {phase === 'result' && (
                        <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}>
                            Preparando la ruleta...
                        </div>
                    )}

                    {phase === 'roulette' && (
                        <div style={{
                            fontSize: '3rem', fontWeight: '900',
                            color: 'var(--gold-primary)',
                            animation: 'pulse 0.15s infinite',
                            textShadow: '0 0 30px var(--gold-glow)'
                        }}>
                            ${rouletteValue.toFixed(2)}
                        </div>
                    )}

                    {phase === 'reveal' && (
                        <div>
                            <div style={{
                                fontSize: '3rem', fontWeight: '900',
                                color: lotteryPrize > 0 ? 'var(--gold-primary)' : '#ef4444',
                                animation: lotteryPrize > 0 ? 'pulse 1s infinite' : 'none',
                                textShadow: lotteryPrize > 0 ? '0 0 40px var(--gold-glow)' : 'none'
                            }}>
                                ${lotteryPrize.toFixed(2)}
                            </div>
                            {lotteryPrize >= 50 && (
                                <div style={{
                                    marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 'bold',
                                    background: 'linear-gradient(90deg, #f43f5e, #fbbf24, #10b981, #3b82f6, #a855f7)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    animation: 'pulse 0.5s infinite'
                                }}>
                                    🏆 ¡¡¡JACKPOT LEGENDARIO!!! 🏆
                                </div>
                            )}
                            {lotteryPrize > 0 && lotteryPrize < 50 && (
                                <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: '#10b981' }}>
                                    💰 ¡Has ganado en la ruleta!
                                </div>
                            )}
                            {lotteryPrize === 0 && (
                                <div style={{ marginTop: '0.3rem', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
                                    La suerte no estuvo de tu lado esta vez
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Total Summary */}
                {phase === 'reveal' && (
                    <div style={{
                        padding: '1rem', marginBottom: '1.5rem',
                        background: 'rgba(212, 175, 55, 0.08)', borderRadius: '12px',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>TOTAL GANADO</div>
                        <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--gold-primary)' }}>
                            ${((stakePrize || 0) + lotteryPrize).toFixed(2)}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.8rem' }}>
                    <button onClick={onRestart} className="btn-play" style={{
                        flex: 1, padding: '1rem', fontSize: '0.85rem',
                        background: 'linear-gradient(135deg, #10b981, #059669)'
                    }}>
                        ♻️ REMATCH
                    </button>
                    <button onClick={onLobby} style={{
                        flex: 1, padding: '1rem', background: 'transparent',
                        border: '1px solid var(--gold-border)', color: '#fff',
                        borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem'
                    }}>
                        🏠 LOBBY
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;
