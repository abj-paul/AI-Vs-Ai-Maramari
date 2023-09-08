const BLACK = 'b';
const EMPTY = '-';
const WHITE = 'w';
const WINNING_PLY = 5;
const WINNER_SCORE = 50000;
let ROLE  = WHITE;

const whiteFavor = {
        fiveinrow: ["wwwww"],
        livefour: [
            "-wwww-",
        ],
        deadfour: [
            "bwwww-",
            "www-w",
            "ww-ww"
        ],
        livethree: [
            "-www-",
            "ww-w"
        ],
        deadthree: [
            "bwww-",
            "bww-w",
            "bw-ww",
            "ww--w",
            "w-w-w",
            "b-www-b"
        ],
        livetwo: [
            "w---w"
        ],
        deadtwo: [
            "w-w",
            "w--w",
            "bww",
            "bw-w",
            "bw--w",
            "ww"
        ]
    }
    let blackFavor = {
        fiveinrow: ["bbbbb"],
        livefour: [
            "-bbbb-",
        ],
        deadfour: [
            "wbbbb-",
            "bbb-b",
            "bb-bb"
        ],
        livethree: [
            "-bbb-",
            "bb-b"
        ],
        deadthree: [
            "wbbb-",
            "wbb-b",
            "wb-bb",
            "bb--b",
            "b-b-b",
            "w-bbb-w"
        ],
        livetwo: [
            "b---b"
        ],
        deadtwo: [
            "b-b",
            "b--b",
            "wbb",
            "wb-b",
            "wb--b",
            "bb"
        ]
    }

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

function __pattern_exists(pattern, current_state, x, y){
    let exists = true;

    for(let i=0; i<pattern.lenth; i++){
	if( __availableCell(x-i,y,current_state) && pattern[i]!=current_state[x-i][y]) {
	    exists = false;
	    break;
	}
    }
    if(exists) return true;

    for(let i=0; i<pattern.lenth; i++){
	if( __availableCell(x+i,y,current_state) && pattern[i]!=current_state[x+i][y]) {
	    exists = false;
	    break;
	}
    }
    if(exists) return true;

    for(let i=0; i<pattern.lenth; i++){
	if( __availableCell(x,y-i,current_state) && pattern[i]!=current_state[x][y-i]) {
	    exists = false;
	    break;
	}
    }
    if(exists) return true;

    for(let i=0; i<pattern.lenth; i++){
	if( __availableCell(x,y+i,current_state) && pattern[i]!=current_state[x][y+i]) {
	    exists = false;
	    break;
	}
    }
    if(exists) return true;

    //TODO: Diagonal check

}

function findPattern(current_state, pattern){
    let count = 0;
    for(let i=0; i<current_state.length; i++){
	for(let j=0; j<current_state.length; j++){
	    if(__pattern_exists(current_state, pattern, i,j)) count++;
	}
    }

    console.log(pattern,count);
    return count/2; // Because same pattern is counted multiple times
}

function findUtilityValue(current_state, maxplayer){
    let whiteScore = 0, blackScore = 0;

    // Assuming AI ROLE IS WHITE
    for(let i = 0 ; i < whiteFavor.fiveinrow.length ; i++){
        if(findPattern(current_state,whiteFavor.fiveinrow[i]) > 0) return 1000000;
        if(findPattern(current_state,blackFavor.fiveinrow[i]) > 0) return -1000000;
    }
    for(let i = 0 ; i < whiteFavor.livefour.length ; i++){
        if(findPattern(current_state,whiteFavor.livefour[i])) return 100000;
        if(findPattern(current_state,blackFavor.livefour[i]) > 0) return -100000;
    }
    for(let i = 0 ; i < whiteFavor.deadfour.length ; i++){
        if(findPattern(current_state,whiteFavor.deadfour[i]) > 0){
            if(maxPlayer) return 10000;
            else whiteScore += findPattern(current_state,whiteFavor.deadfour[i])*10000;
        }
        if(findPattern(current_state,blackFavor.deadfour[i]) > 0){
            if(!maxPlayer) return -10000;
            else blackScore += findPattern(current_state,blackFavor.deadfour[i])*10000;
        }
    }
    for(let i = 0 ; i < whiteFavor.livethree.length ; i++){
        if(findPattern(current_state,whiteFavor.livethree[i]) > 0){
            if(maxPlayer) return 5000;
            else whiteScore += findPattern(current_state,whiteFavor.livethree[i])*4000;
        }
        if(findPattern(current_state,blackFavor.livethree[i]) > 0){
            if(!maxPlayer) return -4500;
            else blackScore += findPattern(current_state,blackFavor.livethree[i])*4000;
        }
    }
    for(let i = 0 ; i < whiteFavor.deadthree.length ; i++){
        if(findPattern(current_state,whiteFavor.deadthree[i]) > 0){
            if(maxPlayer) return 2000;
            else whiteScore += findPattern(current_state,whiteFavor.deadthree[i])*4000;
        }
        if(findPattern(current_state,blackFavor.deadthree[i]) > 0){
            if(!maxPlayer) return -2000;
            else blackScore += findPattern(current_state,blackFavor.deadthree[i])*4000;
        }
        // if(findPattern(current_state,whiteFavor.deadthree[i]) > 0) whiteScore += findPattern(current_state,whiteFavor.deadthree[i])*300;
        // if(findPattern(current_state,blackFavor.deadthree[i]) > 0) blackScore += findPattern(current_state,blackFavor.deadthree[i])*300;
    }
    for(let i = 0 ; i < whiteFavor.livetwo.length ; i++){
        if(findPattern(current_state,whiteFavor.livetwo[i]) > 0) whiteScore += findPattern(current_state,whiteFavor.livetwo[i])*200;
        if(findPattern(current_state,blackFavor.livetwo[i]) > 0) blackScore += findPattern(current_state,blackFavor.livetwo[i])*200;
    }
    for(let i = 0 ; i < whiteFavor.deadtwo.length ; i++){
        if(findPattern(current_state,whiteFavor.deadtwo[i]) > 0) whiteScore += findPattern(current_state,whiteFavor.deadtwo[i])*100;
        if(findPattern(current_state,blackFavor.deadtwo[i]) > 0) blackScore += findPattern(current_state,blackFavor.deadtwo[i])*100;
    }
    
    if(whiteScore > blackScore) return whiteScore;
    else return -1*blackScore;
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
