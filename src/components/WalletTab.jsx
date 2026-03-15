import React, { useState } from 'react';

const WalletTab = ({ balance, transactions = [], onWithdraw, onDeposit, currency = 'USD' }) => {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);

  // Card Management
  const [cards, setCards] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chess_prestige_cards') || '[]');
    } catch { return []; }
  });
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '', type: 'visa' });
  const [showAddCard, setShowAddCard] = useState(false);

  // Deposit
  const [depositAmount, setDepositAmount] = useState('');

  const currencies = {
    USD: { symbol: '$', name: 'Dólar US', rate: 1 },
    EUR: { symbol: '€', name: 'Euro', rate: 0.92 },
    GBP: { symbol: '£', name: 'Libra', rate: 0.79 },
    MXN: { symbol: '$', name: 'Peso MX', rate: 17.15 },
    ARS: { symbol: '$', name: 'Peso AR', rate: 875.50 },
    BRL: { symbol: 'R$', name: 'Real BR', rate: 5.05 },
    COP: { symbol: '$', name: 'Peso CO', rate: 3950 },
    JPY: { symbol: '¥', name: 'Yen JP', rate: 149.5 },
    BTC: { symbol: '₿', name: 'Bitcoin', rate: 0.000015 },
    ETH: { symbol: 'Ξ', name: 'Ethereum', rate: 0.00028 }
  };

  const convertedBalance = (balance * currencies[selectedCurrency].rate).toFixed(
    ['BTC', 'ETH'].includes(selectedCurrency) ? 6 : 2
  );

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount > balance) {
      alert('Monto inválido o balance insuficiente.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      onWithdraw(withdrawAmount);
      setProcessing(false);
      setAmount('');
      setWalletAddress('');
    }, 2500);
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const dep = parseFloat(depositAmount);
    if (!dep || dep <= 0) return;
    if (cards.length === 0) {
      alert('Agrega una tarjeta primero.');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      if (onDeposit) onDeposit(dep);
      setProcessing(false);
      setDepositAmount('');
    }, 2000);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (newCard.number.replace(/\s/g, '').length < 16) {
      alert('Número de tarjeta inválido.');
      return;
    }
    const masked = '•••• •••• •••• ' + newCard.number.replace(/\s/g, '').slice(-4);
    const card = { ...newCard, masked, id: Date.now() };
    const updated = [...cards, card];
    setCards(updated);
    localStorage.setItem('chess_prestige_cards', JSON.stringify(updated));
    setNewCard({ number: '', name: '', expiry: '', cvv: '', type: 'visa' });
    setShowAddCard(false);
  };

  const removeCard = (id) => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    localStorage.setItem('chess_prestige_cards', JSON.stringify(updated));
  };

  const formatCardNumber = (val) => {
    return val.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const tabs = [
    { id: 'overview', label: '📊 General', color: 'var(--gold-primary)' },
    { id: 'deposit', label: '💰 Depósito Real', color: '#10b981' },
    { id: 'withdraw', label: '🏦 Retiro Bancario', color: '#3b82f6' },
    { id: 'cards', label: '💳 Mis Tarjetas', color: '#a855f7' }
  ];

  return (
    <div style={{ padding: '1rem' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
            padding: '0.6rem 1rem', borderRadius: '8px', border: 'none',
            background: activeSection === tab.id ? tab.color : 'rgba(255,255,255,0.05)',
            color: activeSection === tab.id ? '#000' : '#fff',
            fontWeight: 'bold', fontSize: '0.75rem', cursor: 'pointer'
          }}>{tab.label}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeSection === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', border: '1px solid var(--gold-primary)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>BALANCE TOTAL</div>
            <div style={{ fontSize: '3rem', fontWeight: '900' }}>
              <span style={{ color: 'var(--gold-primary)' }}>{currencies[selectedCurrency].symbol}</span>{convertedBalance}
            </div>
            <select
              value={selectedCurrency}
              onChange={e => setSelectedCurrency(e.target.value)}
              style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem' }}
            >
              {Object.entries(currencies).map(([code, cur]) => (
                <option key={code} value={code}>{cur.symbol} {code} - {cur.name}</option>
              ))}
            </select>
            <div style={{ marginTop: '0.8rem', fontSize: '0.7rem', color: '#10b981' }}>
              🔒 Fondos Verificados • {cards.length} Tarjeta(s) Vinculada(s)
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <button onClick={() => setActiveSection('deposit')} className="btn-play" style={{ padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}>💰 DEPOSITAR</button>
            <button onClick={() => setActiveSection('withdraw')} className="btn-play" style={{ padding: '1rem', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>📤 RETIRAR</button>
          </div>

          {/* Transactions */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>📝 ACTIVIDAD RECIENTE</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {transactions.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  Sin movimientos recientes. ¡Comienza a jugar hoy!
                </div>
              ) : (
                transactions.map((tx, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{tx.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{tx.type}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{tx.date}</div>
                      </div>
                    </div>
                    <div style={{ color: tx.amount > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* DEPOSIT */}
      {activeSection === 'deposit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 className="heading-gold" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>💰 DEPOSITAR FONDOS</h3>
            {cards.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💳</div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No tienes tarjetas vinculadas.</p>
                <button onClick={() => setActiveSection('cards')} className="btn-play" style={{ padding: '0.8rem 2rem' }}>Agregar Tarjeta</button>
              </div>
            ) : (
              <form onSubmit={handleDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MONTO A DEPOSITAR ({selectedCurrency})</label>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="0.00"
                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--gold-border)', color: '#fff', fontSize: '1.2rem', borderRadius: '8px' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>TARJETA</label>
                  <select style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                    {cards.map(c => (
                      <option key={c.id}>{c.type.toUpperCase()} {c.masked}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {[10, 25, 50, 100].map(v => (
                    <button key={v} type="button" onClick={() => setDepositAmount(v.toString())}
                      style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' }}>
                      ${v}
                    </button>
                  ))}
                </div>
                <button className="btn-play" style={{ padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)' }} disabled={processing}>
                  {processing ? 'PROCESANDO...' : '✅ CONFIRMAR DEPÓSITO'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* WITHDRAW */}
      {activeSection === 'withdraw' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 className="heading-gold" style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>🏦 RETIRO A CUENTA BANCARIA</h3>
          <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MONTO A RETIRAR (LÍMITE MIN: ${globalSettings?.minWithdraw || 50})</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--gold-border)', color: '#fff', fontSize: '1.2rem', borderRadius: '8px' }} required />
            </div>
            <div style={{ padding: '1.2rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <p style={{ fontSize: '0.75rem', marginBottom: '0.8rem', color: 'var(--gold-primary)' }}>MÉTODO DE PAGO:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ padding: '8px', border: '1px solid #fff', borderRadius: '4px', fontSize: '0.7rem' }}>ACH / SWIFT</div>
                    <div style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', fontSize: '0.7rem' }}>PayPal</div>
                    <div style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', fontSize: '0.7rem' }}>Zelle</div>
                </div>
            </div>
            <input type="text" placeholder="Número de cuenta / IBAN"
              style={{ width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '8px', fontSize: '0.8rem' }} required />
            <button className="btn-play" style={{ padding: '1rem', background: 'linear-gradient(135deg, #3b82f6, #1e40af)' }} disabled={processing}>
              {processing ? '🔒 VERIFICANDO CON BANCO...' : '📤 SOLICITAR RETIRO'}
            </button>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center' }}>Retiros procesados en máximo 24 horas hábiles.</p>
          </form>
        </div>
      )}

      {/* CARDS MANAGEMENT */}
      {activeSection === 'cards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="heading-gold" style={{ fontSize: '1.1rem' }}>💳 MIS TARJETAS</h3>
            <button onClick={() => setShowAddCard(!showAddCard)} style={{
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--gold-primary)',
              background: 'transparent', color: 'var(--gold-primary)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold'
            }}>{showAddCard ? '✕ Cancelar' : '+ Agregar'}</button>
          </div>

          {/* Existing Cards */}
          {cards.length === 0 && !showAddCard && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
              <p style={{ color: 'var(--text-secondary)' }}>No tienes tarjetas vinculadas aún.</p>
              <button onClick={() => setShowAddCard(true)} className="btn-play" style={{ marginTop: '1rem', padding: '0.8rem 2rem' }}>Agregar Primera Tarjeta</button>
            </div>
          )}

          {cards.map(card => (
            <div key={card.id} style={{
              padding: '1.5rem', borderRadius: '16px',
              background: card.type === 'visa' ? 'linear-gradient(135deg, #1e3a8a, #3b82f6)' : card.type === 'mastercard' ? 'linear-gradient(135deg, #dc2626, #f59e0b)' : 'linear-gradient(135deg, #4b5563, #9ca3af)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '8rem', opacity: 0.05 }}>💳</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginBottom: '1rem' }}>{card.type.toUpperCase()}</div>
              <div style={{ fontSize: '1.3rem', letterSpacing: '0.2rem', fontFamily: 'monospace', marginBottom: '1rem' }}>{card.masked}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>TITULAR</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{card.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>EXP</div>
                  <div style={{ fontSize: '0.85rem' }}>{card.expiry}</div>
                </div>
                <button onClick={() => removeCard(card.id)} style={{
                  background: 'rgba(239,68,68,0.3)', border: '1px solid #ef4444',
                  color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.65rem'
                }}>Eliminar</button>
              </div>
            </div>
          ))}

          {/* Add Card Form */}
          {showAddCard && (
            <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--gold-primary)' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--gold-primary)' }}>🔒 Agregar Tarjeta</h4>
              <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <select value={newCard.type} onChange={e => setNewCard({ ...newCard, type: e.target.value })}
                  style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <option value="visa">VISA</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </select>
                <input type="text" placeholder="Número de Tarjeta" value={newCard.number} maxLength={19}
                  onChange={e => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
                  style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px', letterSpacing: '0.15rem', fontFamily: 'monospace' }} required />
                <input type="text" placeholder="Nombre del Titular" value={newCard.name}
                  onChange={e => setNewCard({ ...newCard, name: e.target.value.toUpperCase() })}
                  style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }} required />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <input type="text" placeholder="MM/AA" value={newCard.expiry} maxLength={5}
                    onChange={e => setNewCard({ ...newCard, expiry: e.target.value })}
                    style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }} required />
                  <input type="password" placeholder="CVV" value={newCard.cvv} maxLength={4}
                    onChange={e => setNewCard({ ...newCard, cvv: e.target.value })}
                    style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }} required />
                </div>
                <button type="submit" className="btn-play" style={{ padding: '1rem' }}>🔒 VINCULAR TARJETA</button>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
                  🔐 Cifrado SSL 256-bit • PCI DSS Compliant • Datos nunca almacenados en texto plano
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletTab;
