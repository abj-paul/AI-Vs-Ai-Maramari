const util = require("./util.js");

const BLACK = 'b';
const EMPTY = '-';
const WHITE = 'w';

const WINNING_PLY = 5;
const WINNER_SCORE = 50000;
let ROLE  = WHITE;


function setPlayerRole(role){
    ROLE = role;
}

function isGameOver(state){
    if(util.findPattern(state, "bbbbb") || util.findPattern(state, "wwwww")) return true;
    return false;
}

// Current Rule - return all nearby cells
function findPossibleMoves(current_state) {
    const nearby_cells = new Set();
    // console.log(current_state);
    for (let i = 0; i < current_state.length; i++) {
        for (let j = 0; j < current_state.length; j++) {
            if (current_state[i][j] !== EMPTY) {
                if (__availableCell(i - 1, j - 1, current_state)) nearby_cells.add(`${i - 1},${j - 1}`);
                if (__availableCell(i - 1, j, current_state)) nearby_cells.add(`${i - 1},${j}`);
                if (__availableCell(i - 1, j + 1, current_state)) nearby_cells.add(`${i - 1},${j + 1}`);

                if (__availableCell(i, j - 1, current_state)) nearby_cells.add(`${i},${j - 1}`);
                if (__availableCell(i, j + 1, current_state)) nearby_cells.add(`${i},${j + 1}`);

                if (__availableCell(i + 1, j + 1, current_state)) nearby_cells.add(`${i + 1},${j + 1}`);
                if (__availableCell(i + 1, j, current_state)) nearby_cells.add(`${i + 1},${j}`);
                if (__availableCell(i + 1, j - 1, current_state)) nearby_cells.add(`${i + 1},${j - 1}`);
            }
        }
    }
    return Array.from(nearby_cells).map(cell => {
        const [i, j] = cell.split(',').map(Number);
        return { i, j };
    });
}

function __availableCell(i,j, current_state){
    if(i<0 || j<0 || i>=current_state.length || j>=current_state.length) return false; 

    if(current_state[i][j]==EMPTY) return true;
    return false;
}

function __check_if_defense_is_necessary(current_state){
    //open three. Note that, 4 or 5 length also contains www. So we only consider www.
    const defense_patterns_for_black = {'-www':500, 'ww-w':500}; 
    const defense_patterns_for_white = {'-bbb':500, 'bb-b':500}; 
    const attack_patterns_for_white = {'-wwww':5000, 'w-www':5000, 'ww-ww':5000}; 
    const attack_patterns_for_black = {'-bbbb':5000, 'b-bbb':5000, 'bb-bb':5000}; 
    
    let defenseUrgencyScore = 0;
    let attackUrgencyScore = 0;

    for(let row=0; row<current_state.length; row++){
	for(let col=0; col<current_state[row].length; col++){
	    const patterns = [
   		current_state[row].slice(col, col + 5).join(''), // Horizontal
   		current_state.map(row => row[col]).slice(row, row + 5).join(''), // Vertical
   		current_state.slice(row, row + 5).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
   		current_state.slice(row, row + 5).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
	    ];

	    for(const localPattern of patterns){
		if(ROLE==BLACK){
		    for(const defensePattern in defense_patterns_for_black){
			if(localPattern.includes(defensePattern) || localPattern.includes(defensePattern.split('').reverse().join(''))) defenseUrgencyScore+=defense_patterns_for_black[defensePattern];
		    }

		    for(const attackPattern in attack_patterns_for_black){
			if(localPattern.includes(attackPattern) || localPattern.includes(attackPattern.split('').reverse().join(''))) attackUrgencyScore+=attack_patterns_for_black[attackPattern];
		    }

		}
		else if(ROLE==WHITE){
		    for(const defensePattern in defense_patterns_for_white){
			if(localPattern.includes(defensePattern) || localPattern.includes(defensePattern.split('').reverse().join(''))) defenseUrgencyScore+=defense_patterns_for_white[defensePattern];
		    }
		    for(const attackPattern in attack_patterns_for_white){
			if(localPattern.includes(attackPattern) || localPattern.includes(attackPattern.split('').reverse().join(''))) attackUrgencyScore+=attack_patterns_for_black[attackPattern];
		    }
		}
	    }

	}
    }

    return defenseUrgencyScore>=attackUrgencyScore;
}


