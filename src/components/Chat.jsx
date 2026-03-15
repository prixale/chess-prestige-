import { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';

const Chat = ({ socket, roomData }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
      sounds.click();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket]);

  useEffect(() => {
    // Scroll al último mensaje
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // IA Reactiva: Mensajes automáticos de la IA
  useEffect(() => {
    if (roomData?.mode === 'ai' && roomData?.roomId === 'local-ai') {
        const aiTaunts = {
            start: ["¡Suerte! La necesitarás.", "Veamos si estás a la altura.", "El piezas de oro no perdonan.", "Que gane el mejor."],
            check: ["¡Jaque! Mis cálculos son perfectos.", "¿No lo viste venir?", "Estás en aprietos.", "Cuidado con tu Rey."],
            capture: ["Una pieza menos para ti.", "Interesante sacrificio...", "Dominio total.", "Gracias por el regalo."],
            win: ["La perfección matemática siempre gana.", "Buen intento, humano.", "Vuelve cuando hayas practicado más."],
            loss: ["Imposible... mis algoritmos han fallado.", "Una victoria fortuita.", "Has jugado mejor de lo esperado."]
        };

        const sendAiMessage = (type) => {
            const pool = aiTaunts[type];
            const text = pool[Math.floor(Math.random() * pool.length)];
            const newMessage = {
                id: Date.now() + Math.random(),
                sender: `IA (${roomData.difficulty})`,
                text: text,
                time: new Date().toLocaleTimeString(),
                isAi: true
            };
            setMessages(prev => [...prev, newMessage]);
            sounds.click();
        };

        // Simular mensaje al inicio
        if (messages.length === 0) {
            setTimeout(() => sendAiMessage('start'), 1500);
        }

        // Suscribirse a eventos del juego para comentarios de la IA
        const handleAiReq = (e) => sendAiMessage(e.detail);
        window.addEventListener('aiChatReq', handleAiReq);
        return () => window.removeEventListener('aiChatReq', handleAiReq);
    }
  }, [roomData, messages.length]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageData = {
      text: inputValue,
      senderId: socket.id,
      roomId: roomData.roomId,
      color: roomData.color // 'w' o 'b'
    };

    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setInputValue('');
    sounds.click();
  };

  return (
    <div className="chat-container" style={{
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      border: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid var(--glass-border)',
        fontWeight: 'bold',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.05)'
      }}>
        Chat de la Sala
      </div>

      <div style={{
        flex: 1,
        padding: '1rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        {messages.map((msg, idx) => {
          const isMine = msg.senderId === socket.id;
          return (
            <div key={idx} style={{
              alignSelf: isMine ? 'flex-end' : 'flex-start',
              background: isMine ? 'linear-gradient(135deg, var(--gold-primary), var(--gold-accent))' : 'rgba(255,255,255,0.05)',
              color: isMine ? '#000' : '#fff',
              padding: '0.6rem 1rem',
              borderRadius: isMine ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              border: isMine ? 'none' : '1px solid rgba(212, 175, 55, 0.1)',
              maxWidth: '80%',
              wordBreak: 'break-word',
              fontSize: '0.9rem'
            }}>
              {msg.text}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{
        display: 'flex',
        padding: '0.5rem',
        borderTop: '1px solid var(--glass-border)'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            background: 'rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--gold-border)',
            outline: 'none',
            color: '#fff',
            padding: '0.7rem 1.2rem',
            borderRadius: '8px',
            marginRight: '0.5rem',
            fontSize: '0.85rem'
          }}
        />
        <button type="submit" style={{
          background: 'transparent',
          color: 'var(--gold-accent)',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          padding: '0 0.5rem'
        }}>
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Chat;
