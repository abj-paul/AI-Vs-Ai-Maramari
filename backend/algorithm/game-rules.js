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

function evaluateBoard(board,maxPlayer){
    let whiteFavor = {
	fiveinrow: ["wwwww"],
	livefour: [
            "-wwww-",
	],
	deadfour: [
            "bwwww-",
            "ww-ww",
            "ww--w"
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
    };
    
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
    };
    let whitescore = 0, blackscore = 0;
    // let fiveinrow = 0, livefour = 0, livethree = 0, deadfour = 0, deadthree = 0, deadtwo = 0;

    for(let i = 0 ; i < whiteFavor.fiveinrow.length ; i++){
        if(util.findPattern(board,whiteFavor.fiveinrow[i]) > 0) return 1000000;
        if(util.findPattern(board,blackFavor.fiveinrow[i]) > 0) return -1000000;
    }
    for(let i = 0 ; i < whiteFavor.livefour.length ; i++){
        if(util.findPattern(board,whiteFavor.livefour[i])) return 100000;
        if(util.findPattern(board,blackFavor.livefour[i]) > 0) return -100000;
    }
    for(let i = 0 ; i < whiteFavor.deadfour.length ; i++){
        if(util.findPattern(board,whiteFavor.deadfour[i]) > 0){
            if(maxPlayer) return 10000;
            else whitescore += util.findPattern(board,whiteFavor.deadfour[i])*10000;
        }
        if(util.findPattern(board,blackFavor.deadfour[i]) > 0){
            if(!maxPlayer) return -10000;
            else blackscore += util.findPattern(board,blackFavor.deadfour[i])*10000;
        }
    }
    for(let i = 0 ; i < whiteFavor.livethree.length ; i++){
        if(util.findPattern(board,whiteFavor.livethree[i]) > 0){
            if(maxPlayer) return 5000;
            else whitescore += util.findPattern(board,whiteFavor.livethree[i])*4000;
        }
        if(util.findPattern(board,blackFavor.livethree[i]) > 0){
            if(!maxPlayer) return -4500;
            else blackscore += util.findPattern(board,blackFavor.livethree[i])*4000;
        }
    }
    for(let i = 0 ; i < whiteFavor.deadthree.length ; i++){
        if(util.findPattern(board,whiteFavor.deadthree[i]) > 0){
            if(maxPlayer) return 2000;
            else whitescore += util.findPattern(board,whiteFavor.deadthree[i])*4000;
        }
        if(util.findPattern(board,blackFavor.deadthree[i]) > 0){
            if(!maxPlayer) return -2000;
            else blackscore += util.findPattern(board,blackFavor.deadthree[i])*4000;
        }
        // if(util.findPattern(board,whiteFavor.deadthree[i]) > 0) whitescore += util.findPattern(board,whiteFavor.deadthree[i])*300;
        // if(util.findPattern(board,blackFavor.deadthree[i]) > 0) blackscore += util.findPattern(board,blackFavor.deadthree[i])*300;
    }
    for(let i = 0 ; i < whiteFavor.livetwo.length ; i++){
        if(util.findPattern(board,whiteFavor.livetwo[i]) > 0) whitescore += util.findPattern(board,whiteFavor.livetwo[i])*200;
        if(util.findPattern(board,blackFavor.livetwo[i]) > 0) blackscore += util.findPattern(board,blackFavor.livetwo[i])*200;
    }
    for(let i = 0 ; i < whiteFavor.deadtwo.length ; i++){
        if(util.findPattern(board,whiteFavor.deadtwo[i]) > 0) whitescore += util.findPattern(board,whiteFavor.deadtwo[i])*100;
        if(util.findPattern(board,blackFavor.deadtwo[i]) > 0) blackscore += util.findPattern(board,blackFavor.deadtwo[i])*100;
    }
    
    if(whitescore > blackscore) return whitescore;
    else return -1*blackscore;
}


function findUtilityValue(current_state, minimax){ // 10*n^2
    return evaluateBoard(current_state, minimax);
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
