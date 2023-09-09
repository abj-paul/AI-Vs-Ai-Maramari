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
	else return Math.pow(5,counter);
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
	else return Math.pow(5,counter);
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
	else return Math.pow(5,counter);
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
	else return Math.pow(5,counter);
    }
    return counter;
}

function __checkLeftUpDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i>=0 && j>=0; i--,j--){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return Math.pow(5,counter);
    }
    return counter;
}

function __checkLeftDownDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i<current_state.length && j<current_state.length; i++,j++){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return Math.pow(5,counter);
    }
    return counter;
}

function __checkRightUpDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i<current_state.length && j>=0; i--,j++){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return Math.pow(5,counter);
    }
    return counter;
}

function __checkRightDownDiagonal(current_state, a, b){
    let counter = 0;
    for(let i=a,j=b; i<current_state.length && j>=0; i++,j--){
	if(current_state[i][j]==ROLE){
	    counter++;
	    if(counter==WINNING_PLY) return WINNER_SCORE;
	}
	else return Math.pow(5,counter);
    }
    return counter;
}

function __my_player_utility(current_state,i,j){
    return __checkLeftSide(current_state, i, j)    +    __checkRightSide(current_state, i, j)    +    __checkUpSide(current_state, i, j)    +    __checkDownSide(current_state, i, j)    +  __checkLeftUpDiagonal(current_state, i, j) +    __checkLeftDownDiagonal(current_state, i, j)    +    __checkRightUpDiagonal(current_state, i, j) + __checkRightDownDiagonal(current_state, i, j);
}

function __opponent_player_utility(current_state,i,j){
    __swap_role();
    let utilValue =  __checkLeftSide(current_state, i, j)    +    __checkRightSide(current_state, i, j)    +    __checkUpSide(current_state, i, j)    +    __checkDownSide(current_state, i, j)    +  __checkLeftUpDiagonal(current_state, i, j) +    __checkLeftDownDiagonal(current_state, i, j)    +    __checkRightUpDiagonal(current_state, i, j) + __checkRightDownDiagonal(current_state, i, j);
    __swap_role();
    return utilValue;
}

function __swap_role(){
    if(ROLE==WHITE) ROLE=BLACK;
    else ROLE=WHITE;
}

function __blocked_utility(current_state,i,j){
    let util_value = 0;
    if(current_state[i][j]==ROLE){
	__swap_role();

	util_value += __checkLeftSide(current_state, i,j-1);
	util_value += __checkRightSide(current_state, i,j+1);
	util_value += __checkUpSide(current_state, i-1,j);
	util_value += __checkDownSide(current_state, i+1,j);
	util_value += __checkLeftUpDiagonal(current_state, i-1,j-1);
	util_value += __checkLeftDownDiagonal(current_state, i+1,j+1);
	util_value += __checkRightUpDiagonal(current_state, i-1,j+1);
	util_value += __checkRightDownDiagonal(current_state, i+1,j-1);
    
	__swap_role();
    }
    util_value = 20*util_value;
    return util_value;
}

function findUtilityValue(current_state){ // 10*n^2 
    let utility_score = 0;
    for(let i=0; i<current_state.length; i++){
	for(let j=0; j<current_state.length; j++){
	    utility_score += __my_player_utility(current_state,i,j) + __blocked_utility(current_state,i,j) - __opponent_player_utility(current_state, i, j);
	}
    }
    //console.log("Utility Score: "+utility_score);
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
