/**
 * TRES EN RAYA - PROCEDURAL SOUND & GENERALIZED N-IN-A-ROW ENGINE
 */

// Procedural Audio Synthesizer
class TicTacToeAudio {
    constructor() {
        this.ctx = null;
    }

    init() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) this.ctx = new AudioContextClass();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playMove(isX = true) {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isX ? 'sine' : 'triangle';
        const startFreq = isX ? 440 : 330;
        const endFreq = isX ? 660 : 495;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    playWin() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50];

        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.09);

            gain.gain.setValueAtTime(0.25, now + i * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.09 + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.09);
            osc.stop(now + i * 0.09 + 0.24);
        });
    }

    playDraw() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.26);
    }
}

const audio = new TicTacToeAudio();

// Game State
let boardSize = 3;
let winLength = 3;
let board = [];
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' | 'cpu'
let difficulty = 'easy'; // 'easy' | 'hard'
let scores = { X: 0, O: 0, draw: 0 };

const PLAYER_NAMES = {
    pvp: { X: 'Jugador 1', O: 'Jugador 2' },
    cpu: { X: 'Tú', O: 'CPU' }
};

// DOM References
const boardEl = document.getElementById('game-board');
const winLineEl = document.getElementById('win-line');
const turnMarkEl = document.getElementById('turn-mark');
const turnTextEl = document.getElementById('turn-text');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');
const labelXEl = document.getElementById('label-x');
const labelOEl = document.getElementById('label-o');
const newGameBtn = document.getElementById('new-game-btn');
const resetScoreBtn = document.getElementById('reset-score-btn');
const modeButtons = document.querySelectorAll('.mode-btn');
const diffButtons = document.querySelectorAll('.diff-btn');
const sizeButtons = document.querySelectorAll('.size-btn');
const difficultyWrapper = document.getElementById('difficulty-wrapper');
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const resultModal = document.getElementById('result-modal');
const resultIcon = document.getElementById('result-icon');
const resultTitle = document.getElementById('result-title');
const resultSubtitle = document.getElementById('result-subtitle');
const modalPlayAgainBtn = document.getElementById('modal-play-again-btn');

function markSVG(player) {
    if (player === 'X') {
        return `
            <svg class="mark-svg x-svg" viewBox="0 0 60 60">
                <line class="draw-line l1" x1="12" y1="12" x2="48" y2="48"></line>
                <line class="draw-line l2" x1="48" y1="12" x2="12" y2="48"></line>
            </svg>`;
    }
    return `
        <svg class="mark-svg o-svg" viewBox="0 0 60 60">
            <circle class="draw-circle" cx="30" cy="30" r="20"></circle>
        </svg>`;
}

// Generate Winning Combinations
function generateWinningLines(N, K) {
    const lines = [];
    const getIdx = (r, c) => r * N + c;

    // Rows
    for (let r = 0; r < N; r++) {
        for (let c = 0; c <= N - K; c++) {
            const line = [];
            for (let k = 0; k < K; k++) line.push(getIdx(r, c + k));
            lines.push(line);
        }
    }

    // Cols
    for (let c = 0; c < N; c++) {
        for (let r = 0; r <= N - K; r++) {
            const line = [];
            for (let k = 0; k < K; k++) line.push(getIdx(r + k, c));
            lines.push(line);
        }
    }

    // Diagonals (Top-Left to Bottom-Right)
    for (let r = 0; r <= N - K; r++) {
        for (let c = 0; c <= N - K; c++) {
            const line = [];
            for (let k = 0; k < K; k++) line.push(getIdx(r + k, c + k));
            lines.push(line);
        }
    }

    // Diagonals (Top-Right to Bottom-Left)
    for (let r = 0; r <= N - K; r++) {
        for (let c = K - 1; c < N; c++) {
            const line = [];
            for (let k = 0; k < K; k++) line.push(getIdx(r + k, c - k));
            lines.push(line);
        }
    }

    return lines;
}

let winningLines = generateWinningLines(boardSize, winLength);

function evaluateWinner(b) {
    for (const line of winningLines) {
        const first = b[line[0]];
        if (first && line.every(i => b[i] === first)) {
            return { winner: first, line };
        }
    }
    return null;
}

function isBoardFull(b) {
    return b.every(c => c !== '');
}

function handleCellClick(index) {
    if (!gameActive || board[index] !== '') return;
    if (gameMode === 'cpu' && currentPlayer === 'O') return;

    makeMove(index, currentPlayer);
    postMove();
}

function makeMove(index, player) {
    board[index] = player;
    const cellEl = boardEl.querySelector(`.cell[data-index="${index}"]`);
    if (cellEl) {
        cellEl.innerHTML = markSVG(player);
        cellEl.classList.add('disabled');
    }
    audio.playMove(player === 'X');
}

