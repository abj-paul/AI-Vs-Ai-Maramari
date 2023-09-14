const express = require("express");
const cors = require("cors");
const minimax = require("./algorithm/Minimax.js")
const game = require("./algorithm/game-rules.js")

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res)=>{
    res.status(200).send({"message":"Server Running"});
});

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

app.post("/ai/solve", (req, res)=>{
    let state = req.body.state;
    let player = req.body.player;

    game.setPlayerRole(player);
    
    let algoResult = minimax.expandAndFindSolution(new minimax.Node(Math.max(), Math.min(),0,state),0);

    console.log(`Handling move of ${player}`);

    let nextMove = null;
    //shuffleArray(algoResult.children);
    algoResult.children.forEach((child)=>{
	if(child.minimaxValue == algoResult.minimaxValue) {
	    nextMove = child;
	    //child.printNode();
	    return;
	}
    })
    res.status(200).send({"state": nextMove.state});
});

app.listen(PORT, (data)=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
