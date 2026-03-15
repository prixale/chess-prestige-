// Valores básicos de las piezas para la evaluación estática
const pieceValues = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 900
};

// Tablas de posición de piezas (PST) simples para mejorar el juego posicional
// Los valores son bonificaciones (centipawns) dependiendo de dónde esté la pieza.
const pst = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ]
};

// Función de evaluación mejorada
const evaluateBoard = (game) => {
  let totalEvaluation = 0;
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        let val = pieceValues[piece.type];
        // Añadir bonificación por posición si existe PST para el tipo de pieza
        if (pst[piece.type]) {
          const row = piece.color === 'w' ? 7 - i : i;
          val += pst[piece.type][row][j];
        }

        // Sumar si es del color actual, restar si es del oponente
        if (piece.color === game.turn()) {
          totalEvaluation += val;
        } else {
          totalEvaluation -= val;
        }
      }
    }
  }
  return totalEvaluation;
};

// Algoritmo Minimax con poda Alfa-Beta
const minimax = (game, depth, alpha, beta, isMaximizingPlayer) => {
  if (depth === 0) {
    return -evaluateBoard(game);
  }

  const possibleMoves = game.moves();

  if (isMaximizingPlayer) {
    let bestValue = -9999;
    for (let i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestValue = Math.max(bestValue, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
      game.undo();
      alpha = Math.max(alpha, bestValue);
      if (beta <= alpha) return bestValue;
    }
    return bestValue;
  } else {
    let bestValue = 9999;
    for (let i = 0; i < possibleMoves.length; i++) {
      game.move(possibleMoves[i]);
      bestValue = Math.min(bestValue, minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer));
      game.undo();
      beta = Math.min(beta, bestValue);
      if (beta <= alpha) return bestValue;
    }
    return bestValue;
  }
};

// 1. Nivel Fácil: Movimiento aleatorio
export const makeRandomMove = (game) => {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return null;
  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIdx];
};

// 2. Nivel Medio: Capturar si es posible (voraz)
export const makeMediumMove = (game) => {
  const possibleMoves = game.moves({ verbose: true });
  if (possibleMoves.length === 0) return null;

  const captures = possibleMoves.filter(move => move.flags.includes('c') || move.flags.includes('e'));

  if (captures.length > 0) {
    // Escoger captura de mayor valor
    captures.sort((a, b) => (pieceValues[b.captured] || 0) - (pieceValues[a.captured] || 0));
    return captures[0].san;
  }

  const randomIdx = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIdx].san;
};

// 3. Nivel Difícil: Minimax + Alfa-Beta (Profundidad 3)
export const makeHardMove = (game) => {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return null;

  let bestMove = null;
  let bestValue = -9999;

  for (let i = 0; i < possibleMoves.length; i++) {
    const move = possibleMoves[i];
    game.move(move);
    const boardValue = minimax(game, 2, -10000, 10000, false); // Profundidad 2 real (3 niveles incluyendo este)
    game.undo();

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove;
};
