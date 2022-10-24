const app = require('./app');



// ----------------------------------------WHY WE USE Dotenv----------------------------------------------------------------------

//Using the dotenv package, we can add a .env file to our Node.js project to serve as 
//a central place to manage and document environment variables.
//This makes them easier to update, 
//maintain, and perhaps most importantly, to discover. 
//Environment variables allow you to run your Node.js app anywhere.

//---------------------------------------------------------------------------------------------------------------------------------

const dotenv = require('dotenv'); //So to change the PORT we can use Dotenv
const connectDatabase = require("./config/database");

// Handling Uncaught Exception


process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise Rejection`);
    process.exit(1);

})


//config

dotenv.config({ path: "backend/config/config.env" }); //Here we give the path of config file 

//connecting to Database

connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`); //To read and parse the .env file and access the data it contains via the process.env global
})

//unhandled promise rejection 

process.on("unhandledRejection", err => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise Rejection`);

    server.close(() => {
        process.exit(1);
    });
})