function postMove() {
    const result = evaluateWinner(board);
    if (result) {
        endGame(result);
        return;
    }
    if (isBoardFull(board)) {
        endGame({ winner: null, line: null });
        return;
    }
    switchPlayer();

    if (gameMode === 'cpu' && currentPlayer === 'O' && gameActive) {
        setTimeout(cpuMove, 350);
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();
}

function cpuMove() {
    if (!gameActive) return;
    const index = (difficulty === 'easy' || boardSize > 3)
        ? heuristicOrRandomMove(board, 'O')
        : bestMoveMinimax(board, 'O');

    if (index === -1) return;
    makeMove(index, 'O');
    postMove();
}

function heuristicOrRandomMove(b, aiPlayer) {
    const human = aiPlayer === 'O' ? 'X' : 'O';

    // 1. Winning move
    for (let i = 0; i < b.length; i++) {
        if (b[i] === '') {
            b[i] = aiPlayer;
            if (evaluateWinner(b)) {
                b[i] = '';
                return i;
            }
            b[i] = '';
        }
    }

    // 2. Block human win
    for (let i = 0; i < b.length; i++) {
        if (b[i] === '') {
            b[i] = human;
            if (evaluateWinner(b)) {
                b[i] = '';
                return i;
            }
            b[i] = '';
        }
    }

    // 3. Center preference
    const center = Math.floor(b.length / 2);
    if (b[center] === '') return center;

    // 4. Random empty cell
    const empty = b.map((v, i) => v === '' ? i : -1).filter(i => i !== -1);
    if (empty.length === 0) return -1;
    return empty[Math.floor(Math.random() * empty.length)];
}

function bestMoveMinimax(b, player) {
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < b.length; i++) {
        if (b[i] === '') {
            b[i] = player;
            const score = minimax(b, 0, false, -Infinity, Infinity, player);
            b[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move !== -1 ? move : heuristicOrRandomMove(b, player);
}

function minimax(b, depth, isMaximizing, alpha, beta, aiPlayer) {
    const human = aiPlayer === 'O' ? 'X' : 'O';
    const result = evaluateWinner(b);
    if (result) {
        return result.winner === aiPlayer ? 10 - depth : depth - 10;
    }
    if (isBoardFull(b) || depth >= 6) return 0;

    if (isMaximizing) {
        let best = -Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = aiPlayer;
                best = Math.max(best, minimax(b, depth + 1, false, alpha, beta, aiPlayer));
                b[i] = '';
                alpha = Math.max(alpha, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < b.length; i++) {
            if (b[i] === '') {
                b[i] = human;
                best = Math.min(best, minimax(b, depth + 1, true, alpha, beta, aiPlayer));
                b[i] = '';
                beta = Math.min(beta, best);
                if (beta <= alpha) break;
            }
        }
        return best;
    }
}

function endGame(result) {
    gameActive = false;
    boardEl.querySelectorAll('.cell').forEach(c => c.classList.add('disabled'));

    if (result.winner) {
        scores[result.winner]++;
        updateScores();
        highlightWinningLine(result.line);
        showResultModal(result.winner);
        audio.playWin();
    } else {
        scores.draw++;
        updateScores();
        showResultModal(null);
        audio.playDraw();
    }
}

function highlightWinningLine(line) {
    line.forEach(i => {
        const cell = boardEl.querySelector(`.cell[data-index="${i}"]`);
        if (cell) cell.classList.add('winner');
    });
}

function showResultModal(winner) {
    if (winner) {
        const name = PLAYER_NAMES[gameMode][winner];
        resultIcon.textContent = '🏆';
        resultTitle.textContent = '¡Victoria!';
        resultSubtitle.textContent = `${name} (${winner}) ha ganado la partida.`;
    } else {
        resultIcon.textContent = '🤝';
        resultTitle.textContent = '¡Empate!';
        resultSubtitle.textContent = 'Nadie logró alinear las fichas requeridas. ¡Intentadlo de nuevo!';
    }
    resultModal.classList.remove('hidden');
}

function updateTurnDisplay() {
    turnMarkEl.textContent = currentPlayer;
    turnMarkEl.classList.toggle('is-o', currentPlayer === 'O');
    turnTextEl.textContent = PLAYER_NAMES[gameMode][currentPlayer];
}

function updateScores() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDrawEl.textContent = scores.draw;
}

function updateLabels() {
    labelXEl.textContent = PLAYER_NAMES[gameMode].X;
    labelOEl.textContent = PLAYER_NAMES[gameMode].O;
}

function buildBoardDOM() {
    board = Array(boardSize * boardSize).fill('');
    boardEl.className = `game-board grid-${boardSize}x${boardSize}`;
    boardEl.innerHTML = '<svg id="win-line" class="win-line" xmlns="http://www.w3.org/2000/svg"></svg>';

    for (let i = 0; i < board.length; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardEl.appendChild(cell);
    }
}

function newGame() {
    board = Array(boardSize * boardSize).fill('');
    currentPlayer = 'X';
    gameActive = true;

    buildBoardDOM();
    resultModal.classList.add('hidden');
    updateTurnDisplay();
}

function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    updateScores();
}

function setMode(mode) {
    gameMode = mode;
    modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    difficultyWrapper.classList.toggle('hidden', mode !== 'cpu');
    updateLabels();
    newGame();
}

function setDifficulty(diff) {
    difficulty = diff;
    diffButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.difficulty === diff));
    newGame();
}

function setBoardSize(size) {
    boardSize = parseInt(size, 10);
    winLength = boardSize === 3 ? 3 : 4;
    winningLines = generateWinningLines(boardSize, winLength);

    sizeButtons.forEach(btn => btn.classList.toggle('active', parseInt(btn.dataset.size, 10) === boardSize));
    newGame();
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.innerHTML = theme === 'dark' ? moonIcon() : sunIcon();
}

function sunIcon() {
    return `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.22" x2="5.64" y2="17.78"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
}

function moonIcon() {
    return `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
}

// Event Listeners
newGameBtn.addEventListener('click', newGame);
resetScoreBtn.addEventListener('click', resetScores);
modalPlayAgainBtn.addEventListener('click', newGame);
themeToggleBtn.addEventListener('click', toggleTheme);

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
});

diffButtons.forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn.dataset.difficulty));
});

sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => setBoardSize(btn.dataset.size));
});

// Init
buildBoardDOM();
updateTurnDisplay();
updateScores();
updateLabels();
