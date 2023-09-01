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

function expandAndFindSolution(current_node, depth){ // Starts from 0
    //console.log("Entering with: ");
    //current_node.printAlphaBeta();
    if(depth==MAX_DEPTH){
	current_node.minimaxValue = game.findUtilityValue(current_node.state);
	return current_node;
    }
    
    let movable_cells = game.findPossibleMoves(current_node.state);

    let minimaxValue = 0;
    
    for(let i=0; i<movable_cells.length; i++){
	console.log(`Exploring depth=${depth} and choice=${i}/${movable_cells.length}.`)

	const next_move = game.make_move(current_node.state, movable_cells[i].i, movable_cells[i].j);
	const childNode = expandAndFindSolution(new Node(current_node.alpha,current_node.beta,0,next_move),depth+1);
	const child_minimaxValue = childNode.minimaxValue;
	if(i==0) minimaxValue = child_minimaxValue;
	
	if(depth%2==0){ // Max Turn
	    minimaxValue = Math.max(minimaxValue, child_minimaxValue);
	    if(current_node.alpha > current_node.beta) break; // Pruning
	}else{ // Min Turn
	    minimaxValue = Math.min(minimaxValue, child_minimaxValue);
	    if(current_node.alpha > current_node.beta) break; // Pruning
	}

	current_node.children.push(childNode);
    }

    if(depth%2==0) current_node.alpha = Math.max(current_node.alpha, minimaxValue);
    else current_node.beta = Math.min(current_node.beta, minimaxValue);
    current_node.minimaxValue = minimaxValue;

    current_node.printAlphaBeta();
    console.log(`Minimax Value of depth=${depth} is ${minimaxValue}.`);
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
