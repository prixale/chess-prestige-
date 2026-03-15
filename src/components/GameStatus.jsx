const GameStatus = ({ game }) => {
  if (!game) return null;

  let status = '';
  let isGameOver = game.isGameOver();

  if (game.isCheckmate()) {
    status = `Jaque Mate - ¡Ganador: ${game.turn() === 'w' ? 'Negras' : 'Blancas'}!`;
  } else if (game.isDraw()) {
    status = 'Tablas - Empate';
  } else if (game.isCheck()) {
    status = '¡Jaque!';
  } else {
    status = `Turno de: ${game.turn() === 'w' ? 'Blancas' : 'Negras'}`;
  }

  return (
    <div className="game-status panel-glow" style={{
      marginBottom: '1rem',
      padding: '1rem 2rem',
      borderRadius: '8px',
      backgroundColor: 'var(--glass-bg)',
      border: '1px solid var(--glass-border)',
      boxShadow: isGameOver ? '0 0 15px var(--gold-glow)' : 'var(--glass-shadow)',
      textAlign: 'center',
      fontSize: '1.25rem',
      fontWeight: '500',
      color: game.isCheck() || isGameOver ? '#fca5a5' : 'var(--text-main)',
      transition: 'all 0.3s ease'
    }}>
      {status}
    </div>
  );
};

export default GameStatus;
