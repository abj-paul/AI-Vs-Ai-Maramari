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
    }
    getMiniMaxValue() {
        return (`The node has the following value of minimax ${this.minimaxValue}.`)
    }
    printAlphaBeta(){
	console.log(`Alpha=${this.alpha}, Beta=${this.beta}`);
    }
}

function expandAndFindSolution(current_node, depth){ // Starts from 0
    console.log("Entering with: ");
    current_node.printAlphaBeta();
    if(depth==MAX_DEPTH){
	return game.findUtilityValue(current_node.state);
    }
    
    let movable_cells = game.findPossibleMoves(current_node.state);

    let minimaxValue = 0;
    
    for(let i=0; i<movable_cells.length; i++){
	console.log(`Exploring depth=${depth} and choice=${i}/${movable_cells.length}.`)

	const next_move = game.make_move(current_node.state, movable_cells[i].i, movable_cells[i].j);
	const child_minimaxValue = expandAndFindSolution(new Node(current_node.alpha,current_node.beta,0,next_move),depth+1);
	if(i==0) minimaxValue = child_minimaxValue;
	
	if(depth%2==0){ // Max Turn
	    minimaxValue = Math.max(minimaxValue, child_minimaxValue);
	    if(current_node.alpha > current_node.beta) break; // Pruning
	}else{ // Min Turn
	    minimaxValue = Math.min(minimaxValue, child_minimaxValue);
	    if(current_node.alpha > current_node.beta) break; // Pruning
	}
    }

    if(depth%2==0) current_node.alpha = Math.max(current_node.alpha, minimaxValue);
    else current_node.beta = Math.min(current_node.beta, minimaxValue);

    current_node.printAlphaBeta();
    console.log(`Minimax Value of depth=${depth} is ${minimaxValue}.`);
    return minimaxValue;
}

console.log("Final Minimax Value: " + expandAndFindSolution(new Node(Math.max(), Math.min(),0,[
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
							   ));
