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

const surroundersMemo = new Map();

function surrounders(board) {
    const boardString = board.toString();
    if (surroundersMemo.has(boardString)) {
        return surroundersMemo.get(boardString);
    }

    const numRows = 10;
    const numCols = 10;
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

    surroundersMemo.set(boardString, indices);
    return indices;
}

// Use an array to store calculated minimax scores
const transpositionTable = new Map();

function calculateMinimax(current_node, maxPlayer, depth, alpha, beta) {
    const boardString = current_node.toString();

    // Transposition table lookup
    if (transpositionTable.has(boardString)) {
        const cachedEntry = transpositionTable.get(boardString);
        if (cachedEntry.depth >= depth) {
            return cachedEntry.score;
        }
    }

    let boardValue = game.findUtilityValue(current_node, maxPlayer);
    if (depth === MAX_DEPTH || boardValue === 1000000 || boardValue === -1000000) {
        return boardValue;
    }

    let score = maxPlayer ? -Infinity : Infinity; // Initialize score based on maxPlayer

    const indices = surrounders(current_node);
    const indicesArray = Array.from(indices);

    for (let i = 0; i < indicesArray.length; i++) {
        const index = indicesArray[i];
        const row = Math.floor(index / 10); // 10x10
        const col = index % 10;

        if (current_node[row][col] === '-') {
            current_node[row][col] = maxPlayer ? 'w' : 'b';

            let minimax_score = calculateMinimax(current_node, !maxPlayer, depth + 1, alpha, beta);
            score = maxPlayer ? Math.max(score, minimax_score) : Math.min(score, minimax_score);

            current_node[row][col] = '-';

            if (maxPlayer) {
                alpha = Math.max(alpha, score);
            } else {
                beta = Math.min(beta, score);
            }

            // Alpha-Beta pruning
            if (alpha >= beta) {
                break;
            }
        }
    }

    // Store in transposition table
    transpositionTable.set(boardString, { depth, score });

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
