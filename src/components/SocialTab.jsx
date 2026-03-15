import React, { useState, useEffect } from 'react';

const SocialTab = ({ currentUser }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputText, setInputText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const loadUsers = () => {
      try {
        const db = JSON.parse(localStorage.getItem('chess_prestige_users_db') || '{}');
        const userList = Object.values(db)
          .filter(u => u.username !== currentUser?.username)
          .map(u => ({
            id: u.username,
            name: u.username,
            status: Math.random() > 0.4 ? 'En Línea' : 'Desconectado',
            rank: u.rank || 'Bronce',
            avatar: u.avatar || '👤',
            activity: Math.random() > 0.6 ? 'Jugando Chess Prestige ♟️' : 'Explorando la Bóveda 🏦'
          }));
        setAllUsers(userList);
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };
    loadUsers();
  }, [currentUser]);

  const filteredFriends = allUsers.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  const openChat = (friend) => {
    setActiveChat(friend);
    if (!messages[friend.id]) {
      setMessages(prev => ({
        ...prev,
        [friend.id]: [{ sender: 'system', text: `Canal seguro establecido con ${friend.name} (Cifrado de extremo a extremo)`, time: 'Ahora' }]
      }));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = { 
        sender: 'me', 
        text: inputText, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));
    setInputText('');

    // Respuesta Simulada de "Realismo"
    setTimeout(() => {
      const responses = [
          "¡Hola! Buena partida la de hoy.",
          "¿Estás libre para un duelo de $5?",
          "He visto tu ELO, ¡impresionante!",
          "Estoy practicando aperturas, ¿me das un consejo?",
          "¡Chess Prestige es de otro nivel!"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      const reply = { 
          sender: activeChat.name, 
          text: randomReply, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: [...(prev[activeChat.id] || []), reply]
      }));
    }, 2000);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212, 175, 55, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--gold-border)' }}>
        <h2 className="heading-gold" style={{ margin: 0, fontSize: '1.2rem' }}>🌐 COMUNIDAD GLOBAL</h2>
        <div style={{ position: 'relative', width: '250px' }}>
          <input 
            type="text" 
            placeholder="Buscar por usuario..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ 
                width: '100%', padding: '0.6rem 2.5rem 0.6rem 1rem', 
                background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', 
                borderRadius: '20px', color: '#fff', fontSize: '0.85rem', outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {filteredFriends.length > 0 ? filteredFriends.map((friend) => (
          <div key={friend.id} className="card-gamer" style={{
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            borderLeft: `4px solid ${friend.status === 'En Línea' ? '#10b981' : '#4b5563'}`
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '45px', height: '45px', borderRadius: '50%',
                background: 'var(--bg-deep)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.4rem',
                border: '1px solid var(--gold-border)',
                position: 'relative',
                boxShadow: friend.status === 'En Línea' ? '0 0 10px rgba(16, 185, 129, 0.2)' : 'none'
              }}>
                {friend.avatar}
                <div style={{
                  position: 'absolute', bottom: '1px', right: '1px',
                  width: '10px', height: '10px', borderRadius: '50%',
                  background: friend.status === 'En Línea' ? '#10b981' : '#6b7280',
                  border: '2px solid var(--bg-dark)'
                }}></div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {friend.name}
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold-primary)' }}>
                        {friend.rank}
                    </span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{friend.activity}</div>
              </div>
            </div>
            <button
                onClick={() => openChat(friend)}
                style={{ 
                    padding: '0.6rem', 
                    background: 'rgba(212, 175, 55, 0.1)', 
                    border: '1px solid var(--gold-primary)', 
                    borderRadius: '50%', 
                    cursor: 'pointer', 
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    color: 'var(--gold-primary)'
                }}
            >
                💬
            </button>
          </div>
        )) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>🕵️</div>
                <p>No se encontraron jugadores que coincidan con la búsqueda.</p>
            </div>
        )}
      </div>

      {/* Ventana de Chat Flotante: Estilo Discord/Casino */}
      {activeChat && (
        <div className="glass-panel" style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '320px', height: '420px', zIndex: 2000,
          display: 'flex', flexDirection: 'column', border: '1px solid var(--gold-primary)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.9)', borderRadius: '15px', overflow: 'hidden'
        }}>
          <div style={{ 
              padding: '0.8rem 1rem', 
              background: 'linear-gradient(to right, var(--gold-brushed), #947e33)', 
              color: '#000', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontWeight: 'bold'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1rem' }}>{activeChat.avatar}</span>
                <span>{activeChat.name}</span>
            </div>
            <button onClick={() => setActiveChat(null)} style={{ background: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
          </div>

          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: 'rgba(5, 5, 5, 0.9)' }}>
            {(messages[activeChat.id] || []).map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.sender === 'system' ? 'center' : msg.sender === 'me' ? 'flex-end' : 'flex-start',
                textAlign: msg.sender === 'system' ? 'center' : 'left',
                maxWidth: msg.sender === 'system' ? '100%' : '85%',
                background: msg.sender === 'system' ? 'transparent' : msg.sender === 'me' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255,255,255,0.05)',
                padding: msg.sender === 'system' ? '0.2rem' : '0.8rem', 
                borderRadius: '12px',
                border: msg.sender === 'system' ? 'none' : msg.sender === 'me' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                fontSize: msg.sender === 'system' ? '0.65rem' : '0.85rem',
                color: msg.sender === 'system' ? 'var(--text-muted)' : '#fff'
              }}>
                {msg.text}
                {msg.sender !== 'system' && <div style={{ fontSize: '0.6rem', opacity: 0.4, marginTop: '4px', textAlign: 'right' }}>{msg.time}</div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '0.8rem', background: '#111', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              style={{ flex: 1, padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: '#fff', outline: 'none', fontSize: '0.85rem' }}
            />
            <button className="btn-play" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>ENVIAR</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default SocialTab;
