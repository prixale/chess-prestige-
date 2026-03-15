import React, { useState } from 'react';

const EarningsPanel = ({ maintenanceMode, setMaintenanceMode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    // Global Settings (Comisión y Jackpot locales por ahora)
    const [settings, setSettings] = useState({
        commission: 10,
        jackpotMult: 1
    });

    const masterPin = "7777";

    const handleAuth = (e) => {
        e.preventDefault();
        if (pin === masterPin) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('PIN INCORRECTO. ACCESO DENEGADO.');
            setPin('');
        }
    };

    if (!isAuthenticated) {
        return (
            <div style={{
                height: '70vh', display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', gap: '2rem'
            }}>
                <div style={{ fontSize: '3rem', animation: 'pulse 2s infinite' }}>🛡️</div>
                <h2 className="heading-gold" style={{ fontSize: '1.5rem' }}>CENTRO DE SEGURIDAD - DUEÑO</h2>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
                    <input
                        type="password"
                        placeholder="INGRESAR PIN MAESTRO"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        style={{
                            background: 'rgba(0,0,0,0.5)', border: '1px solid var(--gold-border)',
                            color: 'var(--gold-primary)', padding: '1rem', borderRadius: '8px',
                            textAlign: 'center', fontSize: '1.2rem', letterSpacing: '0.5rem'
                        }}
                    />
                    {error && <div style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
                    <button type="submit" className="btn-play" style={{ width: '100%', padding: '1rem' }}>DESBLOQUEAR CONTROL</button>
                </form>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Protección de Grado Militar Activada</p>
            </div>
        );
    }

    const stats = [
        { label: 'Ingresos Totales (Neto)', value: '$12,450.00', trend: '+15%', color: 'var(--gold-primary)' },
        { label: 'Volumen de Apuestas', value: '$84,200.00', trend: '+22%', color: '#3b82f6' },
        { label: 'Retiros Pendientes', value: '$1,200.00', trend: '-2%', color: '#ef4444' },
        { label: 'Margen de Plataforma', value: '12.4%', trend: '+1.2%', color: '#10b981' }
    ];

    return (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 className="heading-gold">MASTER CONTROL DASHBOARD</h2>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.7rem' }}
                >CERRAR SESIÓN SEGURA</button>
            </div>

            {/* Master Settings Section */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--gold-primary)' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', color: 'var(--gold-primary)' }}>⚙️ CONFIGURACIÓN GLOBAL DEL SISTEMA</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                    <div>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Comisión de la Casa (%): {settings.commission}%</label>
                        <input
                            type="range" min="0" max="30" step="1"
                            value={settings.commission}
                            onChange={(e) => setSettings({ ...settings, commission: parseInt(e.target.value) })}
                            style={{ width: '100%', accentColor: 'var(--gold-primary)' }}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Multiplicador Jackpot: x{settings.jackpotMult}</label>
                        <select
                            value={settings.jackpotMult}
                            onChange={(e) => setSettings({ ...settings, jackpotMult: parseInt(e.target.value) })}
                            style={{ width: '100%', background: '#000', color: '#fff', border: '1px solid var(--glass-border)', padding: '0.5rem' }}
                        >
                            <option value="1">Normal (Equilibrado)</option>
                            <option value="2">Generoso (Promo High)</option>
                            <option value="5">LEGENDARIO (Frenesí)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>Modo Mantenimiento</label>
                        <button
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            style={{
                                width: '100%', padding: '0.5rem', borderRadius: '4px', border: 'none',
                                background: maintenanceMode ? '#ef4444' : '#10b981', color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            {maintenanceMode ? 'ACTIVADO' : 'DESACTIVADO'}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderLeft: `4px solid ${stat.color}` }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.7rem', color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444' }}>
                            {stat.trend} este mes
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '2rem' }}>💰 Flujo de Caja y Ganancias Netas</h3>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                    {[40, 60, 45, 90, 100, 80, 70, 85, 95, 110, 120, 130].map((h, i) => (
                        <div key={i} style={{
                            flex: 1, height: `${h}%`,
                            background: i === 11 ? 'var(--gold-brushed)' : 'rgba(212, 175, 55, 0.2)',
                            borderRadius: '4px 4px 0 0',
                        }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EarningsPanel;
