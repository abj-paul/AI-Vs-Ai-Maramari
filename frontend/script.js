// GOMOKU PIECE REPRESENATION FORMAT
const BLACK = -1;
const EMPTY = 0;
const WHITE = 1;
const GOMOKU_PLAYER1_ADDRESS = "http://localhost:3000/ai/solve";

let CURRENT_TURN = BLACK;
const INITIAL_STATE = [
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]
];


let current_board_state = INITIAL_STATE;

function generateBoard(){
    // Removing Old Board
    let board = document.getElementById("board");
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }

    // Drawing New Board
    const BOARD_SIZE = 15;
    for(let i=0; i<BOARD_SIZE; i++){
	for(let j=0; j<BOARD_SIZE; j++){
	    let cell = document.createElement("button");
	    cell.innerText = " ";
	    cell.id = `${i}-${j}`;
	    cell.classList.add("grid-item");
	    cell.onclick = function(event){makeMove(i,j);};
	    document.getElementById("board").appendChild(cell);
	    drawMove(i,j);
	}
    }
    console.log(document.getElementById("board").children);
}

function drawMove(i,j){
    if(current_board_state[i][j]==BLACK) {
	document.getElementById(`${i}-${j}`).classList.add("piece");
	document.getElementById(`${i}-${j}`).classList.add("black");
    }
    else if(current_board_state[i][j] == WHITE) {
	document.getElementById(`${i}-${j}`).classList.add("piece");
	document.getElementById(`${i}-${j}`).classList.add("white");
    }	
}

function makeMove(i,j){
    console.log(i,j);
    if(CURRENT_TURN==BLACK) {
	current_board_state[i][j] = BLACK;
	CURRENT_TURN = WHITE;
    }
    else {
	current_board_state[i][j] = WHITE;
	CURRENT_TURN = BLACK;
    }

    drawMove(i,j);
    wait_for_opponent_move(); // CORE BUSINESS LOGIC
    if(CURRENT_TURN==BLACK) {
	current_board_state[i][j] = BLACK;
	CURRENT_TURN = WHITE;
    }
    else {
	current_board_state[i][j] = WHITE;
	CURRENT_TURN = BLACK;
    }
}

function wait_for_opponent_move(){
    console.log("Waiting for AI Move");
    fetch(GOMOKU_PLAYER1_ADDRESS, {
	method: 'POST',
	headers: {
            'Content-Type': 'application/json'
	},
	body: JSON.stringify({
            "state": current_board_state
	})
    })
	.then(response => response.json())
	.then(reply => {
	    console.log("AI has replied!");
	    current_board_state = reply.state;
	    generateBoard();
	})
	.catch(error => {
	    console.error("An error occurred:", error);
	});

}

