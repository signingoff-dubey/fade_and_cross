class NTToeGame {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'x';
        this.moveHistory = {
            x: [], // Will store [index, timestamp] pairs
            o: []
        };
        this.maxMovesPerPlayer = 3;
        this.gameActive = true;
        this.playerNames = {
            x: 'Kabir',
            o: 'Aryan'
        };
        
        // Get DOM elements
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.getElementById('reset-game');
        this.player1Element = document.getElementById('player1');
        this.player2Element = document.getElementById('player2');
        this.playerSetup = document.getElementById('player-setup');
        this.gameContainer = document.getElementById('game-container');
        this.startButton = document.getElementById('start-game');
        this.player1Input = document.getElementById('player1-name');
        this.player2Input = document.getElementById('player2-name');
        
        this.setupGame();
    }

    setupGame() {
        // Setup start game button
        this.startButton.addEventListener('click', () => {
            this.playerNames.x = this.player1Input.value.trim() || 'Player 1';
            this.playerNames.o = this.player2Input.value.trim() || 'Player 2';
            
            // Update player name displays
            this.player1Element.querySelector('.player-name').textContent = this.playerNames.x;
            this.player2Element.querySelector('.player-name').textContent = this.playerNames.o;
            
            // Hide setup, show game
            this.playerSetup.style.display = 'none';
            this.gameContainer.style.display = 'block';
            
            this.initializeGame();
        });
    }

    initializeGame() {
        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
        
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.updatePlayerIndicator();
    }

    handleCellClick(cell) {
        const index = cell.dataset.index;
        
        if (this.board[index] || !this.gameActive) return;
        
        // Make the move
        this.board[index] = this.currentPlayer;
        this.moveHistory[this.currentPlayer].push([index, Date.now()]);
        
        // Update the cell appearance
        cell.classList.add(this.currentPlayer);
        
        // Check if we need to remove the oldest move
        if (this.moveHistory[this.currentPlayer].length > this.maxMovesPerPlayer) {
            const [oldestIndex] = this.moveHistory[this.currentPlayer].shift();
            this.board[oldestIndex] = null;
            this.cells[oldestIndex].classList.remove(this.currentPlayer);
            this.cells[oldestIndex].classList.remove(`grey-${this.currentPlayer}`);
        }
        
        // Grey out the oldest remaining move if we have max moves
        if (this.moveHistory[this.currentPlayer].length === this.maxMovesPerPlayer) {
            const [oldestIndex] = this.moveHistory[this.currentPlayer][0];
            this.cells[oldestIndex].classList.add(`grey-${this.currentPlayer}`);
        }

        if (this.checkWin()) {
            this.handleWin();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
        this.updatePlayerIndicator();
    }

    checkWin() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6] // Diagonals
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            const cellA = this.cells[a];
            const cellB = this.cells[b];
            const cellC = this.cells[c];
            
            // Check if cells have the current player's mark (including grey ones)
            const isCurrentPlayerA = cellA.classList.contains(this.currentPlayer) || cellA.classList.contains(`grey-${this.currentPlayer}`);
            const isCurrentPlayerB = cellB.classList.contains(this.currentPlayer) || cellB.classList.contains(`grey-${this.currentPlayer}`);
            const isCurrentPlayerC = cellC.classList.contains(this.currentPlayer) || cellC.classList.contains(`grey-${this.currentPlayer}`);
            
            if (isCurrentPlayerA && isCurrentPlayerB && isCurrentPlayerC) {
                // Highlight winning cells
                pattern.forEach(index => {
                    this.cells[index].classList.add('win-cell');
                });
                return true;
            }
            return false;
        });
    }

    handleWin() {
        this.gameActive = false;
        const winner = this.playerNames[this.currentPlayer];
        setTimeout(() => {
            alert(`${winner} wins!`);
        }, 100);
    }

    updatePlayerIndicator() {
        this.player1Element.classList.toggle('active', this.currentPlayer === 'x');
        this.player2Element.classList.toggle('active', this.currentPlayer === 'o');
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'x';
        this.moveHistory = { x: [], o: [] };
        this.gameActive = true;

        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'grey-x', 'grey-o', 'win-cell');
        });

        this.updatePlayerIndicator();
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NTToeGame();
}); 