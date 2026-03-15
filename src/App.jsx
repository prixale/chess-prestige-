import { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { io } from 'socket.io-client'
import './App.css'
import ChessBoard from './components/ChessBoard'
import Chat from './components/Chat'
import Login from './components/Login'
import Leaderboard from './components/Leaderboard'
import AdminDashboard from './components/AdminDashboard'
import SubscriptionPlans from './components/SubscriptionPlans'
import PromoAndEvents from './components/PromoAndEvents'
import SupportTab from './components/SupportTab'
import SocialTab from './components/SocialTab'
import WalletTab from './components/WalletTab'
import DealsTab from './components/DealsTab'
import Sidebar from './components/Sidebar'
import PotionsTab from './components/PotionsTab'
import OwnerPanel from './components/OwnerPanel'
import SettingsTab from './components/SettingsTab'
import StakesSelector from './components/StakesSelector'
import { sounds } from './utils/sounds'
import { getTranslation } from './utils/i18n'

// Conectar al servidor de Socket.io (Configurado para despliegue seguro)
const BACKEND_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) 
  ? import.meta.env.VITE_BACKEND_URL 
  : 'http://localhost:3001';
const socket = io(BACKEND_URL);

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('chess_prestige_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [roomData, setRoomData] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [showSubs, setShowSubs] = useState(false);
  const [activeTab, setActiveTab] = useState('play');

  // Customización de Perfil y Tablero
  const [userAvatar, setUserAvatar] = useState(currentUser?.avatar || '👤');
  const [boardTheme, setBoardTheme] = useState(currentUser?.boardTheme || 'wood');
  const [lotteryPrize, setLotteryPrize] = useState(0);
  const [currentStake, setCurrentStake] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [language, setLanguage] = useState(currentUser?.language || 'es');
  
  const t = (key) => getTranslation(language, key);
  const [globalSettings, setGlobalSettings] = useState(() => {
    const saved = localStorage.getItem('chess_prestige_global_settings');
    const defaults = {
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
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  // Efecto para actualizar settings cuando cambien en localStorage
  useEffect(() => {
    const syncSettings = () => {
        const saved = localStorage.getItem('chess_prestige_global_settings');
        if (saved) setGlobalSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
    };
    window.addEventListener('storage', syncSettings);
    return () => window.removeEventListener('storage', syncSettings);
  }, []);

  // --- Funciones de Utilidad (Definidas antes de su uso) ---
  const recordGlobalTransaction = (tx) => {
    try {
      const globalLog = JSON.parse(localStorage.getItem('chess_prestige_global_audit_log') || '[]');
      globalLog.unshift({ ...tx, timestamp: new Date().toISOString() });
      localStorage.setItem('chess_prestige_global_audit_log', JSON.stringify(globalLog.slice(0, 50)));
    } catch (e) {
      console.error('Audit log failed', e);
    }
  };

  const syncUserDB = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('chess_prestige_user', JSON.stringify(updatedUser));
    if (updatedUser.username && !updatedUser.username.startsWith('Invitado')) {
      const db = JSON.parse(localStorage.getItem('chess_prestige_users_db') || '{}');
      const key = updatedUser.username.toLowerCase();
      if (db[key]) {
        db[key] = { ...db[key], ...updatedUser };
        localStorage.setItem('chess_prestige_users_db', JSON.stringify(db));
      }
    }
  };

  const handleGameEnd = (eloChange) => {
    // 1. Cargar configuraciones globales
    const settings = JSON.parse(localStorage.getItem('chess_prestige_global_settings') || '{"commission": 10, "jackpotMult": 1}');
    
    // 2. Calcular Beneficios VIP reales
    const userRole = currentUser?.rank || 'Bronce';
    let vipBonus = 1.0;
    let commissionDiscount = 0;

    if (userRole === 'Diamante') { vipBonus = 2.0; commissionDiscount = 0.5; }
    else if (userRole === 'VIP Platinum') { vipBonus = 1.5; commissionDiscount = 0.3; }
    else if (userRole === 'Oro') { vipBonus = 1.25; commissionDiscount = 0.15; }

    // 3. Actualizar balance por ELO y APUESTA (Aplicando Comisión VIP)
    let baseWin = 0;
    if (eloChange > 0 && currentStake) {
      const globalComm = settings.commission / 100;
      const actualComm = globalComm * (1 - commissionDiscount);
      baseWin = currentStake.prize * (1 - actualComm);
    }

    // 4. Lógica de LOTERÍA AL AZAR (Aplicando Multiplicador VIP)
    const roll = Math.random();
    let prize = 0;
    const baseJackpot = 1000 * settings.jackpotMult;
    
    // Probabilidades mejoradas para VIPs
    const threshold = userRole === 'Diamante' ? 0.95 : userRole === 'VIP Platinum' ? 0.97 : 0.98;

    if (roll > threshold) prize = baseJackpot * vipBonus; 
    else if (roll > 0.85) prize = 50 * settings.jackpotMult * vipBonus;
    else if (roll > 0.65) prize = 10 * settings.jackpotMult * vipBonus;
    else if (roll > 0.35) prize = 2 * settings.jackpotMult * vipBonus;

    setLotteryPrize(prize);

    const totalAward = baseWin + prize;
    const newTransactions = [...(currentUser.transactions || [])];
    
    if (baseWin > 0) {
      newTransactions.unshift({
        type: `Victoria: ${currentStake?.name || 'Mesa'}`,
        amount: baseWin,
        date: new Date().toLocaleTimeString(),
        icon: '♟️'
      });
    }
    
    if (prize > 0) {
      newTransactions.unshift({
        type: prize === 1000 ? '🎰 ¡JACKPOT MAYOR!' : '🎰 Premio Lotería',
        amount: prize,
        date: new Date().toLocaleTimeString(),
        icon: '💎'
      });
    }

    const updatedUser = { 
      ...currentUser, 
      balance: (currentUser.balance || 0) + totalAward, 
      elo: (currentUser.elo || 0) + eloChange,
      transactions: newTransactions.slice(0, 20)
    };
    
    syncUserDB(updatedUser);
    
    // Auditoría Global
    recordGlobalTransaction({
      user: updatedUser.username,
      type: 'Resultado Partida',
      amount: totalAward,
      details: `Base: ${baseWin}, Jackpot: ${prize}`
    });
  };

  useEffect(() => {
    socket.on('waiting', (data) => {
      setWaiting(true);
    });

    socket.on('gameStart', (data) => {
      sounds.gameStart();
      setWaiting(false);
      setRoomData(data); // { color: 'w' o 'b', roomId: ... }
    });

    socket.on('opponentDisconnected', () => {
      alert('Tu oponente se ha desconectado. Fin de la partida.');
      setRoomData(null);
      setWaiting(false);
    });

    // PWA Install Prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    return () => {
      socket.off('waiting');
      socket.off('gameStart');
      socket.off('opponentDisconnected');
    };
  }, []);

  const handleStartMatchmaking = () => {
    socket.disconnect();
    socket.connect();
  };

  const handleLogin = (userData) => {
    sounds.gameStart();
    setCurrentUser(userData);
    localStorage.setItem('chess_prestige_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    if (window.confirm(t('logout_confirm'))) {
      sounds.defeat();
      setCurrentUser(null);
      setRoomData(null);
      localStorage.removeItem('chess_prestige_user');
    }
  };

  const handleSubscribe = (planName) => {
    let newRank = 'Bronce';
    let cost = 0;
    if (planName.includes('VIP Platinum')) { newRank = 'VIP Platinum'; cost = 19.99; }
    else if (planName.includes('Diamante Supremo')) { newRank = 'Diamante'; cost = 99.99; }

    if (currentUser.balance < cost) {
      alert('Saldo insuficiente para esta suscripción de élite.');
      return;
    }

    const updatedUser = { 
      ...currentUser, 
      rank: newRank, 
      balance: currentUser.balance - cost,
      transactions: [
        { type: `Suscripción: ${newRank}`, amount: -cost, date: new Date().toLocaleTimeString(), icon: '💎' },
        ...(currentUser.transactions || [])
      ]
    };
    syncUserDB(updatedUser);
    alert(`¡Felicitaciones! Ahora tienes el rango ${newRank}. Disfruta de tus beneficios.`);
    setShowSubs(false);
  };

  // --- Fin Funciones de Utilidad ---

  if (!currentUser) {
    return (
      <div className="app-container">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  // Pantalla de Mantenimiento para usuarios normales
  if (maintenanceMode && currentUser?.role !== 'admin') {
    return (
      <div style={{
        height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', background: '#0a0a0c', color: '#fff'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 2s infinite' }}>🏗️</div>
        <h1 className="heading-gold" style={{ fontSize: '2.5rem' }}>MANTENIMIENTO ÉLITE</h1>
        <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Estamos puliendo las piezas de oro. Regresa pronto.</p>
        <div style={{ marginTop: '2rem', width: '200px', height: '2px', background: 'var(--gold-primary)', borderRadius: '2px' }}></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          globalSettings={globalSettings}
          t={t}
        />

        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="heading-gold" style={{ fontSize: '1.2rem', margin: 0 }}>LEVEL UP <span style={{ fontWeight: '400', fontSize: '0.8rem', opacity: 0.7 }}>{t('header_hub')}</span></h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div>{new Date().toLocaleTimeString()} | {new Date().toLocaleDateString()}</div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.5rem 1rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              border: '1px solid var(--gold-border)'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--gold-brushed)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem',
                border: '1px solid var(--gold-primary)'
              }}>👤</div>
              <div>
                <div style={{ fontWeight: 'bold' }}>{currentUser.username}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--gold-primary)' }}>{currentUser.rank} ({currentUser.elo})</div>
              </div>
            </div>

            <button className="btn-play" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setShowSubs(true)}>
              {t('premium_btn')}
            </button>

            {deferredPrompt && (
              <button 
                className="btn-play" 
                style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', background: 'var(--gold-accent)', color: '#000' }} 
                onClick={async () => {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  if (outcome === 'accepted') setDeferredPrompt(null);
                }}
                title="Descargar App"
              >
                📲
              </button>
            )}
          </div>
        </header>

        <main className="main-content">
          {/* Universal Back Button for Tabs */}
          {activeTab !== 'play' && (
            <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', justifyContent: 'flex-start' }}>
              <button 
                onClick={() => { sounds.click(); setActiveTab('play'); }}
                className="btn-play"
                style={{ 
                  padding: '0.6rem 1.2rem', 
                  fontSize: '0.8rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid var(--gold-border)',
                  color: 'var(--gold-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(212, 175, 55, 0.1)'; e.target.style.transform = 'translateX(-5px)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.transform = 'translateX(0)'; }}
              >
                {t('back_button')}
              </button>
            </div>
          )}

          {showSubs && (
            <SubscriptionPlans
              onClose={() => setShowSubs(false)}
              onSubscribe={handleSubscribe}
            />
          )}

          {activeTab === 'wallet' && globalSettings.tabsVisibility.wallet && (
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h2 className="heading-gold" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('vault_title')}</h2>
              <WalletTab
                balance={currentUser.balance || 0}
                transactions={currentUser.transactions || []}
                currency={currentUser.currency || 'USD'}
                onWithdraw={(wAmount) => {
                  sounds.click();
                  const tx = { type: 'Retiro Capital', amount: -wAmount, date: new Date().toLocaleTimeString(), icon: '📤' };
                  const updatedUser = { 
                    ...currentUser, 
                    balance: (currentUser.balance || 0) - wAmount,
                    transactions: [tx, ...(currentUser.transactions || [])].slice(0, 20)
                  };
                  syncUserDB(updatedUser);
                  alert('Retiro procesado con éxito. Los fondos llegarán pronto.');
                }}
                onDeposit={(dAmount) => {
                  sounds.coin();
                  const tx = { type: 'Depósito Tarjeta', amount: dAmount, date: new Date().toLocaleTimeString(), icon: '💳' };
                  const updatedUser = { 
                    ...currentUser, 
                    balance: (currentUser.balance || 0) + dAmount,
                    transactions: [tx, ...(currentUser.transactions || [])].slice(0, 20)
                  };
                  syncUserDB(updatedUser);
                  alert('Depósito confirmado. Su saldo ha sido actualizado.');
                }}
              />
            </div>
          )}

          {activeTab === 'potions' && globalSettings.tabsVisibility.potions && (
            <PotionsTab 
              user={currentUser} 
              onPurchase={(potion) => {
                sounds.coin();
                const tx = { type: `Compra: ${potion.name}`, amount: -potion.price, date: new Date().toLocaleTimeString(), icon: '🧪' };
                const updatedUser = {
                  ...currentUser,
                  balance: currentUser.balance - potion.price,
                  inventory: [...(currentUser.inventory || []), potion],
                  transactions: [tx, ...(currentUser.transactions || [])].slice(0, 20)
                };
                syncUserDB(updatedUser);
                alert(`¡${potion.name} adquirida! Se ha añadido a tu inventario.`);
              }}
            />
          )}

          {activeTab === 'earnings' && currentUser.role === 'admin' && (
            <OwnerPanel
              maintenanceMode={maintenanceMode}
              setMaintenanceMode={setMaintenanceMode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              user={currentUser}
              language={language}
              setLanguage={(l) => {
                  setLanguage(l);
                  syncUserDB({ ...currentUser, language: l });
              }}
              setUser={(updated) => {
                setCurrentUser(updated);
                localStorage.setItem('chess_prestige_user', JSON.stringify(updated));
                setUserAvatar(updated.avatar);
                setBoardTheme(updated.boardTheme);
              }}
              t={t}
            />
          )}


          {activeTab === 'social' && globalSettings.tabsVisibility.social && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-gold" style={{ marginBottom: '2rem' }}>COMMAND CENTER - COMUNIDAD REAL</h2>
              <SocialTab currentUser={currentUser} />
            </div>
          )}

          {activeTab === 'events' && globalSettings.tabsVisibility.events && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-gold" style={{ marginBottom: '2rem' }}>💎 BAZAR DE ÉLITE & RECOMPENSAS</h2>
              <DealsTab 
                currentUser={currentUser} 
                onReward={(reward) => {
                    const amountStr = reward.replace(/[^0-9.]/g, '');
                    const amount = parseFloat(amountStr) || 0;
                    const updatedUser = { 
                        ...currentUser, 
                        balance: currentUser.balance + amount,
                        transactions: [
                            { type: `Recompensa: ${reward}`, amount: amount, date: new Date().toLocaleTimeString(), icon: '🎁' },
                            ...(currentUser.transactions || [])
                        ]
                    };
                    syncUserDB(updatedUser);
                    alert(`¡Recompensa de ${reward} acreditada en tu cuenta!`);
                }}
              />
            </div>
          )}

          {activeTab === 'support' && globalSettings.tabsVisibility.support && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 className="heading-gold" style={{ marginBottom: '2rem' }}>ELITE SUPPORT</h2>
              <SupportTab />
            </div>
          )}

          {activeTab === 'play' && (
            !roomData ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                <StakesSelector
                  balance={currentUser.balance}
                  onSelect={(tier) => {
                    setCurrentStake(tier);
                    const updatedUser = { ...currentUser, balance: currentUser.balance - tier.fee };
                    setCurrentUser(updatedUser);
                    localStorage.setItem('chess_prestige_user', JSON.stringify(updatedUser));
                    handleStartMatchmaking();
                  }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                  <div style={{ gridColumn: '1 / -1', textAlign: 'left' }}>
                    <h3 className="heading-gold" style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t('practice_tables')}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Entrena sin arriesgar tu saldo. Perfecciona tu estilo antes de apostar fuerte.</p>
                  </div>
                  {[
                    { diff: 'easy', title: 'MESA ROOKIE', img: '🎲', color: '#10b981', desc: 'Apuestas de baja intensidad. Ideal para calentar.', badge: 'FÁCIL' },
                    { diff: 'medium', title: 'MESA VIP', img: '🃏', color: 'var(--gold-primary)', desc: 'Estrategia de nivel medio. El casino se pone serio.', badge: 'MEDIO' },
                    { diff: 'hard', title: 'HIGH ROLLER TABLE', img: '💎', color: '#ef4444', desc: 'Solo para leyendas. La máquina no perdona.', badge: 'EXPERTO' }
                  ].map(ai => (
                    <div key={ai.diff} className="card-gamer" style={{
                      padding: '1.5rem', cursor: 'pointer', position: 'relative',
                      background: 'linear-gradient(180deg, rgba(0,80,20,0.15) 0%, rgba(0,0,0,0.4) 100%)',
                      borderTop: `3px solid ${ai.color}`
                    }} onClick={() => setRoomData({ mode: 'ai', difficulty: ai.diff, color: 'w', roomId: 'local-ai' })}>
                      <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.55rem', background: ai.color, color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{ai.badge}</div>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ai.img}</div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem', color: ai.color }}>{ai.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{ai.desc}</p>
                      <button className="btn-play" style={{ marginTop: '1rem', width: '100%', fontSize: '0.7rem', background: 'linear-gradient(135deg, rgba(0,80,20,0.6), rgba(0,0,0,0.8))', border: `1px solid ${ai.color}` }}>JUGAR GRATIS</button>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="heading-gold" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>NEWS & UPDATES</h3>
                    <PromoAndEvents />
                  </div>
                  <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h3 className="heading-gold" style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>COMMUNITY FEED</h3>
                    <SocialTab currentUser={currentUser} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ textAlign: 'left', margin: 0 }}>
                    {roomData.mode === 'ai' ? (
                      <span>{t('vs_ai')} <span style={{ color: 'var(--gold-accent)', fontSize: '0.8rem', textTransform: 'uppercase' }}>({roomData.difficulty})</span></span>
                    ) : (
                      <span>Partida Online - Stakes: <span style={{ color: 'var(--gold-accent)' }}>{currentStake?.name || 'Standard'}</span></span>
                    )}
                  </h3>
                  <button
                    onClick={() => {
                      sounds.click();
                      if (window.confirm(t('abandon_confirm'))) {
                        sounds.defeat();
                        setRoomData(null);
                        setWaiting(false);
                        setCurrentStake(null);
                      }
                    }}
                    style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer' }}
                  >Abandonar</button>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 1000 ? 'column' : 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  gap: '2rem',
                  padding: '1rem',
                  maxWidth: '100%',
                  margin: '0 auto'
                }}>
                  {/* Lado Izquierdo: Tablero */}
                  <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center' }}>
                    <ChessBoard
                      socket={socket}
                      roomData={roomData}
                      boardTheme={boardTheme}
                      onGameEnd={handleGameEnd}
                      lotteryPrize={lotteryPrize}
                      currentStake={currentStake}
                    />
                  </div>

                  {/* Lado Derecho: Chat & Detalles */}
                  <div style={{
                    flex: '0 0 350px',
                    width: window.innerWidth < 1000 ? '100%' : '350px',
                    height: window.innerWidth < 1000 ? '500px' : 'calc(min(85vw, 420px) + 120px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <div className="glass-panel" style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      border: '1px solid var(--gold-border)'
                    }}>
                      <div style={{ padding: '0.8rem', background: 'rgba(212, 175, 55, 0.1)', borderBottom: '1px solid var(--gold-border)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        💬 CHAT EN TIEMPO REAL
                      </div>
                      <Chat socket={socket} roomData={roomData} />
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem', fontSize: '0.75rem', textAlign: 'left' }}>
                      <h4 style={{ color: 'var(--gold-primary)', marginBottom: '0.5rem' }}>DETALLES DE LA MESA</h4>
                      <div style={{ color: 'rgba(255,255,255,0.6)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div>• Conexión: <span style={{ color: '#10b981' }}>Estable (SSL)</span></div>
                        <div>• Stake: {currentStake?.name || (roomData.mode === 'ai' ? 'Free Play' : 'Casual')}</div>
                        <div>• Oponente: {roomData.mode === 'ai' ? `IA (${roomData.difficulty})` : 'Humano'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

        </main >
      </div >
    </DndProvider >
  )
}

export default App
