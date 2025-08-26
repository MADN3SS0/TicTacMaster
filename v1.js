const cells = document.querySelectorAll('.cell');
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
}

function computerMove() {
  playerTurn = false;
  let move;

  if (difficulty === 'easy') {
    move = randomMove();
  } else if (difficulty === 'medium') {
    move = mediumMove();
  } else {
    move = hardMove();
  }

  setTimeout(() => {
    board[move] = 'O';
    renderBoard();

    if (checkWin('O')) {
      alert('O computador venceu!');
      resetGame();
      return;
    }

    if (checkDraw()) {
      alert('Empate!');
      resetGame();
      return;
    }

    playerTurn = true;
  }, 400);
}

function randomMove() {
  const empty = board.map((v,i) => v === null ? i : null).filter(v => v !== null);
  return empty[Math.floor(Math.random() * empty.length)];
}

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

function hardMove() {
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
      alert('Parabéns! Ganhou!');
      resetGame();
      return;
    }

    if (checkDraw()) {
      alert('Empate!');
      resetGame();
      return;
    }

    computerMove();
  });
});
