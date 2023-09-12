const express = require("express");
const cors = require("cors");
const minimax = require("./algorithm/Minimax.js")

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res) => {
    res.status(200).send({ "message": "Server Running" });
});



app.post("/ai/solve", (req, res) => {
    const board = req.body.state;
    const indices = Array.from(minimax.surrounders(board));

    let score = -Infinity;
    let bestMove = null; // Initialize bestMove

    for (const index of indices) {
        const row = Math.floor(index / 10); // Assuming a 10x10 board
        const col = index % 10;

        if (board[row][col] === '-') {
            board[row][col] = 'w';
            const minimax_score = minimax.calculateMinimax(board, false, 1, -Infinity, Infinity);
            console.log(minimax_score);

            if (minimax_score === 1000000) { // Winning move
                bestMove = index;
                break;
            }

            if (minimax_score > score) {
                bestMove = index;
                score = minimax_score;
            }

            board[row][col] = '-';
        }
    }

    console.log("Found best move: " + bestMove);

    if (bestMove !== null) {
        const bestMoveRow = Math.floor(bestMove / 10);
        const bestMoveCol = bestMove % 10;
        board[bestMoveRow][bestMoveCol] = 'w';

        res.status(200).send({ "state": board, "bestMove": bestMove });
    } else {
        res.status(200).send({ "state": board, "bestMove": null });
    }
});

app.listen(PORT, (data) => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
