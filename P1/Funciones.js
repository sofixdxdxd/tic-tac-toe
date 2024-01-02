const GameBoard = (function () {
    let board = Array(9).fill("");

    const setMove = (position, player) => {
        if (board[position] === "") {
            board[position] = player;
            return true;
        }
        return false;
    };

    const getBoard = () => {
        return board;
    };

    const resetBoard = () => {
        board = Array(9).fill("");
    };

    return { setMove, getBoard, resetBoard };
})();

function createPlayer(symbol) {
    const getSymbol = () => {
        return symbol;
    };

    return { getSymbol };
}

const playerX = createPlayer("X");
const playerO = createPlayer("O");

const Game = (function () {
    let isGameOver = false;
    let currentPlayer = playerX;

    function checkWinner() {
        const board = GameBoard.getBoard();
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        if (!board.includes("")) {
            return "Tie";
        }

        return false;
    }

    function switchPlayer() {
        currentPlayer = currentPlayer === playerX ? playerO : playerX;
        DOMManager.getGameStatus().textContent = `Player ${currentPlayer.getSymbol()}'s Turn`;
    }

    const makeMove = position => {
        if (isGameOver) {
            return;
        }

        if (GameBoard.setMove(position, currentPlayer.getSymbol())) {
            const winner = checkWinner();

            if (winner) {
                isGameOver = true;
                DOMManager.getGameStatus().textContent = `${
                    winner === "Tie" ? "It's a Tie!" : `Player ${winner} wins!`
                }`;
            } else {
                switchPlayer();
            }
        }
    };

    const resetGame = () => {
        isGameOver = false;
        GameBoard.resetBoard();
        currentPlayer = playerX;
        DOMManager.getGameStatus().textContent = "Player X's Turn";
    };

    const getGameStatus = () => {
        return isGameOver;
    };

    return { makeMove, resetGame, getGameStatus };
})();

const DOMManager = (function () {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("resetButton");
    const statusText = document.getElementById("gameStatus");

    const renderBoard = () => {
        const board = GameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const bindEvents = () => {
        cells.forEach(cell => {
            cell.addEventListener("click", () => {
                if (!Game.getGameStatus()) {
                    const spot = cell.getAttribute("spot");
                    Game.makeMove(parseInt(spot));
                    renderBoard();
                }
            });
        });

        resetButton.addEventListener("click", () => {
            Game.resetGame();
            renderBoard();
        });
    };

    const getGameStatus = () => {
        return statusText;
    };

    bindEvents();

    return { getGameStatus };
})();