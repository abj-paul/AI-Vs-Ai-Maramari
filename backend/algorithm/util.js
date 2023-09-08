function boardlines(squares){
    let row_count = 10;
    let col_count = 10;
    let rows = new Array(10)
    let cols = new Array(10)
    let ldgs = new Array(19)
    let rdgs = new Array(19)
    let box = [...squares]
    
    for(let i = 0 ; i < 100 ; i++) if(box[i]==='') box[i] = '-'
    for (let i = 0; i < row_count; i++) {
        rows[i] = ""
        cols[i] = ""
        for (let j = 0; j < col_count; j++) {
            rows[i] += box[i*col_count+j]
            cols[i] += box[i+col_count*j]
        }
    }

    let dgsize = 0, start = 0;
    for(let i = 0 ; i < 19 ; i++){
        start = i;
        if(i>9) start = (i-9)*9+i;
        if(i<10) dgsize = i+1;
        else dgsize--;
        ldgs[i] = ""
        for(let j = 0 ; j < dgsize ; j++){
            ldgs[i] += box[start];
            start+=9
        }
    }
    dgsize = 0; start = 0;
    for(let i = 0 ; i < 19 ; i++){
        start = 9-i;
        if(i>9) start = (i-10)*10+10;
        if(i<10) dgsize = i+1;
        else dgsize--;
        rdgs[i] = "";
        for(let j = 0 ; j < dgsize ; j++){
            rdgs[i] += box[start];
            start+=11
        }
    }
    // for(let i = 0 ; i < 19 ; i++){
    //     console.log("rows",rows[i],"cols",cols[i],"ldgs",ldgs[i],"rdgs",rdgs[i]);
    // }
    return {
        rows:rows,
        cols:cols,
        ldgs:ldgs,
        rdgs:rdgs
    }
}

function findPattern(board,pattern){
    let count = 0;
    let boardstate = boardlines(board)

    for(let i = 0 ; i < board.length ; i++){
        if(i<10){
            if(boardstate.rows[i].includes(pattern)) count++;
            else if(boardstate.rows[i].includes(pattern.split("").reverse().join(""))) count++;
            if(boardstate.cols[i].includes(pattern)) count++;
            else if(boardstate.cols[i].includes(pattern.split("").reverse().join(""))) count++;
        }
        if(boardstate.ldgs[i].includes(pattern)) count++;
        else if(boardstate.ldgs[i].includes(pattern.split("").reverse().join(""))) count++;
        if(boardstate.rdgs[i].includes(pattern)) count++;
        else if(boardstate.rdgs[i].includes(pattern.split("").reverse().join(""))) count++;
    }

    return count;
}


module.exports = findPattern
