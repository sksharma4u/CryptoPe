//First we Install  libraries (expess , mongoose , dotenv)
const express = require('express');
const app = express();

const errorMiddleware = require("./middleware/error")
app.use(express.json()); //express.json() is a built in middleware function in Express . It parses incoming JSON requests and puts the parsed data in req.body.

//Route imports
const product = require("./routes/productRoute");

app.use("/api/v1", product);

//Middleware for Error
app.use(errorMiddleware);

module.exports = app;