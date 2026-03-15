import React, { useState } from 'react';
import { languages } from '../utils/i18n';

const SettingsTab = ({ user, setUser, language, setLanguage, t }) => {
    const avatars = ['👤', '🐺', '🐉', '⚔️', '👑', '🧙', '🥷', '🦁', '🦅', '♟️'];
    const themes = [
        { id: 'wood', name: 'Madera Clásica', light: '#f0d9b5', dark: '#b58863' },
        { id: 'neon', name: 'Noche Neón', light: '#1e1b4b', dark: '#312e81' },
        { id: 'marble', name: 'Mármol Real', light: '#e2e8f0', dark: '#64748b' },
        { id: 'tournament', name: 'Azul Torneo', light: '#dee3e6', dark: '#8ca2ad' }
    ];

    const [username, setUsername] = useState(user?.username || '');

    const handleUpdateAvatar = (newAvatar) => {
        setUser({ ...user, avatar: newAvatar });
    };

    const handleUpdateTheme = (newTheme) => {
        setUser({ ...user, boardTheme: newTheme });
    };

    return (
        <div style={{ padding: '1rem', maxWidth: '850px' }}>
            <h2 className="heading-gold" style={{ marginBottom: '2.5rem' }}>{t('settings_title')}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Profile Settings */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>👤 {t('player_identity')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '120px', height: '120px', borderRadius: '50%',
                                background: 'var(--gold-brushed)', margin: '0 auto 1.5rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '4rem', border: '3px solid var(--gold-primary)',
                                boxShadow: '0 0 20px var(--gold-glow)'
                            }}>
                                {user.avatar || '👤'}
                            </div>
                            <button className="btn-play" style={{ fontSize: '0.7rem', padding: '0.5rem 1rem' }}>SUBIR FOTO</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Username</label>
                                <input
                                    type="text"
                                    className="card-gamer"
                                    style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onBlur={() => setUser({ ...user, username })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{t('choose_avatar')}</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {avatars.map(av => (
                                        <button
                                            key={av}
                                            onClick={() => handleUpdateAvatar(av)}
                                            style={{
                                                fontSize: '1.5rem', padding: '0.5rem', background: user.avatar === av ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                                                border: '1px solid var(--gold-border)', borderRadius: '8px', cursor: 'pointer', transition: '0.2s'
                                            }}
                                        >
                                            {av}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Board Customization */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🎨 {t('board_customization')}</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
                        {themes.map(theme => (
                            <div
                                key={theme.id}
                                onClick={() => handleUpdateTheme(theme.id)}
                                style={{
                                    cursor: 'pointer', textAlign: 'center', padding: '1rem',
                                    border: user.boardTheme === theme.id ? '2px solid var(--gold-primary)' : '1px solid var(--gold-border)',
                                    borderRadius: '12px', background: user.boardTheme === theme.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                    transition: '0.3s'
                                }}
                            >
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
                                    width: '60px', height: '60px', margin: '0 auto 1rem', borderRadius: '4px', overflow: 'hidden'
                                }}>
                                    <div style={{ background: theme.light }}></div><div style={{ background: theme.dark }}></div>
                                    <div style={{ background: theme.dark }}></div><div style={{ background: theme.light }}></div>
                                </div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{theme.name}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technical Settings */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>⚙️ {t('audio_graphics')}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{t('sound_effects')}</span>
                            <input type="range" style={{ accentColor: 'var(--gold-primary)', width: '200px' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{t('background_music')}</span>
                            <input type="range" style={{ accentColor: 'var(--gold-primary)', width: '200px' }} />
                        </div>
                    </div>
                </section>

                {/* Language Settings */}
                <section className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>🌍 {t('language_settings')}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{t('select_language')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
                        {languages.map(lang => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                style={{
                                    padding: '0.8rem',
                                    background: language === lang.code ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                                    color: language === lang.code ? '#000' : '#fff',
                                    border: '1px solid var(--gold-border)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '0.9rem',
                                    transition: '0.3s'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default SettingsTab;
