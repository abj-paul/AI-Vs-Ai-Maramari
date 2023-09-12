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
    let board = req.body.state;
    let indices = minimax.surrounders(board);
    indices = Array.from(indices);
    let score = -Infinity;
    let bestMove = null; // Initialize bestMove
    for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const row = Math.floor(index / 10); // Assuming a 10x10 board
        const col = index % 10;

        if (board[row][col] === '-') {
            board[row][col] = 'w';
            let minimax_score = minimax.calculateMinimax(board, false, 1, -Infinity, Infinity);
            console.log(minimax_score);
            if (minimax_score > score) {
                bestMove = index;
                score = minimax_score;
            }
            board[row][col] = '-';
        }
    };
    console.log("Found best move" + bestMove);
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
