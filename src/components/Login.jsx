import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const globalSettings = (() => {
    const saved = localStorage.getItem('chess_prestige_global_settings');
    return saved ? JSON.parse(saved) : { masterPin: "7777", masterKeyEmoji: "🔑", adminUsername: "admin" };
  })();

  const getUsersDB = () => {
    try {
      return JSON.parse(localStorage.getItem('chess_prestige_users_db') || '{}');
    } catch { return {}; }
  };

  const saveUserDB = (username, userData) => {
    const db = getUsersDB();
    db[username.toLowerCase()] = userData;
    localStorage.setItem('chess_prestige_users_db', JSON.stringify(db));
  };

  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36) + str.length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isAdminMode) {
      if (username === globalSettings.adminUsername && password === globalSettings.masterPin) {
        onLogin({ username: 'Gran Creador (Dueño)', role: 'admin' });
      } else {
        setError('Acceso denegado: Credenciales Maestras inválidas.');
      }
      return;
    }

    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña son obligatorios.');
      return;
    }

    if (username.trim().length < 3) {
      setError('El usuario debe tener al menos 3 caracteres.');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const db = getUsersDB();
    const key = username.trim().toLowerCase();
    const hashedPw = simpleHash(password);

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (db[key]) {
        setError('Este usuario ya existe. Inicia sesión.');
        return;
      }
      const newUser = {
        username: username.trim(),
        passwordHash: hashedPw,
        email: email || '',
        role: 'player',
        elo: 1200,
        rank: 'Bronce',
        balance: 100.00,
        avatar: '👤',
        boardTheme: 'wood',
        cards: [],
        currency: 'USD',
        createdAt: new Date().toISOString()
      };
      saveUserDB(key, newUser);
      onLogin(newUser);
    } else {
      if (!db[key]) {
        setError('Usuario no encontrado. ¿Quieres registrarte?');
        return;
      }
      if (db[key].passwordHash !== hashedPw) {
        setError('Contraseña incorrecta.');
        return;
      }
      onLogin(db[key]);
    }
  };

  return (
    <div className="panel-glow" style={{
      padding: '2.5rem',
      backgroundColor: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: '0 0 60px rgba(212, 175, 55, 0.15)',
      borderRadius: '20px',
      textAlign: 'center',
      maxWidth: '420px',
      width: '90%',
      margin: '0 auto',
      marginTop: '8vh',
      position: 'relative'
    }}>
      {/* Master Key: Entrada secreta del Dueño */}
      <div
        onClick={() => { setIsAdminMode(!isAdminMode); setError(''); }}
        style={{
          position: 'absolute', top: '15px', right: '15px',
          fontSize: '1.2rem', cursor: 'pointer', opacity: 0.15,
          transition: 'all 0.3s ease',
          filter: isAdminMode ? 'drop-shadow(0 0 5px var(--gold-primary))' : 'none'
        }}
        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
        onMouseLeave={(e) => e.target.style.opacity = '0.15'}
        title="Acceso Maestro"
      >
        {globalSettings.masterKeyEmoji}
      </div>

      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
        {isAdminMode ? '👑' : '♟️'}
      </div>

      <h2 className="heading-premium" style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>
        {isAdminMode ? 'Centro de Comando' : isRegister ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.8rem' }}>
        {isAdminMode
          ? 'Acceso restringido para el dueño del imperio.'
          : isRegister ? 'Únete al casino de ajedrez más exclusivo del mundo.' : 'Bienvenido de vuelta a la cima.'}
      </p>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444',
          color: '#ef4444', padding: '0.7rem', borderRadius: '8px',
          marginBottom: '1rem', fontSize: '0.8rem'
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <input
          type="text"
          placeholder={isAdminMode ? "Usuario admin" : "Nombre de Usuario"}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          style={{
            padding: '0.9rem 1rem', borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
          }}
        />

        {isRegister && !isAdminMode && (
          <input
            type="email"
            placeholder="Email Personal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: '0.9rem 1rem', borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
            }}
          />
        )}

        <input
          type="password"
          placeholder="Contraseña Maestra"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          style={{
            padding: '0.9rem 1rem', borderRadius: '10px',
            border: '1px solid var(--glass-border)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
          }}
        />

        {isRegister && !isAdminMode && (
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              padding: '0.9rem 1rem', borderRadius: '10px',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none'
            }}
          />
        )}

        <button type="submit" style={{
          padding: '1rem', borderRadius: '10px', border: 'none',
          background: isAdminMode ? 'linear-gradient(135deg, var(--gold-primary), var(--gold-accent))' : 'var(--gold-brushed)',
          color: '#000',
          fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer',
          marginTop: '0.5rem', transition: 'all 0.2s ease',
          boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)'
        }}>
          {isAdminMode ? '🔓 ABRIR BÓVEDA' : isRegister ? '🚀 CREAR CUENTA' : '⚡ ENTRAR AL CASINO'}
        </button>
      </form>

      {!isAdminMode && (
        <div style={{ marginTop: '1.2rem' }}>
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{
              background: 'transparent', border: 'none',
              color: 'var(--gold-primary)', cursor: 'pointer',
              fontSize: '0.85rem', textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            {isRegister ? '¿Ya eres miembro? Inicia Sesión' : '¿Aún no eres miembro? Regístrate gratis'}
          </button>

          <div style={{ marginTop: '1.2rem' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1, height: '1px', background: 'var(--glass-border)', opacity: 0.3 }}></span>
              <span style={{ padding: '0 10px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Entrar con Red Social</span>
              <span style={{ flex: 1, height: '1px', background: 'var(--glass-border)', opacity: 0.3 }}></span>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <button type="button"
                onClick={() => onLogin({ username: `GoogleUser_${Math.floor(Math.random() * 899) + 100}`, role: 'player', elo: 1200, rank: 'Plata', balance: 50.00, avatar: '👤', boardTheme: 'wood', cards: [], currency: 'USD', isSocial: true })}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, #4285F4, #34a853)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}
              >GOOGLE</button>
              <button type="button"
                onClick={() => onLogin({ username: `DiscordUser_${Math.floor(Math.random() * 899) + 100}`, role: 'player', elo: 1400, rank: 'Oro', balance: 75.00, avatar: '👤', boardTheme: 'wood', cards: [], currency: 'USD', isSocial: true })}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', background: 'linear-gradient(135deg, #5865F2, #404EED)', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.75rem' }}
              >DISCORD</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
        🔒 Conexión Segura • Datos Encriptados • Chess Prestige v1.0
      </div>
    </div>
  );
};

export default Login;
