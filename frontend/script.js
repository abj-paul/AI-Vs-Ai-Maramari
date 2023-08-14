const BLACK = "Black";
const WHITE = "White";
let CURRENT_TURN = BLACK;

function generateBoard(){
    const BOARD_SIZE = 15;
    for(let i=0; i<BOARD_SIZE; i++){
	for(let j=0; j<BOARD_SIZE; j++){
	    let cell = document.createElement("button");
	    cell.innerText = " ";
	    cell.id = `${i}-${j}`;
	    cell.classList.add("grid-item");
	    cell.onclick = function(event){makeMove(event,i,j);};
	    document.getElementById("board").appendChild(cell);
	}
    }
    console.log("Done genarating board");
    console.log(document.getElementById("board").children);
}

function makeMove(event,i,j){
    console.log(i,j);
    if(CURRENT_TURN==BLACK) {
	document.getElementById(`${i}-${j}`).classList.add("piece");
	document.getElementById(`${i}-${j}`).classList.add("black");
	CURRENT_TURN = WHITE;
    }
    else {
	document.getElementById(`${i}-${j}`).classList.add("piece");
	document.getElementById(`${i}-${j}`).classList.add("white");

	CURRENT_TURN = BLACK;
    }
}
