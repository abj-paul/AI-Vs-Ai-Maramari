const BLACK = 'b';
const EMPTY = '-';
const WHITE = 'w';

const WINNING_PLY = 5;
const WINNER_SCORE = 50000;
let ROLE  = WHITE;

function setPlayerRole(role){
    ROLE = role;
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


function evaluateBoard(board, player) {
    const opponent = player === 'b' ? 'w' : 'b'; // Opponent's color

    // Define weights for different patterns
    const patternWeights = {
        // Winning patterns
        'wwww-': 1000000,   // Winning pattern for white
        'bbbb-': 1000000,   // Winning pattern for black

        // Potential winning patterns
        'www-w': 10000,     // Potential winning pattern for white
        'bbb-b': 10000,     // Potential winning pattern for black
        '-www': 10000,      // Potential winning pattern for white
        '-bbb': 10000,      // Potential winning pattern for black

        // Open fours
        'www--': 1000,      // Open four for white
        'bbb--': 1000,      // Open four for black
        '--www': 1000,      // Open four for white
        '--bbb': 1000,      // Open four for black

        // Double threes
        'ww-ww': 1000,      // Double threes for white
        'bb-bb': 1000,      // Double threes for black

        // Three with one open end
        'w-ww-w': 500,      // Three with one open end for white
        'b-bb-b': 500,      // Three with one open end for black

        // Double twos
        '-ww-w-': 100,      // Double twos for white
        '-bb-b-': 100,      // Double twos for black

        // Two with one open end
        'ww-w-': 100,       // Two with one open end for white
        'bb-b-': 100,       // Two with one open end for black
        '-w-ww': 100,       // Two with one open end for white
        '-b-bb': 100,       // Two with one open end for black

        // Liveruns (One stone with open ends)
        'w--w': 10,         // Liverun for white
        'b--b': 10,         // Liverun for black

        // Deada (One stone with closed ends)
        'w-w': 1,           // Deada for white
        'b-b': 1            // Deada for black
    };

    let playerScore = 0;
    let opponentScore = 0;

    // Evaluate the board horizontally, vertically, and diagonally
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            // Check patterns in all eight directions from the current position
            const patterns = [
                board[row].slice(col, col + 5).join(''), // Horizontal
                board.map(row => row[col]).slice(row, row + 5).join(''), // Vertical
                board.slice(row, row + 5).map((row, i) => row[col + i]).join(''), // Diagonal (top-left to bottom-right)
                board.slice(row, row + 5).map((row, i) => row[col - i]).join('') // Diagonal (top-right to bottom-left)
            ];

	    for (const pattern of patterns) {
		for(let patternKey in patternWeights){
		    if (pattern.includes(patternKey)) {
			if (pattern.includes(player)) {
			    playerScore += patternWeights[patternKey];
			} else if (pattern.includes(opponent)) {
			    opponentScore += patternWeights[patternKey];
			}
		    }
		}
	    }
	}
    }

    // Calculate the overall utility score for the player
    return playerScore - opponentScore;
}


function findUtilityValue(current_state, minimax){ // 10*n^2
    /*if(minimax) return evaluateBoard(current_state, ROLE);
    else {
	if(ROLE==WHITE) return evaluateBoard(current_state, BLACK);
	else return evaluateBoard(current_state, WHITE);
	}*/

    return evaluateBoard(current_state, BLACK);
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
