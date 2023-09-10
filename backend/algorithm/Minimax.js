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
    printAlphaBeta(){
	console.log(`Alpha=${this.alpha}, Beta=${this.beta}`);
    }
    printNode(){
	console.log(`\nFinal State: ${this.state}\nNumber of Children=${this.children.length}\nMinimaxValue=${this.minimaxValue}.`);
    }
}

function expandAndFindSolution(current_node, depth) {
    if (depth == MAX_DEPTH) { //  || game.isGameOver(current_node.state)
        current_node.minimaxValue = game.findUtilityValue(current_node.state, depth % 2 == 0);
        return current_node;
    }

    let movable_cells = game.findPossibleMoves(current_node.state);
    let minimaxValue = 0;

    for (let i = 0; i < movable_cells.length; i++) {
        const next_move = game.make_move(current_node.state, movable_cells[i].i, movable_cells[i].j);
        const childNode = expandAndFindSolution(new Node(current_node.alpha, current_node.beta, 0, next_move), depth + 1);
        const child_minimaxValue = childNode.minimaxValue;

        if (i == 0) minimaxValue = child_minimaxValue;

        if (depth % 2 == 0) { // Max Turn
            minimaxValue = Math.max(minimaxValue, child_minimaxValue);
            current_node.alpha = Math.max(current_node.alpha, minimaxValue);
            if (current_node.alpha >= current_node.beta) break; // Alpha-beta pruning
        } else { // Min Turn
            minimaxValue = Math.min(minimaxValue, child_minimaxValue);
            current_node.beta = Math.min(current_node.beta, minimaxValue);
            if (current_node.alpha >= current_node.beta) break; // Alpha-beta pruning
        }

        current_node.children.push(childNode);
    }

    current_node.minimaxValue = minimaxValue;
    //console.log(`Depth=${depth}, Minimax Value=${minimaxValue}`);
    return current_node;
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

module.exports = {Node, expandAndFindSolution};
