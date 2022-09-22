const app = require('./app');



// ----------------------------------------WHY WE USE Dotenv----------------------------------------------------------------------

//Using the dotenv package, we can add a .env file to our Node.js project to serve as 
//a central place to manage and document environment variables.
//This makes them easier to update, 
//maintain, and perhaps most importantly, to discover. 
//Environment variables allow you to run your Node.js app anywhere.

//---------------------------------------------------------------------------------------------------------------------------------

const dotenv = require('dotenv'); //So to change the PORT we can use Dotenv
//config

dotenv.config({ path: "backend/config/config.env" }); //Here we give the path of config file 


app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`); //To read and parse the .env file and access the data it contains via the process.env global
})