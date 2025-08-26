const cells = document.querySelectorAll('.cell');
const statusDiv = document.createElement('div');
statusDiv.style.marginTop = '15px';
statusDiv.style.fontSize = '1.2rem';
document.querySelector('.container').appendChild(statusDiv);

let board = Array(9).fill(null);
let playerTurn = true;
const difficultySelect = document.getElementById('difficulty');
let difficulty = difficultySelect.value;

difficultySelect.addEventListener('change', () => {
  difficulty = difficultySelect.value;
  resetGame();
});

const winCombos = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWin(player) {
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function checkDraw() {
  return board.every(cell => cell !== null);
}

function renderBoard() {
  cells.forEach((cell, i) => {
    cell.textContent = board[i] || '';
    cell.className = 'cell ' + (board[i] || '');
  });
}

function resetGame() {
  board = Array(9).fill(null);
  playerTurn = true;
  renderBoard();
  statusDiv.textContent = '';
}

function computerMove() {
  playerTurn = false;
  let move;

  if (difficulty === 'easy') {
    move = randomMove();
  } else if (difficulty === 'medium') {
    move = mediumMove();
  } else if (difficulty === 'hard') {
    move = hardMove();
  } else { // impossible
    move = impossibleMove();
  }

  setTimeout(() => {
    board[move] = 'O';
    renderBoard();

    if (checkWin('O')) {
      statusDiv.textContent = 'Computer Wins! 😢';
      resetGame();
      return;
    }

    if (checkDraw()) {
      statusDiv.textContent = "It's a Draw! 🤝";
      resetGame();
      return;
    }

    playerTurn = true;
  }, 400);
}

// Easy: random
function randomMove() {
  const empty = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Medium: bloqueia e ataca óbvio
function mediumMove() {
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      if (checkWin('O')) return i;
      board[i] = null;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'X';
      if (checkWin('X')) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  return randomMove();
}

// Hard: estratégias + mini MiniMax
function hardMove() {
  // Prioridade 1: ganhar se possível
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      if (checkWin('O')) return i;
      board[i] = null;
    }
  }
  // Prioridade 2: bloquear jogador
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'X';
      if (checkWin('X')) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }
  // Prioridade 3: MiniMax limitado (olhar 1 jogada à frente)
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = miniMaxLimited(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  // Prioridade 4: se não encontrar melhor, escolhe aleatório
  return bestMove !== undefined ? bestMove : randomMove();
}

// MiniMax limitado para Hard
function miniMaxLimited(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (checkDraw()) return 0;
  if (depth >= 1) return 0; // Limite para não ser perfeito

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        bestScore = Math.max(bestScore, miniMaxLimited(newBoard, depth+1, false));
        newBoard[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'X';
        bestScore = Math.min(bestScore, miniMaxLimited(newBoard, depth+1, true));
        newBoard[i] = null;
      }
    }
    return bestScore;
  }
}

// Impossible: MiniMax completo
function impossibleMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove !== undefined ? bestMove : randomMove();
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWin('O')) return 10 - depth;
  if (checkWin('X')) return depth - 10;
  if (checkDraw()) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'O';
        bestScore = Math.max(bestScore, minimax(newBoard, depth+1, false));
        newBoard[i] = null;
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!newBoard[i]) {
        newBoard[i] = 'X';
        bestScore = Math.min(bestScore, minimax(newBoard, depth+1, true));
        newBoard[i] = null;
      }
    }
    return bestScore;
  }
}

cells.forEach((cell, i) => {
  cell.addEventListener('click', () => {
    if (!playerTurn || board[i]) return;

    board[i] = 'X';
    renderBoard();

    if (checkWin('X')) {
      statusDiv.textContent = 'You Win! 🎉';
      resetGame();
      return;
    }

    if (checkDraw()) {
      statusDiv.textContent = "It's a Draw! 🤝";
      resetGame();
      return;
    }

    computerMove();
  });
});
