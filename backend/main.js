const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/", (req, res)=>{
    res.status(200).send({"message":"Server Running"});
});

app.listen(PORT, (data)=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});
