const BLACK = -1;
const EMPTY = 0;
const WHITE = 1;
const WINNING_PLY = 5;
const WINNER_SCORE = 50000;
let ROLE  = WHITE;

function setPlayerRole(role){
    ROLE = role;
}

// Current Rule - return all nearby cells
function findPossibleMoves(current_state){
    const nearby_cells = new Set();
    //console.log(current_state);
    for(let i=0; i<current_state.length; i++){
	for(let j=0; j<current_state.length; j++){
	    if(current_state[i][j]!=EMPTY){
		if(__availableCell(i-1, j-1, current_state)) nearby_cells.add({"i":i-1, "j":j-1});
		if(__availableCell(i-1, j, current_state)) nearby_cells.add({"i":i-1, "j":j});
		if(__availableCell(i-1,j+1, current_state)) nearby_cells.add({"i":i-1, "j":j+1});
		
		if(__availableCell(i,j-1, current_state)) nearby_cells.add({"i":i, "j":j-1});
		if(__availableCell(i,j+1, current_state)) nearby_cells.add({"i":i, "j":j+1});
		
		if(__availableCell(i+1,j+1, current_state)) nearby_cells.add({"i":i+1, "j":j+1});
		if(__availableCell(i+1,j, current_state)) nearby_cells.add({"i":i+1, "j":j});
		if(__availableCell(i+1,j-1, current_state)) nearby_cells.add({"i":i+1, "j":j-1});
	    }
	}
    }
    return Array.from(nearby_cells);
}

function __availableCell(i,j, current_state){
    if(i<0 || j<0 || i>=current_state.length || j>=current_state.length) return false; 

    if(current_state[i][j]==EMPTY) return true;
    return false;
}

function __checkLeftSide(current_state, a, b){
    let counter = 0;
    for(let i=a; i>=0; i--){
	if(current_state[i][b]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}
function __checkRightSide(current_state, a, b){
    let counter = 0;
    for(let i=a; i<current_state.length; i++){
	if(current_state[i][b]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}
function __checkUpSide(current_state, a, b){
    let counter = 0;
    for(let j=b; j>=0; j--){
	if(current_state[a][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}

function __checkDownSide(current_state, a, b){
    let counter = 0;
    for(let j=b; j<current_state.length; j++){
	if(current_state[a][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}

function __checkLeftDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i<current_state.length && j<current_state.length; i++,j++){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}

function __checkRightDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i>=0 && j>=0; i--,j--){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return counter*counter*5;
    }
    return counter;
}

function findUtilityValue(current_state){
    let utility_score = 0;
    for(let i=0; i<current_state.length; i++){
	for(let j=0; j<current_state.length; j++){
	    utility_score += __checkLeftSide(current_state, i, j)    +    __checkRightSide(current_state, i, j)    +    __checkUpSide(current_state, i, j)    +    __checkDownSide(current_state, i, j)    +    __checkLeftDiagonal(current_state, i, j)    +    __checkRightDiagonal(current_state, i, j);
	}
    }
    console.log("Utility Score: "+utility_score);
    return utility_score;
}
function make_move(current_state, i, j){
    if(i<0 || j<0 || i>=current_state.length || j>=current_state.length) {
	console.log(`ILLEGAL MOVE FOUND! i=${i},j=${j}. CHECK YOUR CODE...`);
	return;
    }
    const new_state = JSON.parse(JSON.stringify(current_state));
    new_state[i][j] = ROLE;
    return new_state;
}



module.exports = {findPossibleMoves, findUtilityValue, make_move}
