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
    indices = Array.from(indices)

    for (let i = 0; i < indices.length; i++) {
        console.log(board[indices[i]]);
        if (board[indices[i]] === '-') {
            board[indices[i]] = 'w';
            let minimax_score = minimax.calculateMinimax(board, false, 1, -Math.max(), Math.max());
            if (minimax_score > score) {
                bestMove = indices[i];
                score = minimax_score;
            }
            board[indices[i]] = '-'
        }
    };
    res.status(200).send({ "state": board });
});

app.listen(PORT, (data) => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
