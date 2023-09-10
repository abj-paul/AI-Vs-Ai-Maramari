const game = require("./game-rules.js");
const MAX_DEPTH = 3;

// State = 2D Matrix of 0,1,2
// Node = alpha, beta, minimax value
class Node {
    constructor(alpha, beta, minimaxValue, state) {
        this.alpha = alpha;
        this.beta = beta;
        this.minimaxValue = minimaxValue;
        this.state = state;
        this.children = [];
    }
    getMiniMaxValue() {
        return (`The node has the following value of minimax ${this.minimaxValue}.`)
    }
    printAlphaBeta() {
        console.log(`Alpha=${this.alpha}, Beta=${this.beta}`);
    }
    printNode() {
        console.log(`\nFinal State: ${this.state}\nNumber of Children=${this.children.length}\nMinimaxValue=${this.minimaxValue}.`);
    }
}

function surrounders(board) {
    const numRows = 15;
    const numCols = 15;
    const indices = new Set();

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const index = row * numCols + col;
            if (board[row][col] !== '-') {
                if (row - 1 >= 0) indices.add(index - numCols); // Above
                if (row + 1 < numRows) indices.add(index + numCols); // Below
                if (col - 1 >= 0) indices.add(index - 1); // Left
                if (col + 1 < numCols) indices.add(index + 1); // Right
                if (row - 1 >= 0 && col - 1 >= 0) indices.add(index - numCols - 1); // Upper-left
                if (row - 1 >= 0 && col + 1 < numCols) indices.add(index - numCols + 1); // Upper-right
                if (row + 1 < numRows && col - 1 >= 0) indices.add(index + numCols - 1); // Lower-left
                if (row + 1 < numRows && col + 1 < numCols) indices.add(index + numCols + 1); // Lower-right
            }
        }
    }

    return indices;
}


function calculateMinimax(current_node, maxPlayer, depth, alpha, beta) {
    let boardValue = game.findUtilityValue(current_node, maxPlayer);
    if (depth === MAX_DEPTH || boardValue === 1000000 || boardValue === -1000000) {
        return boardValue;
    }

    let score = maxPlayer ? -Infinity : Infinity; // Initialize score based on maxPlayer

    let indices = surrounders(current_node);
    indices = Array.from(indices);

    for (let i = 0; i < indices.length; i++) {
        const index = indices[i];
        const row = Math.floor(index / 15); // Assuming a 15x15 board
        const col = index % 15;

        if (current_node[row][col] === '-') {
            current_node[row][col] = maxPlayer ? 'w' : 'b'; // Set the board at (row, col) based on maxPlayer

            if (maxPlayer) {
                let minimax_score = calculateMinimax(current_node, false, depth + 1, alpha, beta);
                score = Math.max(score, minimax_score);
                alpha = Math.max(score, alpha);
            } else {
                let minimax_score = calculateMinimax(current_node, true, depth + 1, alpha, beta);
                score = Math.min(score, minimax_score);
                beta = Math.min(minimax_score, beta);
            }

            current_node[row][col] = '-';

            if (alpha >= beta) {
                break;
            }
        }
    }

    return score;
}
/*
console.log("Final Result: ");
(expandAndFindSolution(new Node(Math.max(), Math.min(),0,[
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  1,  0,  0,  0,  -1,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  1,  0,  -1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  -1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, -1]
]), 0
                                )).printNode();
                                */

module.exports = { Node, calculateMinimax, surrounders };
