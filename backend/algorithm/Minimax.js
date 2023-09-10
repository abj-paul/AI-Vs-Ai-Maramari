const game = require("./game-rules.js");
const MAX_DEPTH = 4;

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
    let indices = new Set()
    for (let i = 0; i < 100; i++) {
        if (board[i] !== '') {
            if ((i - 9) >= 0 && (i - 9) < 100) indices.add(i - 9)
            if ((i - 11) >= 0 && (i - 11) < 100) indices.add(i - 11)
            if ((i - 10) >= 0 && (i - 10) < 100) indices.add(i - 10)
            if ((i + 10) >= 0 && (i + 10) < 100) indices.add(i + 10)
            if ((i + 9) >= 0 && (i + 9) < 100) indices.add(i + 9)
            if ((i + 11) >= 0 && (i + 11) < 100) indices.add(i + 11)
            if ((i - 1) >= 0 && (i - 1) < 100) indices.add(i - 1)
            if ((i + 1) >= 0 && (i + 1) < 100) indices.add(i + 1)
        }
    }
    return indices;
}


function calculateMinimax(current_node, maxPlayer, depth, alpha, beta) {
    let boardValue = game.findUtilityValue(current_node, maxPlayer);
    console.log(boardValue);
    if (depth === MAX_DEPTH || boardvalue === 1000000 || boardvalue === -1000000) {
        return boardValue;
    }

    let score = 0;

    if (maxPlayer) score = -Math.max();
    else score = Math.max();

    let indices = surrounders(current_node);
    indices = Array.from(indices);

    for (let i = 0; i < indices.length; i++) {
        if (current_node[indices[i]] === '') {
            board[indices[i]] = 'w';
            if (maxPlayer) {
                board[indices[i]] = 'w';
                let minimax_score = calculateMinimax(board, false, depth + 1, alpha, beta)
                score = Math.max(score, minimax_score);
                alpha = Math.max(score, alpha)
                board[indices[i]] = ''
                if (alpha >= beta) { break; }
            }
            else {
                board[indices[i]] = 'b';
                let minimax_score = calculateMinimax(board, true, depth + 1, alpha, beta)
                score = Math.min(score, minimax_score);
                beta = Math.min(minimax_score, beta)
                board[indices[i]] = ''
                if (alpha >= beta) { break; }
            }
        }
    }

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
