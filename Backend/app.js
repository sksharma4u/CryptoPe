//First we Install  libraries (expess , mongoose , dotenv)
const express = require('express');
const cookieParser = require("cookie-parser")
const app = express();

const errorMiddleware = require("./middleware/error")
app.use(express.json()); //express.json() is a built in middleware function in Express . It parses incoming JSON requests and puts the parsed data in req.body.
app.use(cookieParser())

//Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute")

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//Middleware for Error
app.use(errorMiddleware);

module.exports = app;