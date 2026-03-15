import React from 'react';
import { sounds } from '../utils/sounds';

const Sidebar = ({ activeTab, setActiveTab, onLogout, globalSettings, t }) => {
    const allItems = [
        { id: 'play', label: t('sidebar_home'), icon: '🏠' },
        { id: 'potions', label: t('sidebar_alchemy'), icon: '🧪' },
        { id: 'social', label: t('sidebar_community'), icon: '👥' },
        { id: 'events', label: t('sidebar_bazaar'), icon: '💎' },
        { id: 'wallet', label: t('sidebar_wallet'), icon: '💼' },
        { id: 'support', label: t('sidebar_support'), icon: '🛡️' }
    ];

    const menuItems = allItems.filter(item => globalSettings?.tabsVisibility?.[item.id] !== false);

    // Panel de ganancias exclusivo para el dueño (admin)
    const isOwner = localStorage.getItem('chess_prestige_user') && JSON.parse(localStorage.getItem('chess_prestige_user')).role === 'admin';

    return (
        <div className="sidebar">
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '900',
                    color: 'var(--gold-primary)',
                    letterSpacing: '3px',
                    marginBottom: '2rem'
                }}>
                    PRESTIGE
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                {menuItems.map(item => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                        onClick={(e) => {
                            e.preventDefault();
                            sounds.click();
                            setActiveTab(item.id);
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        {item.label}
                    </a>
                ))}
                {isOwner && (
                    <a
                        href="#earnings"
                        className={`sidebar-link ${activeTab === 'earnings' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); sounds.click(); setActiveTab('earnings'); }}
                        style={{ marginTop: '1rem', borderTop: '1px solid rgba(212, 175, 55, 0.1)', color: 'var(--gold-primary)' }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>📊</span> Earnings Panel
                    </a>
                )}
            </nav>

            <div style={{ padding: '1rem 0', borderTop: '1px solid var(--gold-border)' }}>
                <a
                    href="#settings"
                    className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                    onClick={(e) => { e.preventDefault(); sounds.click(); setActiveTab('settings'); }}
                >
                    ⚙️ {t('sidebar_settings')}
                </a>
                <a
                    href="#logout"
                    className="sidebar-link"
                    style={{ color: '#ef4444' }}
                    onClick={(e) => {
                        e.preventDefault();
                        sounds.defeat();
                        onLogout();
                    }}
                >
                    🚪 {t('sidebar_logout')}
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
