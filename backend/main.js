const express = require("express");
const cors = require("cors");
const minimax = require("./algorithm/Minimax.js")

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res)=>{
    res.status(200).send({"message":"Server Running"});
});

app.post("/ai/solve", (req, res)=>{
    let state = req.body.state;
    let algoResult = minimax.expandAndFindSolution(new minimax.Node(Math.max(), Math.min(),0,state),0);

    let nextMove = null;
    algoResult.children.forEach((child)=>{
	if(child.minimaxValue == algoResult.minimaxValue) {
	    nextMove = child;
	    child.printNode();
	    return;
	}
    })
    console.log("Result is: ");
    nextMove.printNode();
    res.status(200).send({"state": nextMove.state});
});

app.listen(PORT, (data)=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
