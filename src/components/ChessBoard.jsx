import { useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import Square from './Square';
import Piece from './Piece';
import GameStatus from './GameStatus';
import GameOverModal from './GameOverModal';
import { makeRandomMove, makeMediumMove, makeHardMove } from '../utils/ai';
import { sounds } from '../utils/sounds';

const ChessBoard = ({ socket, roomData, onGameEnd, boardTheme = 'wood', lotteryPrize = 0, currentStake = null }) => {
  const themes = {
    wood: { light: '#f0d9b5', dark: '#b58863' },
    neon: { light: '#1e1b4b', dark: '#312e81' },
    marble: { light: '#e2e8f0', dark: '#64748b' },
    tournament: { light: '#dee3e6', dark: '#8ca2ad' }
  };

  const currentTheme = themes[boardTheme] || themes.wood;
  const [game, setGame] = useState(new Chess());
  const [board, setBoard] = useState(game.board());
  const [showModal, setShowModal] = useState(false);
  const [eloChange, setEloChange] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [timer, setTimer] = useState(600);
  const [capturedWhite, setCapturedWhite] = useState([]); // Piezas blancas perdidas
  const [capturedBlack, setCapturedBlack] = useState([]); // Piezas negras perdidas

  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

  // Timer countdown
  useEffect(() => {
    if (game.isGameOver() || showModal) return;
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [game, showModal]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // Escuchar movimientos del oponente (Online)
  useEffect(() => {
    if (roomData.mode === 'ai') return;
    if (!socket) return;

    socket.on('opponentMove', ({ move, fen }) => {
      const newGame = new Chess(fen);
      setGame(newGame);
      setBoard(newGame.board());
      setMoveCount(c => c + 1);
    });

    return () => {
      socket.off('opponentMove');
    };
  }, [socket, roomData.mode]);

  // Turno de la IA
  useEffect(() => {
    if (roomData.mode === 'ai' && game.turn() === 'b' && !game.isGameOver()) {
      const aiTimer = setTimeout(() => {
        let aiMove = null;
        if (roomData.difficulty === 'easy') aiMove = makeRandomMove(game);
        else if (roomData.difficulty === 'medium') aiMove = makeMediumMove(game);
        else if (roomData.difficulty === 'hard') aiMove = makeHardMove(game);

          if (aiMove) {
            game.move(aiMove);
            const newGame = new Chess(game.fen());
            setGame(newGame);
            setBoard(newGame.board());
            setMoveCount(c => c + 1);

            // Rastrear Captura de la IA
            if (aiMove.captured) {
              setCapturedWhite(prev => [...prev, aiMove.captured]);
            }

            if (newGame.isGameOver()) {
              handleGameOver(newGame);
            } else {
              // IA comenta su propio movimiento si capturó
              if (aiMove.captured) window.dispatchEvent(new CustomEvent('aiChatReq', { detail: 'capture' }));
            }
          }
      }, 500);
      return () => clearTimeout(aiTimer);
    }
  }, [game, roomData.mode, roomData.difficulty]);

  const onDropPiece = useCallback((sourceSquare, targetSquare) => {
    const expectedTurn = roomData.mode === 'ai' ? 'w' : roomData.color;

    if (game.turn() !== expectedTurn) {
      return;
    }

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q'
      });

      if (move) {
        const fen = game.fen();
        const newGame = new Chess(fen);
        setGame(newGame);
        setBoard(newGame.board());
        setMoveCount(c => c + 1);

        // Sound effects
        if (newGame.isCheck()) {
            sounds.check();
            if (roomData.mode === 'ai') window.dispatchEvent(new CustomEvent('aiChatReq', { detail: 'check' }));
        } else if (move.captured) {
            sounds.capture();
            setCapturedBlack(prev => [...prev, move.captured]);
            if (roomData.mode === 'ai') window.dispatchEvent(new CustomEvent('aiChatReq', { detail: 'capture' }));
        } else {
            sounds.move();
        }

        if (socket && roomData.mode !== 'ai') {
          socket.emit('move', { roomId: roomData.roomId, move, fen });
        }

        if (newGame.isGameOver()) {
          handleGameOver(newGame);
        }
      }
    } catch (e) {
      console.log('Movimiento ilegal: ', sourceSquare, '->', targetSquare);
    }
  }, [game, socket, roomData]);

  const handleGameOver = (finalGame) => {
    let change = 0;
    if (finalGame.isCheckmate()) {
      const playerColor = roomData.mode === 'ai' ? 'w' : roomData.color;
      const winner = finalGame.turn() === 'w' ? 'b' : 'w';
      change = winner === playerColor ? 25 : -20;
      if (change > 0) sounds.checkmate();
      else sounds.defeat();
    } else if (finalGame.isDraw()) {
      change = 0;
      sounds.draw();
    }
    setEloChange(change);
    setShowModal(true);
    if (onGameEnd) onGameEnd(change);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Casino Table Header HUD */}
      <div style={{
        width: 'min(92vw, 600px)',
        background: 'linear-gradient(135deg, rgba(0,80,20,0.4) 0%, rgba(0,0,0,0.6) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px 12px 0 0',
        padding: '0.8rem 1.2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>♟️</span>
          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 'bold' }}>
            {roomData.mode === 'ai' ? `vs IA (${roomData.difficulty})` : 'LIVE MATCH'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Movimientos: <span style={{ color: '#fff', fontWeight: 'bold' }}>{moveCount}</span>
          </div>
          <div style={{
            fontSize: '0.8rem', color: timer < 60 ? '#ef4444' : 'var(--gold-primary)',
            fontWeight: 'bold', fontFamily: 'monospace'
          }}>
            ⏱ {formatTime(timer)}
          </div>
        </div>
      </div>

      {/* Pot Display */}
      {currentStake && (
        <div style={{
          width: 'min(92vw, 600px)',
          background: 'rgba(212, 175, 55, 0.08)',
          borderLeft: '1px solid rgba(16, 185, 129, 0.3)',
          borderRight: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '0.5rem 1.2rem',
          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>POT:</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--gold-primary)', textShadow: '0 0 10px var(--gold-glow)' }}>
            ${currentStake.prize}
          </span>
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>+LOTERÍA</span>
        </div>
      )}

      <GameStatus game={game} />

      {/* Casino Felt Table Wrapper */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '20px',
        background: 'linear-gradient(145deg, #0d3b0d 0%, #0a2a0a 50%, #0d3b0d 100%)',
        borderRadius: '12px',
        border: '4px solid #3d2b1f',
        boxShadow: '0 0 50px rgba(0,0,0,0.9), inset 0 0 30px rgba(0,80,20,0.3)',
        position: 'relative',
        minWidth: 'min(95vw, 600px)',
        justifyContent: 'center'
      }}>
        {/* Lado Izquierdo: Piezas Capturadas por Blancas (Piezas Negras) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '5px',
          padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px',
          minWidth: '40px', height: 'min(85vw, 420px)', flexWrap: 'wrap-reverse',
          justifyContent: 'flex-end', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          {capturedBlack.map((p, i) => (
            <span key={i} style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 2px #000)', opacity: 0.8 }}>
              {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : p === 'q' ? '♛' : '♚'}
            </span>
          ))}
          <div style={{ fontSize: '0.6rem', color: '#ef4444', fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid rgba(239, 68, 68, 0.2)', paddingTop: '4px' }}>ENEMY LOST</div>
        </div>

        <div className="chessboard" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, 1fr)',
          width: 'min(85vw, 520px)',
          height: 'min(85vw, 520px)',
          aspectRatio: '1 / 1',
          border: '2px solid rgba(212, 175, 55, 0.4)',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
          {ranks.map((rank, rankIdx) =>
            files.map((file, fileIdx) => {
              const isDark = (ranks.indexOf(rank) + fileIdx) % 2 !== 0;
              const pos = `${file}${rank}`;
              const piece = board[rankIdx][fileIdx];
              const isPlayerPiece = piece ? piece.color === (roomData.mode === 'ai' ? 'w' : roomData.color) : false;

              return (
                <Square
                  key={pos}
                  isDark={isDark}
                  position={pos}
                  onDropPiece={(source) => onDropPiece(source, pos)}
                  customColor={isDark ? currentTheme.dark : currentTheme.light}
                >
                  {piece && (
                    <Piece
                      type={piece.type}
                      color={piece.color}
                      square={pos}
                      draggable={isPlayerPiece && game.turn() === piece.color}
                    />
                  )}
                </Square>
              );
            })
          )}
        </div>

        {/* Lado Derecho: Piezas Capturadas por Negras (Piezas Blancas) */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '5px',
          padding: '10px', background: 'rgba(255,100,100,0.02)', borderRadius: '8px',
          minWidth: '40px', height: 'min(85vw, 420px)', flexWrap: 'wrap-reverse',
          justifyContent: 'flex-start', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ fontSize: '0.6rem', color: '#60a5fa', fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid rgba(96, 165, 250, 0.2)', paddingBottom: '4px' }}>YOU LOST</div>
          {capturedWhite.map((p, i) => (
            <span key={i} style={{ fontSize: '1.2rem', color: '#fff', filter: 'drop-shadow(0 0 2px #000)', opacity: 0.9 }}>
              {p === 'p' ? '♟' : p === 'n' ? '♞' : p === 'b' ? '♝' : p === 'r' ? '♜' : p === 'q' ? '♛' : '♚'}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom casino bar */}
      <div style={{
        width: 'min(92vw, 600px)',
        background: 'linear-gradient(135deg, rgba(0,80,20,0.4) 0%, rgba(0,0,0,0.6) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '0 0 12px 12px',
        padding: '0.6rem 1.2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: 'none',
        fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)'
      }}>
        <span>♠ ♥ ♦ ♣ Chess Prestige Casino</span>
        <span>{game.turn() === 'w' ? '⬜ Blancas' : '⬛ Negras'} juegan</span>
      </div>

      {showModal && (
        <GameOverModal
          result={
            game.isCheckmate()
              ? `Jaque Mate - Victor: ${game.turn() === 'w' ? 'Negras' : 'Blancas'}`
              : 'Tablas / Empate'
          }
          eloChange={eloChange}
          lotteryPrize={lotteryPrize}
          stakePrize={eloChange > 0 && currentStake ? currentStake.prize : 0}
          onRestart={() => {
            const newGame = new Chess();
            setGame(newGame);
            setBoard(newGame.board());
            setShowModal(false);
            setMoveCount(0);
            setTimer(600);
          }}
          onLobby={() => {
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default ChessBoard;
