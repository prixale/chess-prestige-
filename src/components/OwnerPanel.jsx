import React, { useState, useEffect } from 'react';

const OwnerPanel = ({ setMaintenanceMode, maintenanceMode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState({});
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [activeSubTab, setActiveSubTab] = useState('stats'); // stats, menus, security, users

    const [globalSettings, setGlobalSettings] = useState({
        commission: 10,
        jackpotMult: 1,
        minWithdraw: 50,
        masterPin: "7777",
        masterKeyEmoji: "🔑",
        adminUsername: "admin",
        tabsVisibility: {
            play: true,
            potions: true,
            social: true,
            events: true,
            wallet: true,
            support: true,
            settings: true
        }
    });

    useEffect(() => {
        const loadData = () => {
            const db = JSON.parse(localStorage.getItem('chess_prestige_users_db') || '{}');
            setUsers(db);
            const savedSettings = localStorage.getItem('chess_prestige_global_settings');
            if (savedSettings) {
                setGlobalSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
            }
        };
        loadData();
    }, []);

    const saveSettings = (newSettings) => {
        setGlobalSettings(newSettings);
        localStorage.setItem('chess_prestige_global_settings', JSON.stringify(newSettings));
        window.dispatchEvent(new Event('storage')); // Trigger sync in App.jsx
    };

    const handleAuth = (e) => {
        e.preventDefault();
        if (pin === globalSettings.masterPin) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('PIN MAESTRO INCORRECTO');
            setPin('');
        }
    };

    const handleUpdateUser = (username, updates) => {
        const db = { ...users };
        const key = username.toLowerCase();
        db[key] = { ...db[key], ...updates };
        setUsers(db);
        localStorage.setItem('chess_prestige_users_db', JSON.stringify(db));
        setEditingUser(null);
        alert(`Usuario ${username} actualizado satisfactoriamente.`);
    };

    const deleteUser = (username) => {
        if (window.confirm(`¿Seguro que deseas ELIMINAR permanentemente a ${username}?`)) {
            const db = { ...users };
            delete db[username.toLowerCase()];
            setUsers(db);
            localStorage.setItem('chess_prestige_users_db', JSON.stringify(db));
        }
    };

    const auditLog = JSON.parse(localStorage.getItem('chess_prestige_global_audit_log') || '[]');
    
    const stats = {
        totalUsers: Object.keys(users).length,
        totalBalance: Object.values(users).reduce((acc, u) => acc + (u.balance || 0), 0),
        casinoProfit: auditLog
            .filter(tx => tx.type.toLowerCase().includes('comisión') || tx.type.toLowerCase().includes('victoria'))
            .reduce((acc, tx) => acc + (tx.amount * (globalSettings.commission / 100)), 0)
    };

    if (!isAuthenticated) {
        return (
            <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#0a0a0c' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏰</div>
                <h2 className="heading-gold">CENTRO DE COMANDO MAESTRO</h2>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.rem', width: '320px', marginTop: '2rem' }}>
                    <input autoFocus type="password" placeholder="PIN SECRET" value={pin} onChange={e => setPin(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--gold-border)', color: 'var(--gold-primary)', padding: '1.2rem', borderRadius: '12px', textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.8rem' }} />
                    {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
                    <button className="btn-play" style={{ padding: '1.2rem', marginTop: '1rem', fontWeight: 'bold' }}>AUTORIZAR ACCESO</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', animation: 'fadeIn 0.5s ease-out', color: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', paddingBottom: '1.5rem' }}>
                <div>
                    <h1 className="heading-premium" style={{ margin: 0, fontSize: '2.2rem' }}>MASTER CONTROL <span style={{ color: 'var(--gold-accent)' }}>V1.4</span></h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Operaciones Globales de Chess Prestige</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setIsAuthenticated(false)} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SALIR DEL COMANDO</button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { id: 'stats', label: 'Dashboard', icon: '📊' },
                    { id: 'menus', label: 'Estructura Menús', icon: '🧱' },
                    { id: 'security', label: 'Seguridad Secreta', icon: '🛡️' },
                    { id: 'users', label: 'Base de Jugadores', icon: '👥' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        style={{
                            padding: '1rem 1.5rem',
                            background: activeSubTab === tab.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                            color: activeSubTab === tab.id ? '#000' : '#fff',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Sub-Panels */}
            <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '500px' }}>
                {activeSubTab === 'stats' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h2 className="heading-gold" style={{marginBottom: '2rem'}}>RESUMEN OPERATIVO</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                             <div className="card-gamer" style={{ padding: '2rem', borderLeft: '5px solid var(--gold-primary)' }}>
                                <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>CAPITAL EN CIRCULACIÓN</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--gold-primary)' }}>${stats.totalBalance.toFixed(2)}</div>
                             </div>
                             <div className="card-gamer" style={{ padding: '2rem', borderLeft: '5px solid #10b981' }}>
                                <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>COMISIONES NETAS ACUMULADAS</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#10b981' }}>${stats.casinoProfit.toFixed(2)}</div>
                             </div>
                             <div className="card-gamer" style={{ padding: '2rem', borderLeft: '5px solid #3b82f6' }}>
                                <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>INDICE DE JUGADORES</div>
                                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: '#3b82f6' }}>{stats.totalUsers}</div>
                             </div>
                        </div>

                        <div style={{marginTop: '3rem'}}>
                            <h3 style={{fontSize: '1rem', color: 'var(--gold-primary)', marginBottom: '1rem'}}>Últimos Movimientos de Bóveda</h3>
                            <div style={{maxHeight: '300px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem'}}>
                                {auditLog.map((log, i) => (
                                    <div key={i} style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                        <span style={{opacity: 0.7}}>{log.timestamp?.split('T')[0]} - {log.user}</span>
                                        <span style={{fontWeight: 'bold'}}>{log.type}</span>
                                        <span style={{color: log.amount > 0 ? '#10b981' : '#ef4444'}}>{log.amount >= 0 ? '+' : ''}{log.amount.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'menus' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <h2 className="heading-gold" style={{marginBottom: '2rem'}}>ESTRUCTURA DEL FRONTEND</h2>
                        <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Habilita o deshabilita los módulos del juego en tiempo real para todos los usuarios.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            {Object.keys(globalSettings.tabsVisibility).map(tabKey => (
                                <div key={tabKey} style={{ 
                                    padding: '1.2rem', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    borderRadius: '12px', 
                                    border: '1px solid var(--glass-border)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.85rem'}}>{tabKey}</span>
                                    <button 
                                        onClick={() => {
                                            const newVisibility = { ...globalSettings.tabsVisibility, [tabKey]: !globalSettings.tabsVisibility[tabKey] };
                                            saveSettings({ ...globalSettings, tabsVisibility: newVisibility });
                                        }}
                                        style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '20px',
                                            border: 'none',
                                            background: globalSettings.tabsVisibility[tabKey] ? '#10b981' : '#ef4444',
                                            color: '#000',
                                            fontSize: '0.7rem',
                                            fontWeight: 'bold',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {globalSettings.tabsVisibility[tabKey] ? 'ACTIVO' : 'OCULTO'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSubTab === 'security' && (
                    <div style={{ animation: 'fadeIn 0.3s', maxWidth: '600px' }}>
                        <h2 className="heading-gold" style={{marginBottom: '2rem'}}>PROTOCOLOS DE SEGURIDAD</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card-gamer" style={{padding: '1.5rem'}}>
                                <h4 style={{marginBottom: '1rem', fontSize: '0.9rem'}}>🔐 PIN MAESTRO DE ACCESO</h4>
                                <input type="text" value={globalSettings.masterPin} 
                                    onChange={e => saveSettings({ ...globalSettings, masterPin: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--gold-border)', color: 'var(--gold-primary)', borderRadius: '8px', fontSize: '1.2rem', textAlign: 'center' }} />
                                <p style={{fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.5}}>Cambia el PIN numérico para entrar a este panel.</p>
                            </div>

                            <div className="card-gamer" style={{padding: '1.5rem'}}>
                                <h4 style={{marginBottom: '1rem', fontSize: '0.9rem'}}>🔑 ICONO DE "LLAVE DE ORO"</h4>
                                <input type="text" value={globalSettings.masterKeyEmoji} 
                                    onChange={e => saveSettings({ ...globalSettings, masterKeyEmoji: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px', fontSize: '1.5rem', textAlign: 'center' }} />
                                <p style={{fontSize: '0.7rem', marginTop: '0.5rem', opacity: 0.5}}>Cambia el emoji oculto en el Login (Ej: 🧿, ♟️, 🏆).</p>
                            </div>

                            <div className="card-gamer" style={{padding: '1.5rem'}}>
                                <h4 style={{marginBottom: '1rem', fontSize: '0.9rem'}}>👤 USUARIO ADMINISTRADOR</h4>
                                <input type="text" value={globalSettings.adminUsername} 
                                    onChange={e => saveSettings({ ...globalSettings, adminUsername: e.target.value })}
                                    style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px' }} />
                            </div>
                        </div>
                    </div>
                )}

                {activeSubTab === 'users' && (
                    <div style={{ animation: 'fadeIn 0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 className="heading-gold">BASE DE DATOS REAL</h2>
                            <input type="text" placeholder="Buscar usuario..." value={search} onChange={e => setSearch(e.target.value)}
                                style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--gold-border)', borderRadius: '12px', color: '#fff', width: '300px' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {Object.values(users)
                                .filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
                                .map(user => (
                                    <div key={user.username} className="card-gamer" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{user.username}</div>
                                            <div style={{fontSize: '0.75rem', color: 'var(--gold-primary)'}}>{user.rank} | ELO {user.elo}</div>
                                            <div style={{fontSize: '1rem', marginTop: '0.5rem', fontWeight: '900'}}>${user.balance?.toFixed(2)}</div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <button onClick={() => setEditingUser(user)} style={{ padding: '0.5rem', background: 'var(--gold-primary)', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>EDITAR AFORES</button>
                                            <button onClick={() => deleteUser(user.username)} style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem' }}>DESTRUIR</button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de edición avanzada de usuarios */}
            {editingUser && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
                    <div className="glass-panel" style={{ padding: '3rem', width: '450px', border: '1px solid var(--gold-primary)', boxShadow: '0 0 50px rgba(212, 175, 55, 0.2)' }}>
                        <h2 className="heading-gold" style={{marginBottom: '2rem', textAlign: 'center'}}>PERFIL MAESTRO: {editingUser.username}</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             <div>
                                <label style={{fontSize: '0.75rem', color: 'var(--gold-primary)', display: 'block', marginBottom: '0.4rem'}}>BALANCE BÓVEDA ($)</label>
                                <input type="number" defaultValue={editingUser.balance} id="edit-balance" style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '10px', fontSize: '1.2rem' }} />
                             </div>

                             <div>
                                <label style={{fontSize: '0.75rem', color: 'var(--gold-primary)', display: 'block', marginBottom: '0.4rem'}}>RANGO DEL JUGADOR</label>
                                <select defaultValue={editingUser.rank} id="edit-rank" style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '10px' }}>
                                    <option value="Bronce">Bronce</option>
                                    <option value="Oro">Oro</option>
                                    <option value="VIP Platinum">VIP Platinum</option>
                                    <option value="Diamante">Diamante</option>
                                </select>
                             </div>

                             <div>
                                <label style={{fontSize: '0.75rem', color: 'var(--gold-primary)', display: 'block', marginBottom: '0.4rem'}}>RESETEAR CONTRASEÑA (Sencillo)</label>
                                <input type="text" id="edit-pw" placeholder="Nueva clave..." style={{ width: '100%', padding: '1rem', background: '#000', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '10px' }} />
                             </div>

                             <button className="btn-play" onClick={() => {
                                 const balance = parseFloat(document.getElementById('edit-balance').value);
                                 const rank = document.getElementById('edit-rank').value;
                                 const newPw = document.getElementById('edit-pw').value;
                                 const updates = { balance, rank };
                                 if (newPw) {
                                     const hashStr = (str) => {
                                        let hash = 0;
                                        for (let i = 0; i < str.length; i++) {
                                            hash = ((hash << 5) - hash) + str.charCodeAt(i);
                                            hash |= 0;
                                        }
                                        return 'h' + Math.abs(hash).toString(36) + str.length;
                                     };
                                     updates.passwordHash = hashStr(newPw);
                                 }
                                 handleUpdateUser(editingUser.username, updates);
                             }} style={{ padding: '1.2rem', marginTop: '1rem', fontSize: '1rem' }}>SOBREESCRIBIR DATOS MAESTROS</button>
                             
                             <button onClick={() => setEditingUser(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginTop: '1rem' }}>Cerrar sin guardar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OwnerPanel;