function __evaluateAttack(current_state){
    const attackPatternsForBlack = {
	'b':5, 
	'bb':50, '-b-b':50,
	'bbb':500, 'b-bb':500,
	'bbbb':5000, 'bbbb-': 5000, 'b-bbb':5000, 'bb-bb':5000,
	'bbbbb':50000
    };

    const attackPatternsForWhite = {
    'w': 5,
	'ww': 50, '-w-w': 50,
	'www': 500, 'w-ww': 500,
	'wwww': 5000, 'wwww-': 5000, 'w-www': 5000, 'ww-ww': 50000,
	'wwwww': 50000
    };

    let attackScore = 0;
    
    for(let row=0; row<current_state.length; row++){
	for(let col=0; col<current_state[row].length; col++){
	    const patterns = [
   		current_state[row].slice(col, col + 5).join(''), // Horizontal
   		current_state.map(row => row[col]).slice(row, row + 5).join(''), // Vertical
   		current_state.slice(row, row + 5).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
   		current_state.slice(row, row + 5).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
	    ];

	    for(const pattern of patterns){
		if(ROLE==BLACK){
		    if(pattern=='wwwww'){
			console.log("DEBUG-------Found wwwww!");
		    }
		    for(const attackPattern in attackPatternsForBlack){
			if(pattern.includes(attackPattern) || pattern.includes(attackPattern.split('').reverse().join(''))) attackScore += attackPatternsForBlack[attackPattern];
		    }
		}else if(ROLE==WHITE){
		    for(const attackPattern in attackPatternsForWhite){
			if(pattern.includes(attackPattern) || pattern.includes(attackPattern.split('').reverse().join(''))) attackScore += attackPatternsForWhite[attackPattern];
		    }

		}
	    }
	    
	}
    }
		
    return attackScore;
}

function __evaluateDefense(current_state){
    const defensePatternsForWhite = {
	'wbbb': 5000, 'bwbb':5000, 
	'wbbbb': 50000, 'bwbbb':500000, 'bbwbb':50000
    };

    const defensePatternsForBlack = {
	'bwww': 5000, 'wbww':5000, 
	'bwwww': 50000, 'wbwww':50000, 'wwbww':50000
    };


    let defenseScore = 0;
     for(let row=0; row<current_state.length; row++){
	for(let col=0; col<current_state[row].length; col++){
	    const patterns = [
   		current_state[row].slice(col, col + 5).join(''), // Horizontal
   		current_state.map(row => row[col]).slice(row, row + 5).join(''), // Vertical
   		current_state.slice(row, row + 5).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
   		current_state.slice(row, row + 5).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
	    ];

	    for(const pattern of patterns){
		if(ROLE==WHITE){
		    for(const defensePattern in defensePatternsForWhite){
			if(pattern.includes(defensePattern) || pattern.includes(defensePattern.split('').reverse().join('')))
			    defenseScore += defensePatternsForWhite[defensePattern];
		    }
		}
		else if(ROLE==BLACK){
		    for(const defensePattern in defensePatternsForBlack){
			if(pattern.includes(defensePattern) || pattern.includes(defensePattern.split('').reverse().join('')))
			    defenseScore += defensePatternsForBlack[defensePattern];
		    }
		}
	    }
	}
     }
    return defenseScore;
}


function findUtilityValue(current_state, minimax){ 
    if(__check_if_defense_is_necessary(current_state)){
	//console.log("Selected DEFENSE");
	return __evaluateDefense(current_state);
    }
    //console.log("Selected ATTACK");
    return __evaluateAttack(current_state);
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



module.exports = {findPossibleMoves, findUtilityValue, make_move, isGameOver}
